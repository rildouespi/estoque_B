import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  BoxesIcon,
  ArrowRightLeft,
  FileBarChart,
  LogOut,
} from 'lucide-react';

function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Inventory System</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
          </div>
          <nav className="mt-4">
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/users"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Users
                </Link>
                <Link
                  to="/companies"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <Building2 className="w-5 h-5 mr-3" />
                  Companies
                </Link>
              </>
            )}
            <Link
              to="/products"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Package className="w-5 h-5 mr-3" />
              Products
            </Link>
            <Link
              to="/inventory"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <BoxesIcon className="w-5 h-5 mr-3" />
              Inventory
            </Link>
            <Link
              to="/transactions"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <ArrowRightLeft className="w-5 h-5 mr-3" />
              Transactions
            </Link>
            <Link
              to="/reports"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FileBarChart className="w-5 h-5 mr-3" />
              Reports
            </Link>
          </nav>
          <div className="absolute bottom-0 w-64 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;