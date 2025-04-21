import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/outline';

export function Sidebar() {
  const location = useLocation(); // ✅ get current path

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Transactions', path: '/transactions', icon: CurrencyDollarIcon },
    { name: 'Budget', path: '/budget', icon: ChartBarIcon },
    { name: 'Profile', path: '/profile', icon: CogIcon },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ₹{
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ₹{
                    location.pathname === item.path
                      ? 'text-indigo-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
