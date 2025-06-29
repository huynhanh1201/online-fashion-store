// CustomImage.js
import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { Box, Stack, IconButton, Tooltip as MuiTooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import { uploadImageToCloudinary } from '~/utils/cloudinary' // Import the Cloudinary upload function

// --- ImageComponent ---
const ImageComponent = ({ node, updateAttributes, deleteNode }) => {
  const { src, alt, title, align = 'center' } = node.attrs
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false) // Add loading state

  const handleAlign = (value) => updateAttributes({ align: value })

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true) // Set loading to true when upload starts
      try {
        const result = await uploadImageToCloudinary(file)
        if (result.success) {
          updateAttributes({ src: result.url })
        } else {
          console.error('Failed to upload image:', result.error)
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setLoading(false) // Set loading to false when upload ends
      }
    }
  }

  return (
    <NodeViewWrapper
      as='div'
      data-align={align}
      style={{ textAlign: align, display: 'block', margin: '1rem 0' }}
    >
      {loading ? (
        <p>Đang tải ảnh...</p>
      ) : (
        <Box
          sx={{
            display: 'inline-block',
            position: 'relative',
            maxWidth: '800px',
            maxHeight: '700px'
          }}
        >
          <img
            src={src}
            alt={alt}
            title={title}
            style={{
              display: 'block',
              maxWidth: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 4,
              margin: '0 auto'
            }}
          />

          {/* Nút chỉnh sửa và xoá */}
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              display: 'flex',
              gap: 1,
              borderRadius: 1,
              padding: '2px'
            }}
          >
            <MuiTooltip title='Chọn ảnh khác'>
              <IconButton
                color='primary'
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  backgroundColor: '#fff',
                  '&:hover': { backgroundColor: '#eee' }
                }}
              >
                <EditIcon />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title='Xoá ảnh'>
              <IconButton
                color='error'
                onClick={() => deleteNode()}
                sx={{
                  backgroundColor: '#fff',
                  '&:hover': { backgroundColor: '#eee' }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </MuiTooltip>
          </Box>
          {/* Nút căn lề */}
          <Stack
            direction='row'
            spacing={1}
            justifyContent='center'
            alignItems='center'
            sx={{ mt: 1 }}
          >
            {['left', 'center', 'right'].map((val) => (
              <MuiTooltip key={val} title={`Căn ${val}`} arrow>
                <IconButton
                  size='small'
                  onClick={() => handleAlign(val)}
                  color={align === val ? 'primary' : 'default'}
                >
                  {
                    {
                      left: <FormatAlignLeftIcon fontSize='small' />,
                      center: <FormatAlignCenterIcon fontSize='small' />,
                      right: <FormatAlignRightIcon fontSize='small' />
                    }[val]
                  }
                </IconButton>
              </MuiTooltip>
            ))}
          </Stack>
          {/* Input ảnh ẩn */}
          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Box>
      )}
    </NodeViewWrapper>
  )
}

// --- Extension CustomImage ---
export const CustomImage = Node.create({
  name: 'image',
  group: 'block',
  inline: false,
  atom: true,
  draggable: true,
  selectable: false, // Make it non-selectable
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') || 'center',
        renderHTML: (attributes) => ({ 'data-align': attributes.align })
      }
    }
  },
  parseHTML() {
    return [{ tag: 'img[src]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'custom-image-wrapper' }),
      ['img', HTMLAttributes]
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },
  addCommands() {
    return {
      setImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs })
    }
  }
})
