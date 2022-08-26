import {
    IconButton,
    Stack
} from '@mui/material'
import React, { useState } from 'react'
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';


const SocialLogin = () => {

return (
    <Stack 
        justifyContent="center"
        alignItems="center"
        direction="row" 
        spacing={2}
    >
        <IconButton color="primary">
            <GoogleIcon />
        </IconButton>
        <IconButton color="primary">
            <FacebookIcon />
        </IconButton>
        <IconButton color="primary">
            <GitHubIcon />
        </IconButton>
    </Stack>
)}

export default SocialLogin