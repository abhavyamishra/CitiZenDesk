import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";

// ---------------------------
// USER REGISTRATION
// ---------------------------
export const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, locality } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ username, email, phone, password, locality });
    const tokens = await user.generateAuthTokens();

    res.status(201).json({ message: "User registered successfully", user, tokens });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// USER LOGIN
// ---------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const tokens = await user.generateAuthTokens();
    res.json({ message: "Login successful", user, tokens });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// SUBMIT COMPLAINT
// Users cannot assign urgency; manager will handle it
// ---------------------------
export const submitComplaint = async (req, res) => {
  try {
    const { title, description, deptName } = req.body;
    const files = req.files; 
    const media = files ? files.map(f => f.path) : [];

    const canRaise = await User.canRaiseComplaint(req.user.id, req.user.locality, deptName);
    if (!canRaise) return res.status(400).json({ message: "You have unresolved complaint in this dept & locality" });

    const complaint = await Complaint.create({
      title,
      description,
      deptName,
      author: req.user._id,
      locality: req.user.locality,
      media,
      urgency: "medium", // default, manager can update later
    });

    req.user.complaints.push(complaint._id);
    await req.user.save();

    // Notify manager/admin
    await Notification.create({
      recipientModel: "Manager",
      recipient: null,
      type: "status_update",
      message: `New complaint ${complaint.complaintId} submitted by ${req.user.username}`,
      meta: { complaintId: complaint._id, deptName },
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// GET USER COMPLAINTS
// ---------------------------
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await req.user.getMyComplaints();
    res.json({ complaints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// SUBMIT FEEDBACK
// ---------------------------
export const submitFeedback = async (req, res) => {
  try {
    const { complaintId, rating, comments } = req.body;
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (complaint.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You can only provide feedback for your own complaints" });
    if (!["completed", "completed_late"].includes(complaint.status))
      return res.status(400).json({ message: "Feedback can be submitted only after completion" });

    complaint.feedback = { rating, comments, submittedAt: new Date() };
    complaint.status = "closed";
    await complaint.save();

    res.json({ message: "Feedback submitted successfully", complaint });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// GET USER NOTIFICATIONS
// ---------------------------
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      recipientModel: "User",
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// MARK NOTIFICATION AS READ
// ---------------------------
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await Notification.findById(notificationId);

    if (!notification) return res.status(404).json({ message: "Notification not found" });
    await notification.markAsRead();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
