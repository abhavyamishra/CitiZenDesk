import { Layout } from 'lucide-react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
function App() {
  
  return (
    <>
    
    
      <Routes>

        {/* public routes */}
        <Route path="/" element={<Layout />} > 
        <Route path="login" element={<LoginPage />} />
        <Route path="about" element={<AboutPage />} />   
        
        </Route>


        {/* 🔒 Protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />

        


      </Routes>
    
      
    
     
    </>
  )
}

export default App;

