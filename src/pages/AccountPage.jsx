
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AvatarUploadSection from '@/components/account/AvatarUploadSection';
import UserInfoSection from '@/components/account/UserInfoSection';

const AccountPage = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-content">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Account Settings
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Profile Picture Section */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AvatarUploadSection />
          </motion.div>

          {/* User Info Section */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <UserInfoSection user={user} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
  