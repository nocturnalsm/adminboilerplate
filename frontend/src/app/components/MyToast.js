import React, { useState, useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const MyToast = props => {

    const [open, setOpen] = useState(false)

    useEffect(() => {

      setOpen(props.alert)

    }, [props.alert])

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false)
      props.onClose()
    }

    return (
        <Snackbar
          open={props.alert}          
          autoHideDuration={props.autoHide === false ? null : 6000}
          onClose={handleClose}
          anchorOrigin={props.anchor ?? { horizontal: 'right', vertical: 'top' }}
        >
          <Alert onClose={handleClose} severity={props.severity ?? 'success'} sx={{ width: '100%' }}>
            {props.message}
          </Alert>
        </Snackbar>
    )

}

export default MyToast
