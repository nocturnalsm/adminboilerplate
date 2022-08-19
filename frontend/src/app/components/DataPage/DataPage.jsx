import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Grid, Card, CardContent, Stack, Chip, Tooltip, Typography, CircularProgress, IconButton } from '@mui/material'
import { styled } from '@mui/system'
import MyToast from 'app/components/MyToast'
import axiosInstance from 'axios.js'
import MUIDataTable from "mui-datatables"
import DeleteOptionButton from './DeleteOptionButton'
import EditOptionButton from './EditOptionButton'
import useAuth from 'app/hooks/useAuth'
import _ from 'lodash'
import AddIcon from "@mui/icons-material/Add";
import { ConfirmationDialog } from 'app/components'
import DataPageToolbar from 'app/components/DataPage/DataPageToolbar'

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px',
    },
}))

const DataPage = ({
      columns,
      customToolbar,
      dataMapping,
      dataPermissions,
      dataUrl,
      deleteSuccessMessage,
      editModal,       
      onLoadData,
      onAdd,
      onEdit,
      onCustomToolbarClick,
      onDelete,      
      optionColumn,
      pageTitle,
      rowsPerPageOptions,
      saveSuccessMessage,      
      showOptions,
      toolbarButtons,
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
    const [confirm, setConfirm] = useState({
        opened: false,
        title: '',
        onClose: () => {},
        onConfirm: () => {},
        onOpen: () => {}
    })
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
            setData(dataMapping ? response.data.data.map(dataMapping) : response.data.data)
            setCount(response.data.total)
            setFetchParams(newParams)
            setLoading(false)
        }
    }

    const EditModal = ({children}) => (
        <>
          {children}
        </>
    )

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


    const handleNew = () => {
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
    
    let defaultToolbar = []
    
    if (user.permissions.includes(dataPermissions.add)){
      defaultToolbar.push({
          name: 'add',
          icon: <AddIcon />,
          hoverText: 'Add'
      })    
    } 

    let defaultOptionButtons = []
    if (user.permissions.includes(dataPermissions.edit)){
      defaultOptionButtons = [...defaultOptionButtons, 
        <EditOptionButton 
            onClick={(event, id) => handleEdit(event, id)}
        />
      ]
    }
    if (user.permissions.includes(dataPermissions.delete)){
      defaultOptionButtons = [...defaultOptionButtons,
        <DeleteOptionButton onClick={handleDelete} />
      ]
    }

    const printOption = (option, value) => {
        let
    }
    let defaultOptionColumn = {
        name: 'id',
        title: 'Options',
        buttons: defaultOptionButtons
    }

    const handleToolbar = (event, button) => {
        if (button.name === 'add'){
            handleNew()
        }
    }

    const options = {
      responsive: "standard",
      filters: false,
      rowsPerPage: rowPerPage,
      rowsPerPageOptions: rowsPerPageOptions ?? [2, 5, 10],
      serverSide: true,
      count: count,
      page: page,
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

    if (showOptions ?? true){
        optionColumn = optionColumn ?? defaultOptionColumn
        columns = [...columns, {
          name: optionColumn.name ?? "id",
          label: optionColumn.title ?? "Options",
          options: {
            filter: false,
            sort: false,
            customBodyRender: (value) => (
              <Stack direction="row" spacing={1}>
                {optionColumn.buttons.map((item, key) => (
                  <Fragment key={`row_${value}_${key}`}>{printOption(item, value)}</Fragment>
                ))}
              </Stack>
            )
          }
        }]
    }

    const handleDelete = () => {
        (async () => {           
            axiosInstance.delete(`${dataUrl}/${deleteId}`)
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
            <EditModal 
              data={formData} 
              open={formOpen} 
              onSuccess={handleFormSuccess} 
              onError={handleFormError}
              onClose={() => setFormOpen(false)}
            />
            : ''}
            <ConfirmationDialog title={confirm.title} onConfirmDialogClose={confirm.onCLose} open={confirm.opened} onYesClick={confirm.onConfirm} />
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
