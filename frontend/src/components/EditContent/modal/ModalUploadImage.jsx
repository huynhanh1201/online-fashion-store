import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ToolTip from '@mui/material/Tooltip'
import { uploadImageToCloudinary } from '~/utils/cloudinary' // Import the Cloudinary upload function

export default function ModalUploadImage({ open, onClose, onUpload }) {
  const [inline, setInline] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (file) {
      // Upload the image to Cloudinary
      const result = await uploadImageToCloudinary(file)
      if (result.success) {
        // Use the Cloudinary URL to insert the image
        onUpload(result.url, inline)
      } else {
        console.error('Failed to upload image:', result.error)
      }
    }

    // Reset after upload
    setFile(null)
    setPreview(null)
    setInline(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }

  const handleRemoveImage = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleClickSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        Thêm ảnh review
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            width: 500,
            height: 500,
            border: '2px dashed #ccc',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            mx: 'auto',
            mb: 2,
            cursor: preview ? 'default' : 'pointer',
            backgroundColor: '#fafafa'
          }}
          onClick={preview ? undefined : handleClickSelect}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt='preview'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}
              >
                <ToolTip title='Chọn ảnh khác'>
                  <IconButton
                    color='primary'
                    onClick={handleClickSelect}
                    sx={{
                      backgroundColor: '#fff',
                      '&:hover': { backgroundColor: '#eee' }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </ToolTip>
                <ToolTip title='Xoá ảnh'>
                  <IconButton
                    color='error'
                    onClick={handleRemoveImage}
                    sx={{
                      backgroundColor: '#fff',
                      '&:hover': { backgroundColor: '#eee' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ToolTip>
              </Box>
            </>
          ) : (
            <Typography color='text.secondary'>
              Click để chọn ảnh review
            </Typography>
          )}
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          fullWidth
          variant='contained'
          sx={{ backgroundColor: '#111', color: '#fff' }}
          onClick={handleUpload}
          disabled={!file}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  )
}
