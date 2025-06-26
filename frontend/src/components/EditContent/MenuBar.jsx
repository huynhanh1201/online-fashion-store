import React, { useState, useRef } from 'react'
import { Button, Divider, Stack, Tooltip } from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  InsertPhoto,
  TableChart,
  HorizontalRule,
  Undo,
  Redo,
  FormatColorFill,
  FormatColorText,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  TextIncrease,
  TextDecrease,
  Functions,
  EmojiEmotions,
  VideoLibrary,
  GifBox,
  ViewColumn,
  CodeOff,
  IntegrationInstructions,
  Draw,
  FormatClear,
  FormatSize,
  Subscript,
  Superscript,
  FormatIndentIncrease,
  FormatIndentDecrease
} from '@mui/icons-material'
import { Select, MenuItem } from '@mui/material'
import FormatSizeIcon from '@mui/icons-material/FormatSize'
import ModalUploadImage from '~/components/EditContent/modal/ModalUploadImage.jsx'
const headingOptions = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 1 },
  { label: 'Heading 2', value: 2 },
  { label: 'Heading 3', value: 3 },
  { label: 'Heading 4', value: 4 },
  { label: 'Heading 5', value: 5 },
  { label: 'Heading 6', value: 6 }
]
export default function MenuBar({ editor }) {
  const getCurrentValue = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) return i
    }
    return 'paragraph'
  }
  const [value, setValue] = useState(getCurrentValue())
  const [openUpload, setOpenUpload] = useState(false)
  const btn = (command, Icon, active = false, label = '') => (
    <Tooltip title={label} arrow>
      <Button
        size='small'
        variant={active ? 'contained' : 'outlined'}
        onClick={() => command().focus().run()}
        sx={{
          color: '#000',
          borderColor: '#000',
          backgroundColor: active ? '#fff' : 'transparent',
          minWidth: 36,
          padding: '6px',
          '&:hover': {
            borderColor: '#000',
            color: '#000',
            backgroundColor: active ? '#f5f5f5' : 'transparent'
          }
        }}
      >
        <Icon fontSize='small' />
      </Button>
    </Tooltip>
  )

  if (!editor) return null
  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)

    if (newValue === 'paragraph') {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: newValue }).run()
    }
  }

  return (
    <Stack direction='row' spacing={1} flexWrap='wrap' sx={{ mb: 1 }}>
      {/* Undo/Redo */}
      {btn(() => editor.chain().focus().undo(), Undo, false, 'Undo')}
      {btn(() => editor.chain().focus().redo(), Redo, false, 'Redo')}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Basic styles */}
      {btn(
        () => editor.chain().focus().toggleBold(),
        FormatBold,
        editor.isActive('bold'),
        'Bold'
      )}
      {btn(
        () => editor.chain().focus().toggleItalic(),
        FormatItalic,
        editor.isActive('italic'),
        'Italic'
      )}
      {btn(
        () => editor.chain().focus().toggleUnderline(),
        FormatUnderlined,
        editor.isActive('underline'),
        'Underline'
      )}
      {btn(
        () => editor.chain().focus().toggleStrike(),
        StrikethroughS,
        editor.isActive('strike'),
        'Strike'
      )}
      {btn(
        () => editor.chain().focus().toggleCode(),
        Code,
        editor.isActive('code'),
        'Code'
      )}
      {btn(
        () => editor.chain().focus().unsetAllMarks(),
        FormatClear,
        false,
        'Clear format'
      )}
      {btn(
        () => editor.chain().focus().setSubscript(),
        Subscript,
        editor.isActive('subscript'),
        'Subscript'
      )}
      {btn(
        () => editor.chain().focus().setSuperscript(),
        Superscript,
        editor.isActive('superscript'),
        'Superscript'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      <Select
        size='small'
        value={value}
        onChange={handleChange}
        startAdornment={<FormatSizeIcon fontSize='small' />}
        sx={{
          minWidth: 120,
          mx: 1,
          color: '#000',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000'
          },
          '& .MuiSelect-icon': {
            color: '#000'
          }
        }}
      >
        {headingOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {btn(
        () => editor.chain().focus().unsetNode('heading'),
        FormatSize,
        false,
        'Paragraph'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* List */}
      {btn(
        () => editor.chain().focus().toggleBulletList(),
        FormatListBulleted,
        editor.isActive('bulletList'),
        'Bullet List'
      )}
      {btn(
        () => editor.chain().focus().toggleOrderedList(),
        FormatListNumbered,
        editor.isActive('orderedList'),
        'Ordered List'
      )}
      {btn(
        () => editor.chain().focus().toggleTaskList(),
        CodeOff,
        editor.isActive('taskList'),
        'Task List'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Align */}
      {btn(
        () => editor.chain().focus().setTextAlign('left'),
        FormatAlignLeft,
        editor.isActive({ textAlign: 'left' }),
        'Left'
      )}
      {btn(
        () => editor.chain().focus().setTextAlign('center'),
        FormatAlignCenter,
        editor.isActive({ textAlign: 'center' }),
        'Center'
      )}
      {btn(
        () => editor.chain().focus().setTextAlign('right'),
        FormatAlignRight,
        editor.isActive({ textAlign: 'right' }),
        'Right'
      )}
      {btn(
        () => editor.chain().focus().setTextAlign('justify'),
        FormatAlignJustify,
        editor.isActive({ textAlign: 'justify' }),
        'Justify'
      )}

      {btn(
        () => editor.chain().focus().sinkListItem('listItem'),
        FormatIndentIncrease,
        false,
        'Indent'
      )}
      {btn(
        () => editor.chain().focus().liftListItem('listItem'),
        FormatIndentDecrease,
        false,
        'Outdent'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Color & highlight */}
      {btn(
        () => editor.chain().focus().setColor('#F44336'),
        FormatColorText,
        false,
        'Text Color'
      )}
      {btn(
        () => editor.chain().focus().setHighlight({ color: '#FFFF00' }),
        FormatColorFill,
        false,
        'Highlight'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Insert */}
      {btn(
        () => editor.chain().focus().toggleBlockquote(),
        FormatQuote,
        editor.isActive('blockquote'),
        'Quote'
      )}
      {btn(
        () => editor.chain().focus().setHorizontalRule(),
        HorizontalRule,
        false,
        'Horizontal Rule'
      )}
      {btn(
        () => {
          const url = prompt('Nhập URL:')
          if (url) {
            editor.chain().focus().toggleLink({ href: url }).run()
          }
        },
        LinkIcon,
        editor.isActive('link'),
        'Link'
      )}
      {btn(() => setOpenUpload(true), InsertPhoto, false, 'Image')}

      <ModalUploadImage
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={(src, inline) => {
          const imageSrc =
            typeof src === 'string' ? src : URL.createObjectURL(src)
          editor.chain().focus().setImage({ src: imageSrc, inline }).run()
        }}
        onCrop={(file, inline) => {
          // Gọi modal crop khác hoặc logic crop
          alert('Crop function chưa được xử lý.')
        }}
      />
      {btn(
        () => {
          const url = prompt('Video URL:')
          if (url) editor.chain().focus().setVideo({ src: url }).run()
        },
        VideoLibrary,
        false,
        'Video'
      )}
      {btn(
        () => {
          const url = prompt('GIF URL:')
          if (url) editor.chain().focus().setImage({ src: url }).run()
        },
        GifBox,
        false,
        'GIF'
      )}
      {btn(
        () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 10, cols: 3, withHeaderRow: true }),
        TableChart,
        false,
        'Insert Table'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Advanced */}
      {btn(
        () => {
          const formula = prompt('Nhập LaTeX:')
          if (formula) editor.commands.insertMath(formula)
        },
        Functions,
        false,
        'Math'
      )}
      {btn(
        () => {
          const code = prompt('Nhập Mermaid diagram:')
          if (code) editor.commands.insertMermaid(code)
        },
        IntegrationInstructions,
        false,
        'Mermaid'
      )}
      {btn(
        () => {
          const url = prompt('Nhúng Iframe:')
          if (url) editor.chain().focus().setIframe({ src: url }).run()
        },
        ViewColumn,
        false,
        'Iframe'
      )}
      {btn(
        () => {
          const url = prompt('File đính kèm:')
          if (url)
            editor
              .chain()
              .focus()
              .insertContent(`<a href="${url}" download>Attachment</a>`)
        },
        Draw,
        false,
        'Attachment'
      )}
    </Stack>
  )
}
