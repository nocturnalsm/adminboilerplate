export const navigations = [
    {
        name: 'Dashboard',
        path: '/dashboard/default',
        icon: 'dashboard',
    },   
    {
        name: 'Administration',
        icon: 'security',
        children: [
            {
                name: 'Users',
                icon: 'people',
                path: '/users',
            },
            {
                name: 'User Roles',
                icon: 'people',
                path: '/roles',
            },
            {
                name: 'User Permissions',
                icon: 'people',
                path: '/permissions',
            }
        ],
    }
]
