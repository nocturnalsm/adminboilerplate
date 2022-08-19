import React from 'react'
import OptionButton from 'app/components/DataPage/OptionButton'
import DeleteIcon from '@mui/icons-material/Delete'

const DeleteOptionButton = ({onClick, hoverTitle, ...props}) => {

    return (
        <OptionButton 
            onClick={onClick} 
            title={hoverTitle ?? 'Delete'}
            icon={<DeleteIcon />}
            {...props}
        />
    )

}

export default DeleteOptionButton