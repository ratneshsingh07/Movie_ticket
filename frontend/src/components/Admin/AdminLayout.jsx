import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  MapPin, 
  Film, 
  Calendar, 
  Users, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';

const AdminLayout = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminTabs = [
    { 
      id: 'overview', 
      name: 'Dashboard', 
      icon: Settings,
      description: 'Overview and statistics'
    },
    { 
      id: 'cinemas', 
      name: 'Cinemas', 
      icon: MapPin,
      description: 'Manage cinema locations'
    },
    { 
      id: 'movies', 
      name: 'Movies', 
      icon: Film,
      description: 'Manage movie catalog'
    },
    { 
      id: 'shows', 
      name: 'Shows', 
      icon: Calendar,
      description: 'Schedule and manage shows'
    },
    { 
      id: 'bookings', 
      name: 'Bookings', 
      icon: Users,
      description: 'Customer bookings'
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Redirect to home after logout
  };

  const goToUserSite = () => {
    window.location.href = '/'; // Go to regular user interface
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">🎬 MovieBook</h1>
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* User Info */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={!isSidebarOpen ? tab.name : ''}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <div className="text-left">
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={goToUserSite}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            title={!isSidebarOpen ? 'Go to User Site' : ''}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>Go to User Site</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
            title={!isSidebarOpen ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {adminTabs.find(tab => tab.id === activeTab)?.name || 'Admin Panel'}
              </h2>
              <p className="text-gray-600">
                {adminTabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;