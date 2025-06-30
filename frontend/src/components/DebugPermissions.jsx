import React from 'react'
import usePermissions from '~/hooks/usePermissions'
import { Box, Typography, List, ListItem, Paper } from '@mui/material'

const DebugPermissions = () => {
  const { 
    currentUser, 
    permissions, 
    isLoading, 
    isInitialized,
    hasPermission,
    canAccessAdmin 
  } = usePermissions()

  if (isLoading) {
    return <div>Loading permissions...</div>
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Debug Permissions Info
        </Typography>
        
        <Typography variant="body1">
          <strong>Current User Role:</strong> {currentUser?.role || 'No role'}
        </Typography>
        
        <Typography variant="body1">
          <strong>Is Initialized:</strong> {isInitialized ? 'Yes' : 'No'}
        </Typography>
        
        <Typography variant="body1">
          <strong>Can Access Admin:</strong> {canAccessAdmin() ? 'Yes' : 'No'}
        </Typography>
        
        <Typography variant="body1">
          <strong>Has admin:access:</strong> {hasPermission('admin:access') ? 'Yes' : 'No'}
        </Typography>
        
        <Typography variant="body1">
          <strong>Has category:use:</strong> {hasPermission('category:use') ? 'Yes' : 'No'}
        </Typography>
        
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>All Permissions ({permissions.length}):</strong>
        </Typography>
        
        {permissions.length > 0 ? (
          <List dense>
            {permissions.map((permission, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <Typography variant="body2">• {permission}</Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="error">
            No permissions found
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default DebugPermissions