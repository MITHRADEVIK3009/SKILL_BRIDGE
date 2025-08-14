import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface NavigationHistory {
  current: string;
  previous: string;
  stack: string[];
}

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState<NavigationHistory>({
    current: location.pathname,
    previous: '/',
    stack: [location.pathname]
  });

  useEffect(() => {
    setHistory(prev => {
      // Don't add the same path twice in a row
      if (prev.current === location.pathname) {
        return prev;
      }

      const newStack = [...prev.stack];
      
      // Add current path to stack
      newStack.push(location.pathname);
      
      // Keep only last 10 entries to prevent memory issues
      if (newStack.length > 10) {
        newStack.shift();
      }

      return {
        current: location.pathname,
        previous: prev.current,
        stack: newStack
      };
    });
  }, [location.pathname]);

  const goBack = () => {
    if (history.stack.length > 1) {
      // Get the previous page from stack
      const newStack = [...history.stack];
      newStack.pop(); // Remove current page
      const previousPage = newStack[newStack.length - 1] || '/';
      navigate(previousPage);
    } else {
      // If no history, go to home
      navigate('/');
    }
  };

  const goHome = () => {
    navigate('/');
  };

  const canGoBack = history.stack.length > 1;

  return {
    goBack,
    goHome,
    canGoBack,
    currentPath: history.current,
    previousPath: history.previous,
    navigationStack: history.stack
  };
};
