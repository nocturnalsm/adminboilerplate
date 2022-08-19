import React, { useEffect, useState } from 'react'
import DataPage from 'app/components/DataPage/DataPage'
import { Stack, Chip } from '@mui/material'
import axiosInstance from 'axios.js'


import UserForm from './UserForm'

const Users = () => {

    const [roles, setRoles] = useState([])
    const dataMapping = (item, key) => {
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
    }

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
      } 
    ]

    return (
        <DataPage
            columns={columns}
            pageTitle="Users"
            saveSuccessMessage="User successfully saved"
            deleteSuccessDelete="User successfully deleted"
            dataMapping={dataMapping}
            dataUrl="/users"
            dataPermissions={{
                add: 'users.add',
                edit: 'users.edit',
                delete: 'users.delete'
            }}
            editModal={<UserForm />}
        />          
    )
}

export default Users
