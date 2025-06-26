import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
  FormControlLabel,
  Stack,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function ModalUploadImage({ open, onClose, onUpload, onCrop }) {
  const [mode, setMode] = useState('upload')
  const [inline, setInline] = useState(false)
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')

  const handleUpload = () => {
    if (mode === 'upload' && file) {
      onUpload(file, inline)
    } else if (mode === 'url' && url) {
      onUpload(url, inline)
    }
    onClose()
  }

  const handleCrop = () => {
    if (mode === 'upload' && file) {
      onCrop(file, inline)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        Add an image
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <ToggleButtonGroup
          fullWidth
          exclusive
          value={mode}
          onChange={(e, val) => val && setMode(val)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value='upload'>Upload</ToggleButton>
          <ToggleButton value='url'>Url</ToggleButton>
        </ToggleButtonGroup>

        {mode === 'upload' ? (
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
        ) : (
          <TextField
            fullWidth
            label='Image URL'
            variant='outlined'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={inline}
              onChange={(e) => setInline(e.target.checked)}
            />
          }
          label='Inline'
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Stack direction='row' spacing={2} width='100%'>
          <Button
            fullWidth
            variant='contained'
            sx={{ backgroundColor: '#111', color: '#fff' }}
            onClick={handleUpload}
          >
            Upload
          </Button>
          <Button
            fullWidth
            variant='contained'
            sx={{ backgroundColor: '#111', color: '#fff' }}
            onClick={handleCrop}
            disabled={mode === 'url'}
          >
            Upload & Crop
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
