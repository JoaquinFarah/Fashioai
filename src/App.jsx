
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Route Components
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

// Page Components
import HomePage from "@/pages/HomePage";
import AboutUsPage from "@/pages/AboutUsPage";
import MyPicsPage from "@/pages/MyPicsPage";
import AccountPage from "@/pages/AccountPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";


function App() {
  return (
    <>
      <Routes>
         {/* Routes accessible only when logged OUT (e.g., Login/Signup) */}
        <Route element={<PublicRoute />}>
           <Route path="/login" element={<LoginPage />} />
           {/* Add Signup route here if needed */}
        </Route>

        {/* Routes accessible only when logged IN (protected by Layout) */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="my-pics" element={<MyPicsPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        {/* Fallback 404 Route - accessible regardless of auth status */}
        {/* Consider if 404 should be inside Layout or outside */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
  