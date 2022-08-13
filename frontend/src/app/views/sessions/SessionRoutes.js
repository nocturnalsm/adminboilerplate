import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const NotFound = Loadable(lazy(() => import("./NotFound")));
const ForgotPassword = Loadable(lazy(() => import("./ForgotPassword")));
const ResetPassword = Loadable(lazy(() => import("./ResetPassword")));
const Login = Loadable(lazy(() => import("./Login")));

const sessionRoutes = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/reset-password/:token',
        element: <ResetPassword />,
    },
    {
        path: '/404',
        element: <NotFound />,
    },
]

export default sessionRoutes
