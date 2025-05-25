import React from 'react'
import { Snackbar, Alert } from '@mui/material'

const SnackbarAlert = ({ snackbar, onClose }) => (
  <Snackbar
    open={!!snackbar}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  >
    <Alert onClose={onClose} severity={snackbar?.type} sx={{ width: '100%' }}>
      {snackbar?.message}
    </Alert>
  </Snackbar>
)

export default SnackbarAlert
