import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This page has been deprecated and removed.
 * Redirects to packages page if accessed directly.
 */
const DeviceSelectionPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/paketler', { replace: true });
  }, [navigate]);

  return null;
};

export default DeviceSelectionPage;