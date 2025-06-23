import React, { useState } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Checkbox,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'

export default function PermissionRow({ group, permissions }) {
  const [selectedKeys, setSelectedKeys] = useState([])

  const toggleCheckbox = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ flexGrow: 1 }}>{group}</Typography>
        <Chip
          color={
            selectedKeys.length === permissions.length ? 'primary' : 'default'
          }
          label={`${selectedKeys.length}/${permissions.length}`}
          size='small'
        />
      </AccordionSummary>

      <AccordionDetails>
        <Box display='flex' flexDirection='column' gap={1}>
          {permissions.map((item) => (
            <Box key={item.key} display='flex' alignItems='center' gap={1}>
              <Checkbox
                checked={selectedKeys.includes(item.key)}
                onChange={() => toggleCheckbox(item.key)}
              />
              <Typography flexGrow={1}>{item.label}</Typography>
              <IconButton color='info'>
                <VisibilityIcon />
              </IconButton>
              <IconButton color='primary'>
                <EditIcon />
              </IconButton>
              <IconButton color='error'>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
