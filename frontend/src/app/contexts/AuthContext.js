import React, { createContext, useEffect, useReducer } from 'react'
import axiosInstance from 'axios.js'
import { MatxLoading } from 'app/components'

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const setSession = (user) => {
    if (user) {
        localStorage.setItem('user', user)
    } else {
        localStorage.removeItem('user')
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload
            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (email, password) => {
        console.log(email)
        await axiosInstance.get(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`);
        await axiosInstance.post(`${process.env.REACT_APP_API_URL}/login`, {
                email: email,
                password: password
        }, {
            headers: {
                'Accept': 'application/json'
            }
        })
        const response = await axiosInstance.get('/user/profile')
        const { data } = response
        setSession(data)
        dispatch({
            type: 'LOGIN',
            payload: {
                user: data,
            },
        })
        return data

    }

    const register = async (email, username, password) => {
        const response = await axiosInstance.post('/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        setSession(null)
        dispatch({ type: 'LOGOUT' })
    }

    useEffect(() => {
        ; (async () => {
            try {
                const user = window.localStorage.getItem('user')                
                if (user) {
                    const response = await axiosInstance.get('/user/profile')
                    const { data } = response
                    setSession(data)
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user: data,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }
    
    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
