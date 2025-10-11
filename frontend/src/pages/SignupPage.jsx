// src/pages/SignupPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 
import { FcGoogle } from "react-icons/fc";
// import { Google } from 'lucide-react'; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";  
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Label } from '@radix-ui/react-dropdown-menu';

export const SignupPage = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        locality: '',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await dispatch(signup(formData));
            navigate('/'); 
        } catch (err) {
            
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        
        <div className="mx-auto flex items-center justify-center text-3xl font-bold">
          CitiZenDesk
        </div>

        
        <h2 className="text-2xl text-foreground">
          Create your free account
        </h2>

       
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" name="username" value={formData.username } onChange={handleChange} required />
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="locality">Locality</Label>
                <Input type="text" id="locality" name="locality" value={formData.locality} onChange={handleChange} required />
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <Button type="submit" className="w-full">Sign Up</Button>
        </form>
       {/* <Button 
            type="submit" 
            className="w-full py-6 text-lg bg-foreground text-background hover:bg-foreground/90" 
          > */}
            {/* Continue
          </Button>
        </form> */}

      
        <p className="text-sm text-muted-foreground">
          Already a user?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};