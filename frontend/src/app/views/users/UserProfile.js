import React, { Fragment, useState, useEffect } from 'react'
import { Grid, Card, CardContent, Button, Typography, TextField, Avatar, Stack } from '@mui/material'
import { styled } from '@mui/system'
import MyToast from 'app/components/MyToast'
import axiosInstance from 'axios.js'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const UserProfile = () => {

    const [alert, setAlert] = useState({open: false, severity: 'success', message: ''})
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')
    const [profile, setProfile] = useState({
        name: '', email: ''
    })
    const [initials, setInitials] = useState("")

    let initialSecurity = {
        current_password: '',
        password: '',
        password_confirmation: ''
    }
    const [security, setSecurity] = useState(initialSecurity)

    const loadProfile = async (params) => {
        setLoading(true)
        await axiosInstance.get('/user/profile').then(response => {
            setProfile({
                name: response.data.name,
                email: response.data.email
            })
            setLoading(false)
        })
    }

    useEffect(() => {
        loadProfile()
    }, [])

    useEffect(() => {
        let sentences = profile.name.split(" ")
        setInitials((sentences.map(word => word.substring(0,1))).join("").substring(0,2))
    }, [profile])

    const cleanError = value => {
        let keyValue = Object.keys(value)[0]
        if (errors.hasOwnProperty(keyValue)){
            const {[keyValue]: foo, ...rest} = errors
            setErrors(rest)
        }
    }

    const handleChange = (value) => {
        console.log(profile)
        setProfile({...profile, ...value})
        cleanError(value)
    }

    const handleSecurity = (value) => {
        setSecurity({...security, ...value})
        cleanError(value)
    }

    const handleSubmit = (newData) => {
        (async () => {
            setLoading(true)
            await axiosInstance.post("/user/profile", profile).then(response => {
                setAlert({open: true, severity: 'success', message: "Profile update success"})
            })
            .catch(error => {
                setErrors(error.errors)
            })
            .finally(() => {
                setLoading(false)
            })
        })()
    }

    const submitPassword = () => {
        (async () => {
            setLoading(true)
            await axiosInstance.post("/user/change-password", security).then(response => {
                setAlert({open: true, severity: 'success', message: "Password update success"})
                setSecurity(initialSecurity)
            })
            .catch(error => {
                setErrors(error.errors)
            })
            .finally(() => {
                setLoading(false)
            })
        })()
    }

    const handleAlertClose = () => {
        setAlert({open: false});
    }

    const resetForm = (form) => {
        switch (form) {
            case 'profile': loadProfile()
            case 'password' : setSecurity(initialSecurity)
        }
    }

    return (
        <Fragment>
            <MyToast message={alert.message} severity={alert.severity} alert={alert.open} onClose={handleAlertClose} />
            <ContentBox className="profile">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{padding: 2}}>
                            <Typography ml={2} variant="h6">User Profile</Typography>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item sm={4} lg={2}>
                                        <Avatar
                                            sx={{ margin: '1rem auto', width: 80, height: 80, cursor: 'pointer' }}
                                        >{initials}</Avatar>
                                        <List>
                                            <ListItem disablePadding>
                                                <ListItemButton onClick={e => setActiveTab('profile')} selected={activeTab === 'profile'}>
                                                    <ListItemIcon>
                                                        <PersonIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Profile" />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem disablePadding>
                                                <ListItemButton onClick={e => setActiveTab('security')} selected={activeTab === 'security'}>
                                                    <ListItemIcon>
                                                        <LockIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Security" />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    {activeTab === 'profile' ?
                                    (<Grid item sm={8}>
                                        <Typography paragraph={true}>Change your user profile</Typography>
                                        <TextField
                                            autoFocus
                                            error={errors.hasOwnProperty('name')}
                                            helperText={errors.hasOwnProperty('name') ? errors.name : ''}
                                            margin="dense"
                                            label="Your name"
                                            type="text"
                                            disabled={loading}
                                            variant="outlined"
                                            fullWidth
                                            value={profile.name}
                                            onChange={ev => handleChange({name: ev.target.value})}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            label="E-mail Addresse"
                                            type="email"
                                            variant="outlined"
                                            fullWidth
                                            disabled={loading}
                                            value={profile.email}
                                            error={errors.hasOwnProperty('email')}
                                            helperText={errors.hasOwnProperty('email') ? errors.email : ''}
                                            onChange={ev => handleChange({email: ev.target.value})}
                                        />
                                        <Stack direction="row" mt={4} spacing={2}>
                                            <Button disabled={loading} variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
                                            <Button disabled={loading} variant="contained" color="warning" onClick={() => resetForm('profile')}>Reset</Button>
                                        </Stack>
                                    </Grid>) : ''}
                                    {activeTab === 'security' ?
                                    (<Grid item xs={8}>
                                        <Typography paragraph={true}>Change your password</Typography>
                                        <TextField
                                            autoFocus
                                            error={errors.hasOwnProperty('current_password')}
                                            helperText={errors.hasOwnProperty('current_password') ? errors.current_password : ''}
                                            margin="dense"
                                            label="Your current password"
                                            type="password"
                                            variant="outlined"
                                            disabled={loading}
                                            fullWidth
                                            value={security.current_password}
                                            onChange={ev => handleSecurity({current_password: ev.target.value})}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            label="Type your new password"
                                            type="password"
                                            fullWidth
                                            variant="outlined"
                                            disabled={loading}
                                            value={security.password}
                                            error={errors.hasOwnProperty('password')}
                                            helperText={errors.hasOwnProperty('password') ? errors.password : ''}
                                            onChange={ev => handleSecurity({password: ev.target.value})}
                                        />
                                        <TextField
                                            margin="dense"
                                            id="name"
                                            label="Type your new password again"
                                            type="password"
                                            fullWidth
                                            variant="outlined"
                                            disabled={loading}
                                            value={security.password_confirmation}
                                            error={security.password !== security.password_confirmation}
                                            helperText={security.password !== security.password_confirmation ? 'Password confirmation does not match' : ''}
                                            onChange={ev => handleSecurity({password_confirmation: ev.target.value})}
                                        />
                                        <Stack direction="row" mt={4} spacing={2}>
                                            <Button disabled={loading} variant="contained" color="primary" onClick={submitPassword}>Change Password</Button>
                                            <Button disabled={loading} variant="contained" color="warning" onClick={() => resetForm('password')}>Reset</Button>
                                        </Stack>
                                    </Grid>) : ''}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default UserProfile
