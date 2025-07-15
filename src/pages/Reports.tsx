
// This file is deprecated - redirecting to manager reports
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/manager/reports');
  }, [navigate]);
  
  return null;
};

export default Reports;
