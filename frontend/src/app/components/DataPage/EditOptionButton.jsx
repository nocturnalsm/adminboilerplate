import React from 'react'
import OptionButton from 'app/components/DataPage/OptionButton'
import EditIcon from '@mui/icons-material/Edit';

const EditOptionButton = ({onClick, hoverTitle, ...props}) => {

    return (
        <OptionButton 
            onClick={onClick} 
            title={hoverTitle ?? 'Edit'}
            icon={<EditIcon />}
            {...props}
        />
    )

}

export default EditOptionButton