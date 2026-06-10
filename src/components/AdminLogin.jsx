
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_BASE_PATH } from '@/constants/adminRoutes';

// Modal AdminLogin is disabled as authentication is completely removed.
const AdminLogin = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (onClose) onClose();
    navigate(ADMIN_BASE_PATH, { replace: true });
  }, [navigate, onClose]);

  return null;
};

export default AdminLogin;
