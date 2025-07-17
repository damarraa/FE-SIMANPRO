import {
    HiOutlineViewGrid, 
    HiOutlineUsers, 
    HiOutlineBriefcase, 
    HiOutlineDocumentText, 
    HiOutlineArchive,
    HiOutlineTruck,
    HiOutlineCog
} from 'react-icons/hi';

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <HiOutlineViewGrid />,
        allowedRoles: ['Super Admin', 'Admin', 'Project Manager', 'Logistic']
	},
	{
		key: 'projects',
		label: 'Projects',
		path: '/projects',
		icon: <HiOutlineBriefcase />,
        allowedRoles: ['Super Admin', 'Admin', 'Project Manager', 'Supervisor']
	},
    {
		key: 'daily_reports',
		label: 'Daily Reports',
		path: '/daily-reports',
		icon: <HiOutlineDocumentText />,
        allowedRoles: ['Super Admin', 'Admin', 'Project Manager', 'Supervisor']
	},
	{
		key: 'inventory',
		label: 'Inventory',
		path: '/inventory',
		icon: <HiOutlineArchive />,
        allowedRoles: ['Super Admin', 'Admin', 'Logistic']
	},
    {
		key: 'vehicles',
		label: 'Vehicles & Assets',
		path: '/vehicles',
		icon: <HiOutlineTruck />,
        allowedRoles: ['Super Admin', 'Admin', 'Logistic']
	},
    {
		key: 'user_management',
		label: 'User Management',
		path: '/users',
		icon: <HiOutlineUsers />,
        allowedRoles: ['Super Admin', 'Admin']
	},
    {
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />,
        allowedRoles: ['Super Admin']
	}
]