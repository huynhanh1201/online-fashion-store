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
  Paper,
  Grid,
  Card,
  CardContent
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
  Settings as SettingsIcon,
  Category as CategoryIcon,
  ViewColumn as ViewColumnIcon
} from '@mui/icons-material'
import {
  saveMenuConfig,
  getDefaultMenuStructure,
  validateMenuContent
} from '~/services/admin/webConfig/headerService.js'
import { getCategoriesWithProducts } from '~/services/admin/categoryService.js'
import MenuPreview from './MenuPreview.jsx'

const MegaMenuEditor = ({ open, onClose, onSuccess, initialData = null }) => {
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
  const [megamenuSettings, setMegamenuSettings] = useState({
    maxColumns: 4,
    columnWidth: 'auto',
    showIcons: false,
    animationDuration: 350,
    showCategoryImages: false,
    enableHoverEffects: true
  })

  useEffect(() => {
    if (
      initialData &&
      initialData.mainMenu &&
      initialData.mainMenu.length > 0
    ) {
      setMenuData(initialData)
      if (initialData.settings?.megamenuSettings) {
        setMegamenuSettings(initialData.settings.megamenuSettings)
      }
    } else {
      setMenuData(getDefaultMenuStructure())
    }
  }, [initialData])

  // Fetch categories when Chart opens
  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    setCategoriesLoading(true)
    try {
      const categories = await getCategoriesWithProducts()
      setCategories(categories || [])
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

      // Cập nhật megamenu settings
      const updatedMenuData = {
        ...menuData,
        settings: {
          ...menuData.settings,
          megamenuSettings
        }
      }

      await saveMenuConfig(updatedMenuData)
      onSuccess(updatedMenuData)
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
    setMenuData((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newItem]
    }))

    // Open edit Chart for the new item
    setEditingItem(newItem)
    setEditingType(type)
    setEditingIndex(menuData[type]?.length || 0)
    setEditingSubIndex(-1)
  }

  const handleCancelEdit = () => {
    // If we're editing a newly added item that hasn't been saved properly, remove it
    if (
      editingItem &&
      (!editingItem.label.trim() ||
        (editingSubIndex >= 0 && !editingItem.url.trim()))
    ) {
      setMenuData((prev) => {
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

    // Set URL type to category for submenu items (no manual option)
    if (subIndex >= 0) {
      setUrlType('category')
    } else {
      setUrlType('manual')
    }
  }

  const handleSaveItem = () => {
    if (!editingItem.label.trim()) {
      setError('Tên menu không được để trống')
      return
    }

    // URL is required for submenu items and must be selected from categories
    if (editingSubIndex >= 0 && !editingItem.url.trim()) {
      setError('Vui lòng chọn danh mục có sản phẩm cho submenu')
      return
    }

    // Normalize label: capitalize only the first letter of the whole string, rest lowercase
    const normalizeLabel = (label) =>
      label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

    const normalizedItem = {
      ...editingItem,
      label: normalizeLabel(editingItem.label)
    };

    setMenuData((prev) => {
      const newData = { ...prev }

      if (editingSubIndex >= 0) {
        // Editing submenu item
        newData[editingType][editingIndex].children[editingSubIndex] =
          normalizedItem
      } else {
        // Editing main item
        newData[editingType][editingIndex] = normalizedItem
      }

      return newData
    })

    setEditingItem(null)
    setEditingType('')
    setEditingIndex(-1)
    setEditingSubIndex(-1)
    setError('')
    setUrlType('category')
  }

  const handleDeleteItem = (type, index, subIndex = -1) => {
    setMenuData((prev) => {
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
    setMenuData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, idx) =>
        idx === index
          ? { ...item, children: [...(item.children || []), newSubItem] }
          : item
      )
    }))

    // Open edit Chart for the new submenu item
    setEditingItem(newSubItem)
    setEditingType(type)
    setEditingIndex(index)
    setEditingSubIndex(menuData[type][index].children?.length || 0)
    setUrlType('category')
  }

  const handleCategorySelect = (category) => {
    if (category) {
      setEditingItem((prev) => ({
        ...prev,
        url: `category/${category.slug}`
        // Don't automatically set the label - let user customize the menu name
      }))
    }
  }

  // Đổi vị trí menu item lên/xuống
  const moveMenuItem = (type, index, direction, subIndex = -1) => {
    setMenuData((prev) => {
      const newData = { ...prev }
      if (subIndex >= 0) {
        // Submenu
        const arr = newData[type][index].children
        if (
          (direction === 'up' && subIndex === 0) ||
          (direction === 'down' && subIndex === arr.length - 1)
        )
          return prev
        const swapWith = direction === 'up' ? subIndex - 1 : subIndex + 1
        ;[arr[subIndex], arr[swapWith]] = [arr[swapWith], arr[subIndex]]
        arr.forEach((item, idx) => (item.order = idx + 1))
      } else {
        // Main menu
        const arr = newData[type]
        if (
          (direction === 'up' && index === 0) ||
          (direction === 'down' && index === arr.length - 1)
        )
          return prev
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
        <Typography
          sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}
        >
          Chưa có menu nào. Nhấn "Thêm menu" để bắt đầu.
        </Typography>
      )}
      {menuData[type]?.map((item, index) => (
        <Box
          key={index}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 2,
            mb: 2,
            boxShadow: '0 2px 8px 0 rgba(60,72,88,.06)',
            background: item.visible ? '#fff' : '#f3f4f6',
            opacity: item.visible ? 1 : 0.6
          }}
        >
          <Stack direction='row' alignItems='center' spacing={1}>
            <Typography variant='subtitle1' sx={{ fontWeight: 600, flex: 1 }}>
              {item.label || 'Chưa có tên'}
            </Typography>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ fontFamily: 'monospace' }}
            >
              {item.url || 'Tiêu đề menu (không có link)'}
            </Typography>
            <IconButton
              size='small'
              onClick={() => moveMenuItem(type, index, 'up')}
            >
              <ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />
            </IconButton>
            <IconButton
              size='small'
              onClick={() => moveMenuItem(type, index, 'down')}
            >
              <ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />
            </IconButton>
            <IconButton
              size='small'
              onClick={() => handleEditItem(type, index)}
              sx={{ color: '#3b82f6' }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size='small'
              onClick={() => handleDeleteItem(type, index)}
              sx={{ color: '#ef4444' }}
            >
              <DeleteIcon />
            </IconButton>
            <FormControlLabel
              control={
                <Switch
                  checked={item.visible}
                  onChange={(e) =>
                    setMenuData((prev) => {
                      const arr = [...prev[type]]
                      arr[index].visible = e.target.checked
                      return { ...prev, [type]: arr }
                    })
                  }
                />
              }
              label={item.visible ? 'Hiện' : 'Ẩn'}
              sx={{ ml: 1 }}
            />
            <Button
              size='small'
              variant='outlined'
              onClick={() => handleAddSubmenu(type, index)}
              sx={{ ml: 1 }}
            >
              + Submenu
            </Button>
          </Stack>
          {/* Submenu */}
          {item.children && item.children.length > 0 && (
            <Box sx={{ mt: 2, ml: 4 }}>
              {item.children.map((sub, subIdx) => (
                <Box
                  key={subIdx}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 1.5,
                    mb: 1,
                    background: sub.visible ? '#fafafa' : '#f3f4f6',
                    opacity: sub.visible ? 1 : 0.6
                  }}
                >
                  <Stack direction='row' alignItems='center' spacing={1}>
                    <Typography
                      variant='body2'
                      sx={{ fontWeight: 500, flex: 1 }}
                    >
                      {sub.label || 'Chưa có tên'}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ fontFamily: 'monospace' }}
                    >
                      {sub.url || 'Chưa có URL'}
                    </Typography>
                    <IconButton
                      size='small'
                      onClick={() => moveMenuItem(type, index, 'up', subIdx)}
                    >
                      <ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => moveMenuItem(type, index, 'down', subIdx)}
                    >
                      <ExpandMoreIcon sx={{ transform: 'rotate(90deg)' }} />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleEditItem(type, index, subIdx)}
                      sx={{ color: '#3b82f6' }}
                    >
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleDeleteItem(type, index, subIdx)}
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={sub.visible}
                          onChange={(e) =>
                            setMenuData((prev) => {
                              const arr = [...prev[type]]
                              arr[index].children[subIdx].visible =
                                e.target.checked
                              return { ...prev, [type]: arr }
                            })
                          }
                        />
                      }
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
        variant='contained'
        onClick={() => handleAddItem(type)}
        sx={{ mt: 1, fontWeight: 600 }}
      >
        Thêm menu
      </Button>
    </Box>
  )

  // Render Megamenu Settings
  const renderMegamenuSettings = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography
          variant='h6'
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ViewColumnIcon />
          Cài đặt Megamenu
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Số cột tối đa</InputLabel>
              <Select
                value={megamenuSettings.maxColumns}
                onChange={(e) =>
                  setMegamenuSettings((prev) => ({
                    ...prev,
                    maxColumns: e.target.value
                  }))
                }
                label='Số cột tối đa'
              >
                <MenuItem value={2}>2 cột</MenuItem>
                <MenuItem value={3}>3 cột</MenuItem>
                <MenuItem value={4}>4 cột</MenuItem>
                <MenuItem value={5}>5 cột</MenuItem>
                <MenuItem value={6}>6 cột</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FormControlLabel
              control={
                <Switch
                  checked={megamenuSettings.showIcons}
                  onChange={(e) =>
                    setMegamenuSettings((prev) => ({
                      ...prev,
                      showIcons: e.target.checked
                    }))
                  }
                />
              }
              label='Hiển thị icon'
            /> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FormControlLabel
              control={
                <Switch
                  checked={megamenuSettings.showCategoryImages}
                  onChange={(e) =>
                    setMegamenuSettings((prev) => ({
                      ...prev,
                      showCategoryImages: e.target.checked
                    }))
                  }
                />
              }
              label='Hiển thị ảnh danh mục'
            /> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={megamenuSettings.enableHoverEffects}
                  onChange={(e) =>
                    setMegamenuSettings((prev) => ({
                      ...prev,
                      enableHoverEffects: e.target.checked
                    }))
                  }
                />
              }
              label='Hiệu ứng hover'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Thời gian animation (ms)'
              type='number'
              value={megamenuSettings.animationDuration}
              onChange={(e) =>
                setMegamenuSettings((prev) => ({
                  ...prev,
                  animationDuration: parseInt(e.target.value) || 350
                }))
              }
              fullWidth
              inputProps={{ min: 100, max: 1000, step: 50 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  const renderTabContent = () => {
    if (activeTab === 0) {
      return (
        <>
          <Alert severity='info' sx={{ mb: 2 }}>
            <Typography variant='body2'>
              <strong>Megamenu Editor:</strong> Chỉnh sửa menu sẽ hiển thị khi
              hover vào "Sản phẩm". Menu chính sẽ trở thành tiêu đề cột, submenu
              sẽ hiển thị bên dưới.
              <br />
              <b>Lưu ý:</b> Menu "Sản phẩm" sẽ luôn hiển thị trong header. Các
              menu khác có thể có hoặc không có submenu. Menu chính chỉ cần tên,
              URL chỉ cần thiết cho submenu.
            </Typography>
          </Alert>

          {renderMegamenuSettings()}

          <Typography
            variant='h6'
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <CategoryIcon />
            Quản lý Menu Items
          </Typography>
          {renderTreeMenu('mainMenu')}
        </>
      )
    } else {
      return (
        <MenuPreview
          menuData={{ mainMenu: menuData.mainMenu }}
          categories={categories}
        />
      )
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='lg'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, height: '85vh' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h5' sx={{ fontWeight: 700 }}>
              {initialData ? 'Chỉnh sửa Megamenu' : 'Tạo Megamenu mới'}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 2, p: 0 }}>
          {error && (
            <Alert severity='error' sx={{ m: 2 }}>
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
                label='Chỉnh sửa'
                iconPosition='start'
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<PreviewIcon />}
                label='Xem trước'
                iconPosition='start'
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
            variant='contained'
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
            {loading ? 'Đang lưu...' : 'Lưu Megamenu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog
        open={!!editingItem}
        onClose={handleCancelEdit}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {editingSubIndex >= 0 ? 'Chỉnh sửa submenu' : 'Chỉnh sửa menu item'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label='Tên menu'
              value={editingItem?.label || ''}
              onChange={(e) =>
                setEditingItem((prev) => ({ ...prev, label: e.target.value }))
              }
              fullWidth
              required
            />

            {/* Category Selection for Submenu Items */}
            {editingSubIndex >= 0 && (
              <Autocomplete
                options={categories}
                getOptionLabel={(option) =>
                  `${option.name} (${option.productCount} sản phẩm)`
                }
                loading={categoriesLoading}
                value={
                  categories.find(
                    (cat) => `category/${cat.slug}` === editingItem?.url
                  ) || null
                }
                onChange={(event, newValue) => handleCategorySelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Chọn danh mục có sản phẩm'
                    required
                    helperText='Chọn danh mục có sản phẩm để tự động lấy URL. Tên menu có thể tùy chỉnh riêng.'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {categoriesLoading ? (
                            <CircularProgress color='inherit' size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component='li' {...props}>
                    <Stack>
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {option.productCount} sản phẩm • Link: category/
                        {option.slug}
                      </Typography>
                      {option.parent && (
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ fontStyle: 'italic' }}
                        >
                          Danh mục con của: {option.parent.name}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}
                noOptionsText='Không tìm thấy danh mục có sản phẩm nào'
              />
            )}

            <TextField
              label='Thứ tự hiển thị'
              type='number'
              value={editingItem?.order || 1}
              onChange={(e) =>
                setEditingItem((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value) || 1
                }))
              }
              fullWidth
              inputProps={{ min: 1 }}
              helperText='Thứ tự hiển thị trong menu (số nhỏ hơn sẽ hiển thị trước)'
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editingItem?.visible || false}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
                      ...prev,
                      visible: e.target.checked
                    }))
                  }
                />
              }
              label='Hiển thị menu item'
            />

            {editingSubIndex >= 0 && (
              <Alert severity='info' sx={{ mt: 1 }}>
                <Typography variant='body2'>
                  <strong>Megamenu Column:</strong> Item này sẽ hiển thị như một
                  cột trong megamenu khi hover vào menu cha.
                  <br />
                  <strong>Lưu ý:</strong> Chỉ hiển thị danh mục có sản phẩm. Khi
                  chọn danh mục, URL sẽ được tự động điền theo định dạng
                  category/slug. Tên menu có thể tùy chỉnh theo ý muốn.
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCancelEdit}>Hủy</Button>
          <Button
            variant='contained'
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

export default MegaMenuEditor
