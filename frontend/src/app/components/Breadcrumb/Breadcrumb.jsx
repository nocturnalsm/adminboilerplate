import React from 'react'
import { styled, useTheme } from '@mui/system'
import { Icon, Breadcrumbs } from '@mui/material'
import { NavLink } from 'react-router-dom'

const BreadcrumbRoot = styled('div')(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
}))

const BreadcrumbName = styled('h3')(({theme}) => ({
    margin: 0,            
    textTransform: 'capitalize',
    color: theme.palette.text.primary
}))

const SubName = styled('p')(({ theme }) => ({
    textTransform: 'capitalize',
    textDecoration: 'underline',
    color: theme.palette.text.primary,
}))


const StyledIcon = styled(Icon)(() => ({
    marginLeft: 8,
    marginBottom: '4px',
    verticalAlign: 'middle',
}))

const Breadcrumb = ({ routeSegments }) => {
    const theme = useTheme()
    const hint = theme.palette.text.hint

    return (
        <BreadcrumbRoot>            
            <Breadcrumbs
                separator={<Icon sx={{ color: hint }}>navigate_next</Icon>}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >                
                {routeSegments
                    ? routeSegments.map((route, index) => {
                        return index !== routeSegments.length - 1 ? (
                            <NavLink key={index} to={route.path}>
                                <SubName>
                                    {route.name}
                                </SubName>
                            </NavLink>
                        ) : (
                            <BreadcrumbName key={index}>
                                {route.name}
                            </BreadcrumbName>
                        )
                    })
                    : null}
            </Breadcrumbs>
        </BreadcrumbRoot>
    )
}

export default Breadcrumb
