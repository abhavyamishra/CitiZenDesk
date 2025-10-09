import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { AdminPage } from './AdminPage';
import { ManagerPage } from './ManagerPage';
import { StaffPage } from './StaffPage';
import { UserPage } from './UserPage';

export const DashboardLandingPage = () => {

    const userRole = useSelector(state => state.auth.role);

    switch (userRole) {
        case 'admin':
            return <AdminPage />;
        case 'manager':
            return <ManagerPage />;
        case 'staff':
            return <StaffPage />;
        case 'user':
            return <UserPage />;
        default:
            return <Navigate to="/login" />;
    }
};