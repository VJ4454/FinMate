import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              FinMate
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{currentUser?.name}</span>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}