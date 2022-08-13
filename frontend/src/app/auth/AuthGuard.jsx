import useAuth from 'app/hooks/useAuth'
import { flat } from 'app/utils/utils'
import React from 'react'
import { matchPath } from 'react-router'
import { Navigate, useLocation  } from 'react-router-dom'
import { AllPages } from '../routes/routes'

const authorize = (pathname, user, routes) => {
    if (!user) {
        return false
    }    
    const matched = routes.find((r) => {         
        return r.path && matchPath(r.path, pathname) !== null
    })    
    return matched && matched.auth && matched.auth.length
            ? (typeof matched.auth === 'function' ? matched.auth(user) : user.permissions.indexOf(matched.auth) >= 0)
            : true
}

const AuthGuard = ({ children }) => {
    const { user, isAuthenticated } = useAuth()
    const { pathname } = useLocation()

    const routes = flat(AllPages())    
    const isAuthorized = authorize (
        pathname,
        user,
        routes
    )
    console.log(isAuthenticated, isAuthorized)
    if (isAuthenticated && isAuthorized) return <>{children}</>
    else {
        if (isAuthenticated){
            return (
                <Navigate to="/404" />
            )
        }
        else {
            return (
                <Navigate
                    to="/login"
                    state={{ redirectUrl: pathname }}
                />
            )
        }
    }
}

export default AuthGuard
