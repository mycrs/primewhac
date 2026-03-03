
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Modal AdminLogin is disabled as authentication is completely removed.
const AdminLogin = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (onClose) onClose();
    navigate('/admin', { replace: true });
  }, [navigate, onClose]);

  return null;
};

export default AdminLogin;
