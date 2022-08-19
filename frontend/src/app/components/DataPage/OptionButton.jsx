import React from 'react'
import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'


const Title = styled('span')(() => ({
    marginLeft: 10,
}));

const OptionButton = ({onClick, hoverTitle, icon, label, ...props}) => {

    return (
        <IconButton 
            onClick={onClick} 
            title={hoverTitle ?? null}
            {...props}
        >
            {icon ?? ''}{label ? <Title>{label}</Title> : ''}
        </IconButton>
    )

}

export default OptionButton