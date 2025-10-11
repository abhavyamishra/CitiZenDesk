import React from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import  {Layouts}  from '../layouts/Layouts';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLandingPage } from '../pages/DashboardLandingPage';
import { ComplaintPage } from '../pages/ComplaintPage';
import { LoginPage } from '../pages/LoginPage';
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { SignupPage } from "../pages/SignupPage";
import { ComplaintCreationForm } from '@/components/ComplaintCreationForm';

export const AppRouter = () => {
    return (
          <Routes>
            {/* Public Routes */}
            
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
               {/* // <Route path="/complaint/new" element={<ComplaintCreationForm />} /> */}
           
            {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layouts />}>
                    <Route path="/dashboard" element={<DashboardLandingPage />} />
                     <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                     <Route path="/complaint/new" element={<ComplaintCreationForm />} />


          </Route>
                    
                    <Route path="/complaint/:id" element={<ComplaintPage />} />
                </Route>
            </Route>

            {/* Redirect root path to the dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};