
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const useLogoClickCounter = (targetPath = '/yonetim', clickThreshold = 8, timeout = 2000) => {
  const [count, setCount] = useState(0);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogoClick = useCallback((e) => {
    if (count > 0) e.preventDefault();
    const newCount = count + 1;
    setCount(newCount);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (newCount >= clickThreshold) {
      setCount(0);
      toast({
        title: "Admin Panel",
        description: "Yönetici paneline geçiliyor...",
        className: "bg-purple-600 text-white border-none",
      });
      navigate(targetPath);
    } else {
      timeoutRef.current = setTimeout(() => setCount(0), timeout);
    }
  }, [count, clickThreshold, targetPath, timeout, navigate, toast]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return handleLogoClick;
};
