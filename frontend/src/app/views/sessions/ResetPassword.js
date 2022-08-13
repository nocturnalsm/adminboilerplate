import React, { useState } from 'react'
import { Grid, Card, Button, Typography, Box, TextField } from '@mui/material'
import { styled, useTheme } from '@mui/system'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axiosInstance from 'axios.js'
import { Span } from 'app/components/Typography'

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
}))

const ResetPasswordRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100vh !important',
    '& .card': {
        maxWidth: 400,
        borderRadius: 12,
        margin: '1rem',
    },
}))

const IMG = styled('img')(() => ({
    width: '100%',
}))

const ResetPassword = () => {
    const navigate = useNavigate()
    const { token } = useParams()    
    const [ searchParams, setSearchParams ]  = useSearchParams()
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [data, setData] = useState({
        password: '',
        password_confirmation: '',
        token: token,
        email: searchParams.get('email') || ''
    })
    
    const handleChange = (value) => {
        setData({...data, ...value})
        let keyValue = Object.keys(value)[0]
        if (errors.hasOwnProperty(keyValue)){
            const {[keyValue]: foo, ...rest} = errors
            setErrors(rest)
        }
    }

    const submitPassword = () => {
        (async () => {            
            setLoading(true)            
            await axiosInstance.get(`${process.env.REACT_APP_API_URL}/sanctum/csrf-cookie`);
            await axiosInstance.post(`${process.env.REACT_APP_API_URL}/reset-password`, data).then(response => {
                setSubmitted(true)
            })
            .catch(error => {
                if (error.errors){
                    setErrors(error.errors)
                }
                else {
                    setErrors(error.message ?? 'Problem in resetting password. Please contact support')
                }
            })
            .finally(() => {
                setLoading(false)                
            })
            
        })()
    }

    const { palette } = useTheme()     
    const textPrimary = palette.text.primary
    
    return (
        <ResetPasswordRoot>
            <Card className="card">
                <Grid container>                    
                    <Grid item lg={12}>
                        <ContentBox>
                            <IMG src="/assets/images/logos/art_by_adam_vector.svg" />                            
                            {submitted ? 
                                <Typography paragraph={true}>Your password has been reset. Please 
                                <Button
                                    sx={{ textTransform: 'capitalize' }}
                                    onClick={() => navigate("/login")}
                                >
                                    Sign in
                                </Button> 
                                to continue</Typography>                            
                            : (
                                <>
                                    <Typography paragraph={true}>This is you email password reset page. Please enter your new password</Typography>                            
                                    <TextField
                                        autoFocus
                                        error={errors.hasOwnProperty('email')}
                                        helperText={errors.hasOwnProperty('email') ? errors.email : ''}
                                        margin="dense"
                                        label="Your Email"
                                        type="email"
                                        disabled={loading}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={data.email}
                                        onChange={ev => handleChange({name: ev.target.value})}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        autoFocus
                                        label="Type your new password"
                                        type="password"
                                        fullWidth
                                        variant="outlined"
                                        disabled={loading}
                                        value={data.password}
                                        size="small"
                                        error={errors.hasOwnProperty('password')}
                                        helperText={errors.hasOwnProperty('password') ? errors.password : ''}
                                        onChange={ev => handleChange({password: ev.target.value})}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        size="small"
                                        label="Type your new password again"
                                        type="password"
                                        fullWidth
                                        variant="outlined"
                                        disabled={loading}
                                        value={data.password_confirmation}
                                        error={data.password !== data.password_confirmation}
                                        helperText={data.password !== data.password_confirmation ? 'Password confirmation does not match' : ''}
                                        onChange={ev => handleChange({password_confirmation: ev.target.value})}
                                    />
                                    <FlexBox sx={{marginTop: 1}}>
                                        <Button disabled={loading} variant="contained" color="primary" onClick={submitPassword}>Change Password</Button>
                                        <Span sx={{ mr: 1, ml: '16px' }}>or</Span>
                                        <Button
                                            disabled={loading}
                                            sx={{ color: textPrimary, textTransform: 'capitalize' }}
                                            onClick={() => navigate("/login")}
                                        >
                                            Sign in
                                        </Button>
                                    </FlexBox>
                                </>
                            )}
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </ResetPasswordRoot>
    )
}

export default ResetPassword
