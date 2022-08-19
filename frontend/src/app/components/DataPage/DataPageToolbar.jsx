import React from 'react'
import { Tooltip, IconButton } from '@mui/material'


const DataPageToolbar = ({buttons, onClick}) => (
    <>
    {buttons.map((item, key) => (
        <Tooltip key={`toolbar_${key}`} title={item.hoverText}>
          <IconButton onClick={event => {
                if (item.onClick){
                    item.onClick(event)
                }
                else {
                    onClick(event, item)
                }
            }}>
            {item.icon}
          </IconButton>
        </Tooltip>
      ))
    }
    </>
)

export default DataPageToolbar