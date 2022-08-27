import { useState, useEffect } from 'react'
import { Button, Grid, Box, Card, CardContent, CardHeader, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/system'
import TextField from '@mui/material/TextField';
import axiosInstance from 'axios.js'
import { useParams } from 'react-router-dom'
import { H3, H4 } from 'app/components/Typography'
import MyToast from 'app/components/MyToast'
import Breadcrumb from 'app/components/Breadcrumb/Breadcrumb'

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: {
      margin: '16px',
  },
}))

const PermissionList = styled(List)(() => ({
    display: 'grid',
    gridTemplateColumns: 'auto auto auto'
}))

const RoleForm = () => {
    let initialData = {
        name: '',
        permissions: []
    }
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(null)
    const [permissions, setPermissions] = useState([])
    const [alert, setAlert] = useState({open: false, severity: 'success', message: ''})
    const { role } = useParams()

    const getPermissions = async () => {
      const response = await axiosInstance.get('/permissions', {
        params: {
          limit: 100000000,
          sort: 'name'
        }
      })
      const permissionData = response.data.data.map(item => {
        return {
            id: item.id,
            name: item.name
        }
      })
      setPermissions(permissionData)
    }

    const loadData = async () => {        
        if (role){
          const response = await axiosInstance.get(`/roles/${role}`)
          if (response.data){
              setFormData({...response.data, permissions: response.data.permissions.map(i => i.name)})
          }
        }
        else {
          setFormData(initialData)
        }
    }

    useEffect(() => {
      getPermissions()      
      loadData()
    }, [])

    const handleChange = field => {
       
        let newData = {...formData, ...field}
        setFormData(newData)
    }

    const handleToggle = (event, name) => {
        let { permissions } = formData
        let index = permissions.indexOf(name)
        if (index > -1){
            permissions.splice(index, 1)
        }
        else {
            permissions.push(name)
        }
        setFormData(f => { return {...f, permissions: permissions}})
    }

    const handleSave = () => {

      const submit = async () => {
          try {
            const response = await axiosInstance({
                method: formData.id !== "" ? 'put' : 'post',
                url: `/roles${formData.id !== '' ? '/' + formData.id : ''}`,
                data: {
                    name: formData.name,
                    permissions: formData.permissions
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
            }
            else {                
                setAlert({open: true, severity: 'success', message: 'Data has been saved!'})
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
      <>
        <MyToast message={alert.message} severity={alert.severity} alert={alert.open} onClose={() => setAlert({open: false})} />
        <ContentBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card sx={{minHeight: 'calc(100% - 1rem)'}}>
                  <CardHeader title={(
                  <Breadcrumb routeSegments={[
                          {
                              name: 'Roles',
                              path: '/roles'
                          },
                          {
                              name: role ? 'Edit Role' : 'New Role'                          
                          }
                        ]}
                  />)}
                  />
                  <CardContent sx={{minHeight: 'calc(100vh - 200px)'}}>
                    {formData ? (
                        <>
                          <TextField
                            autoFocus
                            error={errors.hasOwnProperty('name')}
                            helperText={errors.hasOwnProperty('name') ? errors.name : ''}                          
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
                          <H4 sx={{marginTop: 4}}>Permissions</H4>
                          <Box>
                            <PermissionList>
                                {permissions.map((item, key) => (
                                  <ListItem key={item.name}>                                  
                                      <ListItemIcon>
                                        <Checkbox
                                          onChange={ev => handleToggle(ev, item.name)}                                        
                                          checked={formData.permissions.indexOf(item.name) !== -1}
                                          edge="start"                                     
                                          tabIndex={-1}
                                          disableRipple                                     
                                        />
                                      </ListItemIcon>
                                      <ListItemText primary={item.name} />                                  
                                  </ListItem>
                                ))}
                            </PermissionList>
                          </Box>
                          <Button disabled={loading} variant="contained" color="primary" onClick={handleSave}>Save</Button>
                        </>
                      ) : ''}          
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>                
        </ContentBox>
      </>
    )    
  }

  export default RoleForm