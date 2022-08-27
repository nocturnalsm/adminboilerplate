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
import PermissionForm from './PermissionForm'
import { ConfirmationDialog } from 'app/components'

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const Permissions = () => {

    let initialState = {
        name: '',
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

        await axiosInstance.get(`/permissions?page=${page+1}`, {params: newParams})
        .then(response => {
            setData(response.data.data.map((item, key) => {
                return {
                    id: item.id,
                    name: item.name
                }
            }))
            setCount(response.data.total)
            setFetchParams(newParams)
            setLoading(false)
        })
    }

    useEffect(() =>  {
      loadData({
          page: page,
          sort: sort.name ?? null, order: sort.direction,
          limit: rowPerPage,
          filter: filters
        })
    }, [page, sort, rowPerPage, filters])

    const debounceSearch = useCallback(_.debounce(value => {      
      let search = value ? value.trim() : ''
      let filter = search === "" ? {} : {
          name: value.trim()
      }
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
        const permission = data.find(f => f.id == id)    
        setFormData({...formData, ...permission})
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
        name: "id",
        label: "Options",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <Stack direction="row" spacing={1}>
              {user.permissions.includes("permissions.edit") ?
              <IconButton onClick={() => handleEdit(value)} title="Edit" aria-label="edit">
                <EditIcon />
              </IconButton>
              : ''}
              {user.permissions.includes("permissions.delete") ?
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
        <Tooltip title={"Add Permission"}>
          <IconButton onClick={handleNew}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
    )

    const options = {
      responsive: "standard",
      filterType: 'textField',
      rowsPerPage: rowPerPage,
      rowsPerPageOptions: [2, 5, 10],
      serverSide: true,
      count: count,
      page: page,
      customToolbar: () => {
        return user.permissions.includes('permissions.add') ? <CustomToolbar /> : null
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
        else if (action === "search"){            
            debounceSearch(tableState.searchText)
        }
        else if (action === 'onFilterDialogOpen'){

        }
        else if (action === "filterChange"){
            let filterValues = {}
            tableState.filterList.forEach((item, key) => {
                if (columns[key].filter !== false){
                    let index = columns[key].name
                    filterValues[index] = item[0]
                }
            })
            setFilters(filterValues)
        }
      }
    }

    const handleDelete = () => {
        (async () => {
            axiosInstance.delete(`/permissions/${deleteId}`)
                         .then(response => {
                            if (response.data.error){
                                setAlert({message: response.data.error, severity: "error", open: true})
                            }
                            else {
                                setAlert({message: 'Permission deleted', severity: "success", open: true})
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
            <PermissionForm data={formData} open={formOpen} onSuccess={handleFormSuccess} onError={handleFormError} onClose={() => setFormOpen(false)} />
            <ConfirmationDialog title={"Delete this permission ?"} onConfirmDialogClose={() => setDeleteId(false)} open={deleteId !== false} onYesClick={handleDelete} />
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{minHeight: 'calc(100% - 1rem)'}}>
                          <CardContent sx={{minHeight: 'calc(100vh - 200px)'}}>
                            <MUIDataTable
                              title={
                                <Typography variant="h6">
                                  Permissions
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

export default Permissions
