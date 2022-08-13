import { useState, useEffect } from 'react'
import { Button, IconButton, Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from 'axios.js'


const FormDialogTitle = ({ children, onClose, ...other }) => {

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
}

export default function RoleForm({data, open, onClose, onError, onSuccess}) {

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(null)

    const handleClose = () => {
      onClose()
    }

    useEffect(() => {
        setFormData(f => {
          return {...f, ...data}
        })
    }, [data])

    useEffect(() => {
        if (open){
          setErrors({})
        }
    }, [open])

    const handleChange = field => {
       
        let newData = {...formData, ...field}
        setFormData(newData)
    }

    const handleSave = () => {

      const submit = async () => {
          try {
            const response = await axiosInstance({
                method: formData.id !== "" ? 'put' : 'post',
                url: `/roles${formData.id !== '' ? '/' + formData.id : ''}`,
                data: {
                    name: formData.name
                }
            });
            return response
          }
          catch(error){
              return {
                  message: error.message,
                  errors: error.errors
              }
          }
      }
      setLoading(true)
      submit()
        .then(response => {
            if(response.message){
                if (response.errors){
                  setErrors(response.errors)
                }
                onError(response.message)
            }
            else {
                onSuccess(response.data)
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Dialog open={open} onClose={handleClose}>
          <FormDialogTitle onClose={handleClose}>Roles</FormDialogTitle>
          {formData ? (
            <DialogContent>
              <TextField
                autoFocus
                error={errors.hasOwnProperty('name')}
                helperText={errors.hasOwnProperty('name') ? errors.name : ''}
                margin="dense"
                id="name"
                label="Name"
                size="small"
                name="name"
                disabled={loading}
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={ev => handleChange({name: ev.target.value})}
              />
            </DialogContent>
          ) : ''}
          <DialogActions>
            <Button disabled={loading} variant="contained" color="primary" onClick={handleSave}>Erstellen</Button>
          </DialogActions>
        </Dialog>
    )
  }
