import React from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import  Layout  from '../layouts/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLandingPage } from '../pages/DashboardLandingPage';
import { ComplaintPage } from '../pages/ComplaintPage';
import { LoginPage } from '../pages/LoginPage';import { LoginPage } from "../pages/LoginPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { SignupPage } from "../pages/SignupPage";

export const AppRouter = () => {
    return (
          <Routes>
            {/* Public Routes */}
            
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
           
            {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<DashboardLandingPage />} />
                    <Route path="/complaint/:id" element={<ComplaintPage />} />
                </Route>
            </Route>

            {/* Redirect root path to the dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};