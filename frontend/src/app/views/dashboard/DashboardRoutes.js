import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

const Analytics = Loadable(lazy(() => import('./Analytics')))
const UserProfile = Loadable(lazy(() => import('../users/UserProfile')))
const Users = Loadable(lazy(() => import('../users/Users')))
const Roles = Loadable(lazy(() => import('../roles/Roles')))
const RoleForm = Loadable(lazy(() => import('../roles/RoleForm')))
const Permissions = Loadable(lazy(() => import('../permissions/Permissions')))

const dashboardRoutes = [
    {
        path: '/dashboard',
        element: <Analytics />
    },
    {
        path: '/profile',
        element: <UserProfile />
    },
    {
        path: '/users',
        element: <Users />,
        auth: 'users.list'    
    },
    {
        path: '/roles/create',
        element: <RoleForm />,
        auth: 'roles.add'    
    },
    {
        path: '/roles/:role',
        element: <RoleForm />,
        auth: 'roles.edit'    
    },
    {
        path: '/roles',
        element: <Roles />,
        auth: 'roles.list'    
    },
    {
        path: '/permissions',
        element: <Permissions />,
        auth: 'permissions.list'    
    },
]

export default dashboardRoutes
