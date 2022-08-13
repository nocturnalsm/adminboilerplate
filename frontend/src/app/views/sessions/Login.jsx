import {
    Card,
    Grid,
    Button,
    CircularProgress
} from '@mui/material'
import React, { useState } from 'react'
import useAuth from 'app/hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, styled, useTheme } from '@mui/system'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import { Paragraph } from 'app/components/Typography'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '20px 32px 20px 32px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
    width: '100%',
    height: '200px',
    marginBottom: 20
}))

const JWTRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100% !important',
    '& .card': {
        minWidth: 350,
        maxWidth: '90%',
        borderRadius: 12,
        margin: '1rem',
    },
}))

const StyledProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '6px',
    left: '25px',
}))

const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    })
    const [message, setMessage] = useState('')
    const { login } = useAuth()

    const handleChange = ({ target: { name, value } }) => {
        let temp = { ...userInfo }
        temp[name] = value
        setUserInfo(temp)
    }
    
    const location = useLocation()
    const { palette } = useTheme()
    const textError = palette.error.main
    
    const handleFormSubmit = async (event) => {
        setLoading(true)
        try {
            await login(userInfo.email, userInfo.password)
            let navigateTo = location.state ? location.state.redirectUrl : "/"
            navigate(navigateTo)
        } catch (e) {
            if (e.errors){
                let error = ''
                Object.keys(e.errors).forEach(item => {
                    error += e.errors[item].join("<br />")
                })
                setMessage(error)
            }
            else {
                setMessage(e.message ?? 'Something went wrong.')
            }            
            setLoading(false)
        }
    }

    return (
        <JWTRoot>
            <Card className="card">
                <Grid container>
                    <Grid item md={12} sx={{width: '100%'}}>
                        <ContentBox>
                            <IMG src="/assets/images/illustrations/dreamer.svg" />
                            <ValidatorForm onSubmit={handleFormSubmit}>
                                <TextValidator
                                    sx={{ mb: 3, width: '100%' }}
                                    variant="outlined"
                                    size="small"
                                    label="Email"
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    autoFocus={true}
                                    value={userInfo.email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={[
                                        'this field is required',
                                        'email is not valid',
                                    ]}
                                />
                                <TextValidator
                                    sx={{ mb: '12px', width: '100%' }}
                                    label="Password"
                                    variant="outlined"
                                    size="small"
                                    onChange={handleChange}
                                    name="password"
                                    type="password"
                                    value={userInfo.password}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                                {message && (
                                    <Paragraph sx={{ marginBottom: 2, color: textError }}>
                                        {message}
                                    </Paragraph>
                                )}

                                <FlexBox mb={2} flexWrap="wrap">
                                    <Box position="relative">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            type="submit"
                                        >
                                            Sign in
                                        </Button>
                                        {loading && (
                                            <StyledProgress
                                                size={24}
                                                className="buttonProgress"
                                            />
                                        )}
                                    </Box>
                                    <Button
                                        sx={{ color: palette.text.primary }}
                                        onClick={() =>
                                            navigate('/forgot-password')
                                        }
                                    >
                                        Forgot password?
                                    </Button>
                                </FlexBox>
                            </ValidatorForm>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </JWTRoot>
    )
}

export default Login
