import React, { useEffect, useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { Box, IconButton, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'
import { CloudinaryProduct, URI } from '~/utils/constants'

const uploadToCloudinary = async (file, folder = CloudinaryProduct) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', folder)

  const res = await fetch(URI, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('Upload thất bại')
  const data = await res.json()
  return data.secure_url
}

export default function ProductDescriptionEditor({
  control,
  defaultValue = '',
  name = 'description',
  initialHtml = '',
  setValue
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
  const replaceImageInputRef = useRef()

  const uploadImageFunction = async (file) => {
    try {
      const secureUrl = await uploadToCloudinary(file)
      return { data: { link: secureUrl } }
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error)
      return Promise.reject(error)
    }
  }

  const replaceImageInDescription = (editorState, oldImageUrl, newImageUrl) => {
    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)
    const htmlContent = draftToHtml(rawContent)
    const updatedHtmlContent = htmlContent.replace(oldImageUrl, newImageUrl)

    const contentBlock = htmlToDraft(updatedHtmlContent)
    const newContentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    )
    return EditorState.createWithContent(newContentState)
  }

  const handleReplaceImage = async (e) => {
    const file = e.target.files[0]
    if (file && selectedImageUrl) {
      try {
        const newImageUrl = await uploadToCloudinary(file)
        const newEditorState = replaceImageInDescription(
          editorState,
          selectedImageUrl,
          newImageUrl
        )
        setEditorState(newEditorState)
        const content = draftToHtml(
          convertToRaw(newEditorState.getCurrentContent())
        )
        setValue(name, content)
        setSelectedImageUrl(null)
        if (replaceImageInputRef.current)
          replaceImageInputRef.current.value = ''
      } catch (error) {
        alert('Có lỗi khi upload ảnh mới.')
        console.error(error)
      }
    }
  }

  const blockRendererFn = (contentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0)
      if (entityKey) {
        const entity = editorState.getCurrentContent().getEntity(entityKey)
        if (entity.getType() === 'IMAGE') {
          const { src } = entity.getData()
          return {
            component: () => (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={src}
                  alt='description-img'
                  style={{ maxWidth: '500px', display: 'block' }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    zIndex: 999,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  onMouseUp={() => setSelectedImageUrl(src)}
                >
                  <Typography variant='body2' sx={{ userSelect: 'none' }}>
                    Sửa ảnh
                  </Typography>
                </IconButton>
              </Box>
            ),
            editable: false
          }
        }
      }
    }
    return null
  }

  useEffect(() => {
    if (selectedImageUrl && replaceImageInputRef.current) {
      const timeout = setTimeout(() => {
        replaceImageInputRef.current.click()
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [selectedImageUrl])

  useEffect(() => {
    if (initialHtml) {
      const contentBlock = htmlToDraft(initialHtml)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )
        setEditorState(EditorState.createWithContent(contentState))
      }
    }
  }, [initialHtml])

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Mô tả sản phẩm
          </label>
          <Editor
            editorState={editorState}
            onEditorStateChange={(newState) => {
              setEditorState(newState)
              const content = draftToHtml(
                convertToRaw(newState.getCurrentContent())
              )
              field.onChange(content)
              setValue && setValue(name, content)
            }}
            wrapperClassName='editor-wrapper'
            editorClassName='editor-content'
            blockRendererFn={blockRendererFn}
            toolbar={{
              options: [
                'inline',
                'fontSize',
                'fontFamily',
                'list',
                'link',
                'image'
              ],
              inline: {
                options: ['bold', 'italic', 'underline', 'strikethrough']
              },
              fontSize: { options: [10, 12, 14, 16, 18, 24, 36, 48] },
              fontFamily: {
                options: [
                  'Arial',
                  'Georgia',
                  'Impact',
                  'Tahoma',
                  'Times New Roman',
                  'Verdana'
                ]
              },
              image: {
                uploadCallback: uploadImageFunction,
                previewImage: true,
                alt: { present: false },
                urlEnabled: false,
                inputAccept: 'image/*',
                defaultSize: {
                  height: 'auto',
                  width: '500px'
                }
              }
            }}
            editorStyle={{
              minHeight: '150px',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}
          />
          {selectedImageUrl && (
            <input
              type='file'
              accept='image/*'
              hidden
              ref={replaceImageInputRef}
              onChange={handleReplaceImage}
            />
          )}
        </>
      )}
    />
  )
}
