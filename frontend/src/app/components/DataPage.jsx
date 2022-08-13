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
import AddIcon from "@mui/icons-material/Add";
import { ConfirmationDialog } from 'app/components'

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const defaultOptionColumn = [
  {
    name: 'id',
    title: 'Options',
    buttons: [
      {
        handle: handleEdit,
        icon: <EditIcon />,
        title: "Edit Data",
        arialabel: "Edit,"
      },
      {
        handle: handleDelete,
        icon: <DeleteIcon />,
        title: "Delete Data",
        arialabel: "Delete,"
      }
    ]
  }
]

const DataPage = ({
      columns,
      customToolbar,
      dataMapping,
      dataUrl,
      deleteUrl,
      deleteSuccessMessage,
      editModal,       
      onLoadData,
      onAdd,
      onEdit,
      onDelete,
      optionColumn,
      pageTitle,
      rowsPerPageOptions,
      saveSuccessMessage,      
      showOptions,
      ...props
    }) => {

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
            order: order ?? oldParams.order,
            page: page + 1
        }

        const response = await axiosInstance.get(dataUrl, {params: newParams})
        
        if (response.data){
            setData(dataMapping ? dataMapping() : response.data.data)
            setCount(response.data.total)
            setFetchParams(newParams)
            setLoading(false)
        }
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
        setAlert({open: true, severity: 'success', message: saveSuccessMessage ?? 'Data has been saved!'})
        loadData(fetchParams)
        setFormOpen(false)
    }

    const handleFormError = message => {
        setAlert({open: true, severity: 'error', message: message})
    }

    const handleAlertClose = () => {
        setAlert({open: false});
    }

    const handleEdit = (event, id) => {
        const edited = data.find(f => f.id == id)    
        setFormData({...formData, ...edited})
        setFormOpen(true)
    }    
    
    const EditModal = props => {      
        return editModal({...props, 
          data: formData,
          open: formOpen,
          onSuccess: handleFormSuccess,
          onError: handleFormError,
          onClose: () => setFormOpen(false)          
        })
    }

    const options = {
      responsive: "standard",
      filters: false,
      rowsPerPage: rowPerPage,
      rowsPerPageOptions: rowsPerPageOptions ?? [2, 5, 10],
      serverSide: true,
      count: count,
      page: page,
      customToolbar: customToolbar ?? null,
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

    useEffect(() => {
        if (showOptions ?? true){
          optionColumn = optionColumn ?? defaultOptionColumn
          columns.push({
            name: optionColumn.name ?? "id",
            label: optionColumn.title ?? "Options",
            options: {
              filter: false,
              sort: false,
              customBodyRender: (value) => (
                <Stack direction="row" spacing={1}>
                  {optionColumn.buttons.map((item, key) => {
                    return user.permissions.includes(item.permission) ? (
                        <IconButton 
                            key={`option_${optionColumn.name ?? 'id'}_${key}`}
                            onClick={event => item.handle(event, value)} 
                            title={item.title ?? ''} 
                            aria-label={item.arialabel ?? ''}>
                          {item.icon}
                        </IconButton>
                      ) : ''
                  })}
                </Stack>
              )
            }
          })
        }
    }, [])

    const handleDelete = () => {
        (async () => {           
            axiosInstance.delete(`${deleteUrl}/${deleteId}`)
                         .then(response => {
                            if (response.data.error){
                                setAlert({message: response.data.error, severity: "error", open: true})
                            }
                            else {
                                setAlert({message: deleteSuccessMessage ?? 'Data Deleted', severity: "success", open: true})
                                loadData(fetchParams)
                            }
                            if (onDelete){
                                onDelete()
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
            {editModal ?
            <EditModal />
            : ''}
            <ConfirmationDialog title={"Delete this permission ?"} onConfirmDialogClose={() => setDeleteId(false)} open={deleteId !== false} onYesClick={handleDelete} />
            <ContentBox>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <MUIDataTable
                              title={
                                <Typography variant="h6">
                                  {pageTitle ?? ''}
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

export default DataPage
