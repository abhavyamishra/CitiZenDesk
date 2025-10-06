import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel", // dynamic: "User", "Staff", "Manager", "Admin"
      required: true,
    },
    recipientModel: {
      type: String,
      enum: ["User", "Staff", "Manager", "Admin"],
      required: true,
    },
    type: {
      type: String,
      enum: ["status_update", "sla_breach", "assignment", "feedback", "general"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: Object, // optional: store related IDs like complaintId, staffId, etc.
      default: {},
    },
  },
  { timestamps: true }
);

// Mark as read
notificationSchema.methods.markAsRead = async function () {
  this.read = true;
  await this.save();
};

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
