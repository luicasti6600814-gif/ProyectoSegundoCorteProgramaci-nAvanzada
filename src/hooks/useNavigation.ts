import { useNavigate, useLocation } from 'react-router-dom';
import { AppRoute } from '../types';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (route: AppRoute) => {
    navigate(route);
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToHistory = () => {
    navigate('/history');
  };

  const isActiveRoute = (route: AppRoute) => {
    return location.pathname === route;
  };

  const goBack = () => {
    navigate(-1);
  };

  return {
    currentPath: location.pathname as AppRoute,
    goTo,
    goToHome,
    goToHistory,
    goBack,
    isActiveRoute,
  };
};