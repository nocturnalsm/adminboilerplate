import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Grid, Card, CardContent, Stack, Chip, Tooltip, Typography, CircularProgress, IconButton } from '@mui/material'
import { styled } from '@mui/system'
import MyToast from 'app/components/MyToast'
import axiosInstance from 'axios.js'
import MUIDataTable from "mui-datatables";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useAuth from 'app/hooks/useAuth'
import _ from 'lodash'
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UserForm from './UserForm'
import { ConfirmationDialog } from 'app/components'

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const Users = () => {

    let initialState = {
        name: '',
        email: '',
        roles: [],
        password: '',
        id: ''
    }

    const [formOpen, setFormOpen] = useState(false)
    const [alert, setAlert] = useState({open: false, severity: 'success', message: ''})
    const [data, setData] = useState(["Loading Data..."])
    const [page, setPage] = useState(0)
    const [fetchParams, setFetchParams] = useState({})
    const [count, setCount] = useState(1)
    const [sort, setSort] = useState({name: '', direction: 'asc'})
    const [filters, setFilters] = useState({})
    const [rowPerPage, setRowPerPage] = useState(10)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const [roles, setRoles] = useState([])
    const [deleteId, setDeleteId] = useState(false)
    const { user } = useAuth()

    const loadData = async (params) => {

        setLoading(true)
        params = params ?? {}
        let oldParams = {limit: 10, filter: null, sort: null, order: 'asc'}
        let {limit, filter, sort, order} = params
        let newParams = {
            limit: limit ?? oldParams.limit,
            filter: {...oldParams.filter, ...filter},
            sort: sort ?? oldParams.sort,
            order: order ?? oldParams.order
        }

        await axiosInstance.get(`/users?page=${page+1}`, {params: newParams})
        .then(response => {
            setData(response.data.data.map((item, key) => {
                return {
                    id: item.id,
                    name: item.name,
                    email: item.email,
                    roles: item.roles.map(role => {
                        return {
                            id: role.id,
                            name: role.name
                        }
                    }),
                }
            }))
            setCount(response.data.total)
            setFetchParams(newParams)
            setLoading(false)
        })
    }

    useEffect(() =>  {
      console.log(filters)
      loadData({
          page: page,
          sort: sort.name ?? null, order: sort.direction,
          limit: rowPerPage,
          filter: filters
        })
    }, [page, sort, rowPerPage, filters])

    const getRoles = async () => {
        const response = await axiosInstance.get("/roles", {
          params: {
            filter: {hide: true},
            limit: 100000000
          }
        })
        const roleData = response.data.data.map(item => {
            return {
                id: item.id,
                name: item.name
            }
        })
        setRoles([{id: '', name: ''}, ...roleData])
    }

    useEffect(() => {
      getRoles()      
    }, [])
    
    const debounceSearch = useCallback(_.debounce(filter => {      
        loadData({filter: filter})
    }, 500), []);    

    const handleNew = (ev) => {
        setFormOpen(true)
        setFormData(initialState)
    }

    const handleFormSuccess = (newData) => {
        setAlert({open: true, severity: 'success', message: 'Data has been saved!'})
        loadData(fetchParams)
        setFormOpen(false)
    }

    const handleFormError = message => {
        setAlert({open: true, severity: 'error', message: message})
    }

    const handleAlertClose = () => {
        setAlert({open: false});
    }

    const handleEdit = (id) => {
        const user = data.find(f => f.id == id)    
        setFormData({...formData, ...user})
        setFormOpen(true)
    }


    const columns = [
      {
        name: "name",
        label: "Name",
        options: {
         filter: true,
         sort: true,
        }
       },
       {
        name: "email",
        label: "Email",
        options: {
         filter: true,
         sort: true,
        }
       },
       {
        name: "roles",
        label: "Role",
        options: {
         filter: false,
         sort: false,
         customBodyRender: (value) => (
          <Stack direction="row" spacing={1}>
            {value ? value.map((item, key) => (
                <Chip key={`role_${item.id}_${key}`} size="small" label={item.name} color="success" />
            )) : ''}
          </Stack>
         )
        }
       },
       {
        name: "id",
        label: "Options",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <Stack direction="row" spacing={1}>
              {user.permissions.includes("users.edit") ?
              <IconButton onClick={() => handleEdit(value)} title="Edit" aria-label="edit">
                <EditIcon />
              </IconButton>
              : ''}
              {user.permissions.includes("users.delete") ?
              <IconButton onClick={() => setDeleteId(value)} title="Delete" aria-label="delete">
                <DeleteIcon />
              </IconButton>
              : ''}
            </Stack>
          )
        }
      }
    ]

    const CustomToolbar = () => (
        <Tooltip title={"Add User"}>
          <IconButton onClick={handleNew}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
    )

    const options = {
      responsive: "standard",
      rowsPerPage: rowPerPage,
      rowsPerPageOptions: [2, 5, 10],
      serverSide: true,
      count: count,
      page: page,
      filterType: 'textField',
      customToolbar: () => {
        return user.permissions.includes('users.add') ? <CustomToolbar /> : null
      },
      onTableChange: (action, tableState) => {        
        if (action === "changePage") {
            setPage(tableState.page)
        }
        else if (action === "sort"){
            setSort(tableState.sortOrder)
        }
        else if (action === "changeRowsPerPage"){
            setRowPerPage(tableState.rowsPerPage)
        }
        else if (action === "filterChange"){
            let filterValues = tableState.filterList.reduce((items, item, key) => {
                if (tableState.columns[key].filter == true && item[0]){
                    items = {...items, [tableState.columns[key].name]: item[0]}
                }
                return items
            }, {})
            debounceSearch(filterValues)
        }
      }
    }

    const handleDelete = () => {
        (async () => {
            axiosInstance.delete(`/users/${deleteId}`)
                         .then(response => {
                            if (response.data.error){
                                setAlert({message: response.data.error, severity: "error", open: true})
                            }
                            else {
                                setAlert({message: 'User deleted', severity: "success", open: true})
                                loadData(fetchParams)
                            }
                         })
                         .finally(() => {
                              setDeleteId(false)
                         })
        })()
    }

    return (
        <Fragment>
            <MyToast message={alert.message} severity={alert.severity} alert={alert.open} onClose={handleAlertClose} />
            <UserForm roles={roles} data={formData} open={formOpen} onSuccess={handleFormSuccess} onError={handleFormError} onClose={() => setFormOpen(false)} />
            <ConfirmationDialog title={"Delete this user ?"} onConfirmDialogClose={() => setDeleteId(false)} open={deleteId !== false} onYesClick={handleDelete} />
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{minHeight: 'calc(100% - 1rem)'}}>
                          <CardContent sx={{minHeight: 'calc(100vh - 200px)'}}>
                            <MUIDataTable
                              title={
                                <Typography variant="h6">
                                  Users
                                  {loading && (
                                    <CircularProgress
                                      size={24}
                                      style={{ marginLeft: 15, position: "relative", top: 4 }}
                                    />
                                  )}
                                </Typography>
                              }
                              data={data}
                              columns={columns}
                              options={options}
                            />
                          </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment>
    )
}

export default Users
