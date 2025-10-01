import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationProps } from '../../types';

const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="glass-card sticky top-0 z-50 mx-4 mt-4 rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo y título */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-xl font-bold text-white hover:text-blue-200 transition duration-200"
          >
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <span className="text-white text-2xl">🤖</span>
            </div>
            <span className="hidden sm:block text-shadow">Reconocimiento de Dígitos</span>
            <span className="sm:hidden text-shadow">Reconocimiento</span>
          </Link>
          
          {/* Menú desktop */}
          <div className="hidden md:flex space-x-1">
            <Link 
              to="/" 
              className={`px-5 py-3 rounded-xl font-medium transition duration-200 flex items-center space-x-2 backdrop-blur-sm ${
                location.pathname === '/' 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span></span>
              <span>Inicio</span>
            </Link>
            <Link 
              to="/history" 
              className={`px-5 py-3 rounded-xl font-medium transition duration-200 flex items-center space-x-2 backdrop-blur-sm ${
                location.pathname === '/history' 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span></span>
              <span>Historial</span>
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition duration-200 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-3 backdrop-blur-sm ${
                  location.pathname === '/' 
                    ? 'bg-white/20 text-white shadow-inner' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span></span>
                <span>Inicio</span>
              </Link>
              <Link 
                to="/history" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-3 backdrop-blur-sm ${
                  location.pathname === '/history' 
                    ? 'bg-white/20 text-white shadow-inner' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span></span>
                <span>Historial</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;