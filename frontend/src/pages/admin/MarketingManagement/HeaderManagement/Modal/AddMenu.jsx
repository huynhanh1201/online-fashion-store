import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress,
  Autocomplete,
  Tabs,
  Tab,
  Paper
} from '@mui/material'
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { 
  saveMenuConfig, 
  getDefaultMenuStructure,
  validateMenuContent 
} from '~/services/admin/webConfig/headerService.js'
import { getCategories } from '~/services/admin/categoryService.js'
import MenuPreview from './MenuPreview.jsx'

const AddMenu = ({ open, onClose, onSuccess, initialData = null }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [menuData, setMenuData] = useState(getDefaultMenuStructure())
  const [editingItem, setEditingItem] = useState(null)
  const [editingType, setEditingType] = useState('') // 'main', 'mobile', 'footer'
  const [editingIndex, setEditingIndex] = useState(-1)
  const [editingSubIndex, setEditingSubIndex] = useState(-1)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [urlType, setUrlType] = useState('manual') // 'manual' or 'category'
  const [activeTab, setActiveTab] = useState(0) // 0: Editor, 1: Preview

  useEffect(() => {
    if (initialData && initialData.mainMenu && initialData.mainMenu.length > 0) {
      setMenuData(initialData)
    } else {
      setMenuData(getDefaultMenuStructure())
    }
  }, [initialData])

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    setCategoriesLoading(true)
    try {
      const response = await getCategories({})
      setCategories(response.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')

      // Validate menu content
      const errors = validateMenuContent(menuData)
      if (errors.length > 0) {
        setError(errors.join('\n'))
        return
      }

      await saveMenuConfig(menuData)
      onSuccess(menuData)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = (type) => {
    const newItem = {
      label: '',
      url: '',
      visible: true,
      order: menuData[type]?.length + 1 || 1
    }

    if (type === 'mainMenu') {
      newItem.children = []
    }

    // Add the new item to the list temporarily
    setMenuData(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), newItem]
    }))

    // Open edit modal for the new item
    setEditingItem(newItem)
    setEditingType(type)
    setEditingIndex(menuData[type]?.length || 0)
    setEditingSubIndex(-1)
  }

  const handleCancelEdit = () => {
    // If we're editing a newly added item that hasn't been saved properly, remove it
    if (editingItem && (!editingItem.label.trim() || (editingSubIndex >= 0 && !editingItem.url.trim()))) {
      setMenuData(prev => {
        const newData = { ...prev }
        
        if (editingSubIndex >= 0) {
          // Remove incomplete submenu item
          newData[editingType][editingIndex].children.splice(editingSubIndex, 1)
        } else {
          // Remove incomplete main item
          newData[editingType].splice(editingIndex, 1)
          // Reorder remaining items
          newData[editingType].forEach((item, idx) => {
            item.order = idx + 1
          })
        }
        
        return newData
      })
    }

    setEditingItem(null)
    setEditingType('')
    setEditingIndex(-1)
    setEditingSubIndex(-1)
    setError('')
    setUrlType('manual')
  }

  const handleEditItem = (type, index, subIndex = -1) => {
    let item
    if (subIndex >= 0) {
      item = menuData[type][index].children[subIndex]
    } else {
      item = menuData[type][index]
    }

    setEditingItem({ ...item })
    setEditingType(type)
    setEditingIndex(index)
    setEditingSubIndex(subIndex)
    
    // Reset URL type to manual for main menu items
    if (subIndex < 0) {
      setUrlType('manual')
    } else {
      // For submenu items, check if URL matches a category
      const matchingCategory = categories.find(cat => 
        cat.link === item.url || `/category/${cat.slug}` === item.url
      )
      setUrlType(matchingCategory ? 'category' : 'manual')
    }
  }

  const handleSaveItem = () => {
    if (!editingItem.label.trim()) {
      setError('Tên menu không được để trống')
      return
    }

    // URL is required only for submenu items
    if (editingSubIndex >= 0 && urlType === 'manual' && !editingItem.url.trim()) {
      setError('URL không được để trống cho submenu')
      return
    }

    setMenuData(prev => {
      const newData = { ...prev }
      
      if (editingSubIndex >= 0) {
        // Editing submenu item
        newData[editingType][editingIndex].children[editingSubIndex] = editingItem
      } else {
        // Editing main item
        newData[editingType][editingIndex] = editingItem
      }
      
      return newData
    })

    setEditingItem(null)
    setEditingType('')
    setEditingIndex(-1)
    setEditingSubIndex(-1)
    setError('')
    setUrlType('manual')
  }

  const handleDeleteItem = (type, index, subIndex = -1) => {
    setMenuData(prev => {
      const newData = { ...prev }
      
      if (subIndex >= 0) {
        // Delete submenu item
        newData[type][index].children.splice(subIndex, 1)
      } else {
        // Delete main item
        newData[type].splice(index, 1)
        // Reorder remaining items
        newData[type].forEach((item, idx) => {
          item.order = idx + 1
        })
      }
      
      return newData
    })
  }

  const handleAddSubmenu = (type, index) => {
    const newSubItem = {
      label: '',
      url: '',
      visible: true,
      order: (menuData[type][index].children?.length || 0) + 1
    }

    // Add the new submenu item to the list temporarily
    setMenuData(prev => ({
      ...prev,
      [type]: prev[type].map((item, idx) => 
        idx === index 
          ? { ...item, children: [...(item.children || []), newSubItem] }
          : item
      )
    }))

    // Open edit modal for the new submenu item
    setEditingItem(newSubItem)
    setEditingType(type)
    setEditingIndex(index)
    setEditingSubIndex(menuData[type][index].children?.length || 0)
    setUrlType('manual')
  }

  const handleCategorySelect = (category) => {
    if (category) {
      setEditingItem(prev => ({
        ...prev,
        url: category.link || `/category/${category.slug}`
        // Don't automatically set the label - let user customize the menu name
      }))
    }
  }

  const handleUrlTypeChange = (newType) => {
    setUrlType(newType)
    if (newType === 'category') {
      // Clear URL when switching to category selection
      setEditingItem(prev => ({ ...prev, url: '' }))
    }
  }

  // Đổi vị trí menu item lên/xuống
  const moveMenuItem = (type, index, direction, subIndex = -1) => {
    setMenuData(prev => {
      const newData = { ...prev }
      if (subIndex >= 0) {
        // Submenu
        const arr = newData[type][index].children
        if (
          (direction === 'up' && subIndex === 0) ||
          (direction === 'down' && subIndex === arr.length - 1)
        ) return prev
        const swapWith = direction === 'up' ? subIndex - 1 : subIndex + 1
        ;[arr[subIndex], arr[swapWith]] = [arr[swapWith], arr[subIndex]]
        arr.forEach((item, idx) => (item.order = idx + 1))
      } else {
        // Main menu
        const arr = newData[type]
        if (
          (direction === 'up' && index === 0) ||
          (direction === 'down' && index === arr.length - 1)
        ) return prev
        const swapWith = direction === 'up' ? index - 1 : index + 1
        ;[arr[index], arr[swapWith]] = [arr[swapWith], arr[index]]
        arr.forEach((item, idx) => (item.order = idx + 1))
      }
      return newData
    })
  }

  // Hiển thị menu dạng cây lồng nhau
  const renderTreeMenu = (type) => (
    <Box>
      {menuData[type]?.length === 0 && (
        <Typography sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}>
          Chưa có menu nào. Nhấn "Thêm menu" để bắt đầu.
        </Typography>
      )}
      {menuData[type]?.map((item, index) => (
        <Box key={index} sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 2,
          mb: 2,
          boxShadow: '0 2px 8px 0 rgba(60,72,88,.06)',
          background: item.visible ? '#fff' : '#f3f4f6',
          opacity: item.visible ? 1 : 0.6,
        }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
              {item.label || 'Chưa có tên'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              {item.url || 'Tiêu đề menu (không có link)'}
            </Typography>
            <IconButton size="small" onClick={() => moveMenuItem(type, index, 'up')}><ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} /></IconButton>
            <IconButton size="small" onClick={() => moveMenuItem(type, index, 'down')}><ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} /></IconButton>
            <IconButton size="small" onClick={() => handleEditItem(type, index)} sx={{ color: '#3b82f6' }}><EditIcon /></IconButton>
            <IconButton size="small" onClick={() => handleDeleteItem(type, index)} sx={{ color: '#ef4444' }}><DeleteIcon /></IconButton>
            <FormControlLabel
              control={<Switch checked={item.visible} onChange={e => setMenuData(prev => {
                const arr = [...prev[type]]; arr[index].visible = e.target.checked; return { ...prev, [type]: arr } })} />}
              label={item.visible ? 'Hiện' : 'Ẩn'}
              sx={{ ml: 1 }}
            />
            <Button size="small" variant="outlined" onClick={() => handleAddSubmenu(type, index)} sx={{ ml: 1 }}>
              + Submenu
            </Button>
          </Stack>
          {/* Submenu */}
          {item.children && item.children.length > 0 && (
            <Box sx={{ mt: 2, ml: 4 }}>
              {item.children.map((sub, subIdx) => (
                <Box key={subIdx} sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 1.5,
                  mb: 1,
                  background: sub.visible ? '#fafafa' : '#f3f4f6',
                  opacity: sub.visible ? 1 : 0.6,
                }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                      {sub.label || 'Chưa có tên'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {sub.url || 'Chưa có URL'}
                    </Typography>
                    <IconButton size="small" onClick={() => moveMenuItem(type, index, 'up', subIdx)}><ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} /></IconButton>
                    <IconButton size="small" onClick={() => moveMenuItem(type, index, 'down', subIdx)}><ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} /></IconButton>
                    <IconButton size="small" onClick={() => handleEditItem(type, index, subIdx)} sx={{ color: '#3b82f6' }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDeleteItem(type, index, subIdx)} sx={{ color: '#ef4444' }}><DeleteIcon fontSize="small" /></IconButton>
                    <FormControlLabel
                      control={<Switch checked={sub.visible} onChange={e => setMenuData(prev => {
                        const arr = [...prev[type]]; arr[index].children[subIdx].visible = e.target.checked; return { ...prev, [type]: arr } })} />}
                      label={sub.visible ? 'Hiện' : 'Ẩn'}
                      sx={{ ml: 1 }}
                    />
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => handleAddItem(type)}
        sx={{ mt: 1, fontWeight: 600 }}
      >
        Thêm menu
      </Button>
    </Box>
  )

  const renderTabContent = () => {
    if (activeTab === 0) {
      return (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            Kéo/thả thứ tự bằng nút Lên/Xuống. Nhấn vào từng mục để chỉnh sửa, thêm submenu hoặc xóa. Submenu sẽ hiển thị lồng bên trong.<br/>
            <b>Lưu ý:</b> Menu chỉ hỗ trợ 2 cấp (menu & submenu). Menu chính chỉ cần tên, URL chỉ cần thiết cho submenu.
          </Alert>
          {renderTreeMenu('mainMenu')}
        </>
      )
    } else {
      return <MenuPreview menuData={{ mainMenu: menuData.mainMenu }} categories={categories} />
    }
  }

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, height: '90vh' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {initialData ? 'Chỉnh sửa menu' : 'Tạo menu mới'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 2, p: 0 }}>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ px: 2 }}
            >
              <Tab 
                icon={<SettingsIcon />} 
                label="Chỉnh sửa" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab 
                icon={<PreviewIcon />} 
                label="Xem trước" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Box>

          <Box sx={{ p: 2, height: 'calc(90vh - 200px)', overflow: 'auto' }}>
            {renderTabContent()}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            sx={{
              background: 'linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              }
            }}
          >
            {loading ? 'Đang lưu...' : 'Lưu menu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog
        open={!!editingItem}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingSubIndex >= 0 ? 'Chỉnh sửa submenu' : 'Chỉnh sửa menu item'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Tên menu"
              value={editingItem?.label || ''}
              onChange={(e) => setEditingItem(prev => ({ ...prev, label: e.target.value }))}
              fullWidth
              required
            />

            {/* URL Type Selection for Submenu Items */}
            {editingSubIndex >= 0 && (
              <FormControl fullWidth>
                <InputLabel>Loại URL</InputLabel>
                <Select
                  value={urlType}
                  onChange={(e) => handleUrlTypeChange(e.target.value)}
                  label="Loại URL"
                >
                  <MenuItem value="manual">Nhập URL thủ công</MenuItem>
                  <MenuItem value="category">Chọn từ danh mục hiện có</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* URL Input or Category Selection */}
            {urlType === 'manual' ? (
              editingSubIndex >= 0 ? (
                <TextField
                  label="URL"
                  value={editingItem?.url || ''}
                  onChange={(e) => setEditingItem(prev => ({ ...prev, url: e.target.value }))}
                  fullWidth
                  required
                  placeholder="/category/example-slug"
                  helperText="Nhập URL (ví dụ: /category/ten-danh-muc) hoặc chọn 'Chọn từ danh mục hiện có' ở trên"
                />
              ) : null
            ) : editingSubIndex >= 0 ? (
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                loading={categoriesLoading}
                value={categories.find(cat => 
                  cat.link === editingItem?.url || `/category/${cat.slug}` === editingItem?.url
                ) || null}
                onChange={(event, newValue) => handleCategorySelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn danh mục"
                    required
                    helperText="Chọn danh mục để tự động lấy URL. Tên menu có thể tùy chỉnh riêng."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {categoriesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.link || `/category/${option.slug}`}
                      </Typography>
                    </Stack>
                  </Box>
                )}
                noOptionsText="Không tìm thấy danh mục nào"
              />
            ) : null}

            <TextField
              label="Thứ tự hiển thị"
              type="number"
              value={editingItem?.order || 1}
              onChange={(e) => setEditingItem(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
              fullWidth
              inputProps={{ min: 1 }}
              helperText="Thứ tự hiển thị trong menu (số nhỏ hơn sẽ hiển thị trước)"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editingItem?.visible || false}
                  onChange={(e) => setEditingItem(prev => ({ ...prev, visible: e.target.checked }))}
                />
              }
              label="Hiển thị menu item"
            />

            {editingSubIndex >= 0 && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Megamenu Column:</strong> Item này sẽ hiển thị như một cột trong megamenu khi hover vào menu cha.
                  {urlType === 'category' && (
                    <><br /><strong>Lưu ý:</strong> Khi chọn danh mục, URL sẽ được tự động điền theo định dạng /category/slug. Tên menu có thể tùy chỉnh theo ý muốn.</>
                  )}
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCancelEdit}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            sx={{
              background: 'linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
              }
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddMenu