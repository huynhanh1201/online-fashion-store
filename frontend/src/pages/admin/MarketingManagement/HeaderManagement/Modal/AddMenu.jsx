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
  Autocomplete
} from '@mui/material'
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'
import { 
  saveMenuConfig, 
  getDefaultMenuStructure,
  validateMenuContent 
} from '~/services/admin/webConfig/headerService.js'
import { getCategories } from '~/services/admin/categoryService.js'

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

  useEffect(() => {
    if (initialData) {
      setMenuData(initialData)
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
      icon: '',
      visible: true,
      order: menuData[type]?.length + 1 || 1
    }

    if (type === 'mainMenu') {
      newItem.children = []
    }

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
        cat.link === item.url || `/categories/${cat._id}` === item.url
      )
      setUrlType(matchingCategory ? 'category' : 'manual')
    }
  }

  const handleSaveItem = () => {
    if (!editingItem.label.trim()) {
      setError('Tên menu không được để trống')
      return
    }

    if (urlType === 'manual' && !editingItem.url.trim()) {
      setError('URL không được để trống')
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
        url: category.link || `/productbycategory/${category._id}`
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

  const renderMenuSection = (type, title, color) => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600, color }}>
          {title}
        </Typography>
        <Chip 
          label={menuData[type]?.length || 0} 
          size="small" 
          sx={{ ml: 'auto', mr: 2 }}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          {menuData[type]?.map((item, index) => (
            <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <DragIcon sx={{ color: '#9ca3af' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.label || 'Chưa có tên'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {item.url || 'Chưa có URL'}
                  </Typography>
                  {type === 'mainMenu' && (
                    <Typography variant="caption" color="text.secondary">
                      Thứ tự: {item.order || index + 1} | 
                      {item.children?.length > 0 ? ` ${item.children.length} submenu` : ' Không có submenu'}
                    </Typography>
                  )}
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={item.visible ? 'Hiển thị' : 'Ẩn'}
                    color={item.visible ? 'success' : 'error'}
                    size="small"
                  />
                  {item.children && (
                    <Chip
                      label={`${item.children.length} submenu`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {type === 'mainMenu' && item.children?.length > 0 && (
                    <Chip
                      label="Megamenu"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => handleEditItem(type, index)}
                  sx={{ color: '#3b82f6' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteItem(type, index)}
                  sx={{ color: '#ef4444' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>

              {/* Submenu items */}
              {item.children && item.children.length > 0 && (
                <Box sx={{ mt: 2, ml: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Submenu (Megamenu columns):
                  </Typography>
                  <List dense>
                    {item.children.map((subItem, subIndex) => {
                      const linkedCategory = categories.find(cat => 
                        cat.link === subItem.url || `/categories/${cat._id}` === subItem.url
                      )
                      
                      return (
                        <ListItem key={subIndex} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {subItem.label || 'Chưa có tên'}
                                </Typography>
                                {linkedCategory && (
                                  <Chip
                                    label="Danh mục"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem' }}
                                  />
                                )}
                              </Stack>
                            }
                            secondary={
                              <Stack spacing={0.5}>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                  {subItem.url || 'Chưa có URL'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Thứ tự: {subItem.order || subIndex + 1}
                                  {linkedCategory && ` | Danh mục: ${linkedCategory.name}`}
                                </Typography>
                              </Stack>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={subItem.visible ? 'Hiển thị' : 'Ẩn'}
                                color={subItem.visible ? 'success' : 'error'}
                                size="small"
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleEditItem(type, index, subIndex)}
                                sx={{ color: '#3b82f6' }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteItem(type, index, subIndex)}
                                sx={{ color: '#ef4444' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    })}
                  </List>
                </Box>
              )}

              {/* Add submenu button for main menu */}
              {type === 'mainMenu' && (
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={() => handleAddSubmenu(type, index)}
                  sx={{ mt: 1, ml: 4 }}
                >
                  Thêm submenu (Megamenu column)
                </Button>
              )}
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => handleAddItem(type)}
            sx={{ alignSelf: 'flex-start' }}
          >
            Thêm menu item
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
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

        <DialogContent sx={{ pb: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {renderMenuSection('mainMenu', 'Main Menu', '#7c3aed')}
            {renderMenuSection('mobileMenu', 'Mobile Menu', '#059669')}
            {renderMenuSection('footerMenu', 'Footer Menu', '#dc2626')}
          </Stack>
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
        onClose={() => setEditingItem(null)}
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
              <TextField
                label="URL"
                value={editingItem?.url || ''}
                onChange={(e) => setEditingItem(prev => ({ ...prev, url: e.target.value }))}
                fullWidth
                required={editingSubIndex >= 0}
                placeholder="/example"
                helperText={editingSubIndex >= 0 ? "Nhập URL hoặc chọn 'Chọn từ danh mục hiện có' ở trên" : "URL của menu item"}
              />
            ) : editingSubIndex >= 0 ? (
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                loading={categoriesLoading}
                value={categories.find(cat => 
                  cat.link === editingItem?.url || `/productbycategory/${cat._id}` === editingItem?.url
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
                        {option.link || `/productbycategory/${option._id}`}
                      </Typography>
                    </Stack>
                  </Box>
                )}
                noOptionsText="Không tìm thấy danh mục nào"
              />
            ) : null}

            <TextField
              label="Icon (tùy chọn)"
              value={editingItem?.icon || ''}
              onChange={(e) => setEditingItem(prev => ({ ...prev, icon: e.target.value }))}
              fullWidth
              placeholder="home, shopping-bag, etc."
            />

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
                    <><br /><strong>Lưu ý:</strong> Khi chọn danh mục, URL sẽ được tự động điền. Tên menu có thể tùy chỉnh theo ý muốn.</>
                  )}
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => {
            setEditingItem(null)
            setUrlType('manual')
          }}>
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