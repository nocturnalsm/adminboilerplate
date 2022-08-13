import React, { useState } from 'react'
import { Box, styled, useTheme } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { Span, Paragraph } from 'app/components/Typography'
import { Card, Grid, Button, Typography } from '@mui/material'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import axiosInstance from 'axios.js'

const FlexBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: 'center',
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    padding: '32px',
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.01)',
}))

const IMG = styled('img')(() => ({
    width: '100%',
}))

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
    background: '#1A2038',
    minHeight: '100vh !important',
    '& .card': {
        maxWidth: 800,
        borderRadius: 12,
        margin: '1rem',
    },
}))


const ForgotPassword = () => {
    const navigate = useNavigate()
    const [state, setState] = useState({})
    const [resetStatus, setResetStatus] = useState(false)
    const [errors, setErrors] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = ({ target: { name, value } }) => {
        setState({
            ...state,
            [name]: value,
        })
    }

    const handleFormSubmit = async (event) => {
        setLoading(true)
        await axiosInstance.post(`${process.env.REACT_APP_API_URL}/forgot-password`, state)
                           .then(response => {
                               setResetStatus("Please check your email, we have sent you a link to change your password")
                           })
                           .catch(err => {
                                if (err.errors){
                                    let error = ''
                                    Object.keys(err.errors).forEach(item => {
                                        error += err.errors[item].join("<br />")
                                    })
                                    setErrors(error)
                                }
                                else {
                                    setErrors("Error occured")
                                }   
                           })
                           .finally(() => {
                               setLoading(false)
                           })
    }

    let { email } = state
    const { palette } = useTheme()    
    const textPrimary = palette.text.primary
    const textError = palette.error.main

    return (
        <ForgotPasswordRoot>
            <Card className="card">
                <Grid container>                    
                    <Grid item lg={12}>
                        <ContentBox>
                            <IMG src="/assets/images/logos/art_by_adam_vector.svg" />                                                        
                            {resetStatus === false ? 
                            <ValidatorForm onSubmit={handleFormSubmit}>
                                {errors ? (
                                    <Paragraph sx={{ marginBottom: 2, color: textError }}>
                                        {errors}
                                    </Paragraph>
                                ) : (
                                    <Paragraph mb={1}>
                                        Enter your email to reset your password
                                    </Paragraph>
                                )}
                                <TextValidator
                                    sx={{ mb: 3, width: '100%' }}
                                    variant="outlined"
                                    label="Email"
                                    onChange={handleChange}
                                    type="email"
                                    disabled={loading}
                                    name="email"
                                    size="small"
                                    value={email || ''}
                                    validators={['required', 'isEmail']}
                                    errorMessages={[
                                        'Email is required',
                                        'email is not valid',
                                    ]}
                                />                                
                                <FlexBox>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        Reset Password
                                    </Button>
                                    <Span sx={{ mr: 1, ml: '16px' }}>or</Span>
                                    <Button
                                        disabled={loading}
                                        sx={{ color: textPrimary, textTransform: 'capitalize' }}
                                        onClick={() => navigate("/login")}
                                    >
                                        Sign in
                                    </Button>
                                </FlexBox>
                            </ValidatorForm>
                            : <Typography paragraph={true}>{resetStatus}</Typography>}
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </ForgotPasswordRoot>
    )
}

export default ForgotPassword
