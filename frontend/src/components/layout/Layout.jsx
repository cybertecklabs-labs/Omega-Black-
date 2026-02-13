import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { setTheme } from '../../redux/slices/uiSlice';
import {
    HomeIcon,
    CpuChipIcon,
    ShieldExclamationIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    PlayIcon,
    ArrowRightOnRectangleIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'AI Agent', href: '/agent', icon: CpuChipIcon },
    { name: 'Targets', href: '/targets', icon: HomeIcon }, // User didn't provide TargetIcon, using HomeIcon as fallback or placeholder
    { name: 'Vulnerabilities', href: '/vulnerabilities', icon: ShieldExclamationIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
    { name: 'n8n Workflows', href: '/n8n', icon: PlayIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Layout() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center h-16 px-4 border-b">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            OMEGA BLACK
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-6 w-6 ${isActive
                                                    ? 'text-gray-500 dark:text-gray-300'
                                                    : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500'
                                                }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center w-full">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.role}
                                </p>
                            </div>
                            <button
                                onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <div className="py-6 px-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
