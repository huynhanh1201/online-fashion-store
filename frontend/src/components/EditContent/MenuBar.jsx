import React, { useState, useRef } from 'react'
import { Button, Divider, Stack, Tooltip, Box } from '@mui/material'
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
import { Popover } from '@mui/material'
import PaletteIcon from '@mui/icons-material/Palette'
const headingOptions = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 1 },
  { label: 'Heading 2', value: 2 },
  { label: 'Heading 3', value: 3 },
  { label: 'Heading 4', value: 4 },
  { label: 'Heading 5', value: 5 },
  { label: 'Heading 6', value: 6 }
]
const colors = [
  '#000000',
  '#424242',
  '#757575',
  '#BDBDBD',
  '#E0E0E0',
  '#EEEEEE',
  '#F5F5F5',
  '#FAFAFA',
  '#FF0000',
  '#FF5722',
  '#FF9800',
  '#FFEB3B',
  '#8BC34A',
  '#4CAF50',
  '#00BCD4',
  '#2196F3',
  '#3F51B5',
  '#9C27B0',
  '#E91E63'
  // Thêm các màu khác nếu muốn
]
export default function MenuBar({ editor }) {
  const getCurrentValue = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive('heading', { level: i })) return i
    }
    return 'paragraph'
  }
  const [value, setValue] = useState(getCurrentValue())
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [anchorBg, setAnchorBg] = useState(null)
  const openBg = Boolean(anchorBg)

  const handleClickColor = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseColor = () => {
    setAnchorEl(null)
  }

  const handleChangeColor = (color) => {
    editor.chain().focus().setColor(color).run()
    handleCloseColor()
  }

  const handleClickBg = (e) => {
    setAnchorBg(e.currentTarget)
  }

  const handleCloseBg = () => {
    setAnchorBg(null)
  }

  const handleChangeBg = (color) => {
    editor.chain().focus().setHighlight({ color }).run()
    handleCloseBg()
  }
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
        'Chữ đâậm'
      )}
      {btn(
        () => editor.chain().focus().toggleItalic(),
        FormatItalic,
        editor.isActive('italic'),
        'Chữ nghiêng'
      )}
      {btn(
        () => editor.chain().focus().toggleUnderline(),
        FormatUnderlined,
        editor.isActive('underline'),
        'Gạch chân'
      )}
      {btn(
        () => editor.chain().focus().toggleStrike(),
        StrikethroughS,
        editor.isActive('strike'),
        'Gạch ngang'
      )}
      {btn(
        () => editor.chain().focus().toggleCode(),
        Code,
        editor.isActive('code'),
        'Mã'
      )}
      {btn(
        () => editor.chain().focus().unsetAllMarks(),
        FormatClear,
        false,
        'Xoá định dạng'
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

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* List */}
      {btn(
        () => editor.chain().focus().toggleBulletList(),
        FormatListBulleted,
        editor.isActive('bulletList'),
        'Dấu đầu dòng'
      )}
      {btn(
        () => editor.chain().focus().toggleOrderedList(),
        FormatListNumbered,
        editor.isActive('orderedList'),
        'Danh sách số'
      )}
      {btn(
        () => editor.chain().focus().toggleTaskList(),
        CodeOff,
        editor.isActive('taskList'),
        'Danh sách công việc'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Align */}
      {btn(
        () => editor.chain().focus().setTextAlign('left'),
        FormatAlignLeft,
        editor.isActive({ textAlign: 'left' }),
        'Canh trái'
      )}
      {btn(
        () => editor.chain().focus().setTextAlign('center'),
        FormatAlignCenter,
        editor.isActive({ textAlign: 'center' }),
        'Canh giữa'
      )}
      {btn(
        () => editor.chain().focus().setTextAlign('right'),
        FormatAlignRight,
        editor.isActive({ textAlign: 'right' }),
        'Canh phải'
      )}
      {btn(
        () => editor.chain().focus().setTextAlign('justify'),
        FormatAlignJustify,
        editor.isActive({ textAlign: 'justify' }),
        'Canh đều'
      )}

      {btn(
        () => editor.chain().focus().sinkListItem('listItem'),
        FormatIndentIncrease,
        false,
        'Qua phải'
      )}
      {btn(
        () => editor.chain().focus().liftListItem('listItem'),
        FormatIndentDecrease,
        false,
        'Qua trái'
      )}

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Color & highlight */}
      <Tooltip title='Màu chữ' arrow>
        <Button
          size='small'
          variant='outlined'
          onClick={handleClickColor}
          sx={{
            color: '#000',
            borderColor: '#000',
            minWidth: 36,
            padding: '6px'
          }}
        >
          <FormatColorText fontSize='small' />
        </Button>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseColor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 24px)',
            gap: '4px'
          }}
        >
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleChangeColor(color)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: '4px',
                bgcolor: color,
                cursor: 'pointer',
                border: '1px solid #ccc',
                '&:hover': {
                  border: '2px solid #000'
                }
              }}
            />
          ))}
        </Box>
      </Popover>

      {/* Nút màu nền (highlight) */}
      <Tooltip title='Màu nền' arrow>
        <Button
          size='small'
          variant='outlined'
          onClick={handleClickBg}
          sx={{
            color: '#000',
            borderColor: '#000',
            minWidth: 36,
            padding: '6px'
          }}
        >
          <FormatColorFill fontSize='small' />
        </Button>
      </Tooltip>

      <Popover
        open={openBg}
        anchorEl={anchorBg}
        onClose={handleCloseBg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 24px)',
            gap: '4px'
          }}
        >
          {colors.map((color) => (
            <Box
              key={color}
              onClick={() => handleChangeBg(color)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: '4px',
                bgcolor: color,
                cursor: 'pointer',
                border: '1px solid #ccc',
                '&:hover': {
                  border: '2px solid #000'
                }
              }}
            />
          ))}
        </Box>
      </Popover>

      <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

      {/* Insert */}
      {btn(
        () => editor.chain().focus().toggleBlockquote(),
        FormatQuote,
        editor.isActive('blockquote'),
        'Trích dẫn'
      )}
      {btn(
        () => editor.chain().focus().setHorizontalRule(),
        HorizontalRule,
        false,
        'Ngăn cách'
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
        'Đường dẫn'
      )}
      {btn(() => setOpenUpload(true), InsertPhoto, false, 'Hình ảnh')}

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
        () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 10, cols: 3, withHeaderRow: true }),
        TableChart,
        false,
        'Thêm dòng'
      )}
    </Stack>
  )
}
