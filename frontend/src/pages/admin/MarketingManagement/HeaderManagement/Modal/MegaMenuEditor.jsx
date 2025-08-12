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
  FormControl,
  InputLabel,
  Switch,
  Select,
  MenuItem,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  const [editingType, setEditingType] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [editingSubIndex, setEditingSubIndex] = useState(-1)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [urlType, setUrlType] = useState('manual')
  const [activeTab, setActiveTab] = useState(0)
  const [modalError, setModalError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

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

  const validateMenuContentCustom = (menuData) => {
    const errors = validateMenuContent(menuData)
    const customErrors = []

    menuData.mainMenu.forEach((item, index) => {
      if (!item.children || item.children.length === 0) {
        customErrors.push(
          `Cột "${item.label || `Cột ${index + 1}`}" chưa có thành phần`
        )
      }
    })

    return [...errors, ...customErrors]
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')

      const errors = validateMenuContentCustom(menuData)
      if (errors.length > 0) {
        setError(errors.join('\n'))
        return
      }

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
      visible: true
    }

    if (type === 'mainMenu') {
      newItem.children = []
    }

    setMenuData((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), newItem]
    }))

    setEditingItem(newItem)
    setEditingType(type)
    setEditingIndex(menuData[type]?.length || 0)
    setEditingSubIndex(-1)
  }

  const handleCancelEdit = () => {
    if (editingItem) {
      setMenuData((prev) => {
        const newData = { ...prev }

        if (editingSubIndex >= 0) {
          if (!editingItem.label.trim() || !editingItem.url.trim()) {
            newData[editingType][editingIndex].children.splice(
              editingSubIndex,
              1
            )
          }
        } else {
          if (!editingItem.label.trim()) {
            newData[editingType].splice(editingIndex, 1)
          }
        }

        return newData
      })
    }

    setEditingItem(null)
    setEditingType('')
    setEditingIndex(-1)
    setEditingSubIndex(-1)
    setModalError('')
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

    if (subIndex >= 0) {
      setUrlType('category')
    } else {
      setUrlType('manual')
    }
  }

  const handleSaveItem = () => {
    if (!editingItem.label.trim()) {
      setModalError('Tên menu không được để trống')
      return
    }

    if (editingSubIndex >= 0 && !editingItem.url.trim()) {
      setModalError('Vui lòng chọn danh mục có sản phẩm cho submenu')
      return
    }

    // const normalizeLabel = (label) =>
    //   label.charAt(0).toUpperCase() //+ label.slice(1).toLowerCase()

    const normalizedItem = { ...editingItem }

    // const normalizedItem = {
    //   ...editingItem,
    //   label: normalizeLabel(editingItem.label)
    // }

    setMenuData((prev) => {
      const newData = { ...prev }

      if (editingSubIndex >= 0) {
        newData[editingType][editingIndex].children[editingSubIndex] =
          normalizedItem
      } else {
        newData[editingType][editingIndex] = normalizedItem
      }

      return newData
    })

    setEditingItem(null)
    setEditingType('')
    setEditingIndex(-1)
    setEditingSubIndex(-1)
    setModalError('')
    setUrlType('category')
  }

  const handleDeleteItem = (type, index, subIndex = -1) => {
    setPendingDelete({ type, index, subIndex })
  }

  const confirmDeleteItem = () => {
    if (pendingDelete) {
      setMenuData((prev) => {
        const newData = { ...prev }

        if (pendingDelete.subIndex >= 0) {
          newData[pendingDelete.type][pendingDelete.index].children.splice(
            pendingDelete.subIndex,
            1
          )
        } else {
          newData[pendingDelete.type].splice(pendingDelete.index, 1)
        }

        return newData
      })
      setPendingDelete(null)
    }
  }

  const cancelDeleteItem = () => {
    setPendingDelete(null)
  }

  const handleAddSubmenu = (type, index) => {
    const newSubItem = {
      label: '',
      url: '',
      visible: true
    }

    setMenuData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, idx) =>
        idx === index
          ? { ...item, children: [...(item.children || []), newSubItem] }
          : item
      )
    }))

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
        url: `category/${category.slug}`,
        label: category.name // Tự động điền tên danh mục vào label
      }))
    }
  }

  const renderTreeMenu = (type) => (
    <Box>
      {menuData[type]?.length === 0 && (
        <Typography
          sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2, p: 2 }}
        >
          Chưa có menu nào. Nhấn "Thêm cột" để bắt đầu.
        </Typography>
      )}
      {menuData[type]?.map((item, index) => (
        <Accordion
          key={index}
          sx={{
            mb: 1,
            boxShadow: '0 2px 8px 0 rgba(60,72,88,.06)',
            borderRadius: 2,
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              background: item.visible ? '#fff' : '#f3f4f6',
              borderRadius: 2,
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            }}
          >
            <Stack direction='row' alignItems='center' spacing={2} flex={1}>
              <Typography
                variant='subtitle1'
                sx={{
                  fontWeight: 600,
                  color: item.visible ? 'text.primary' : 'text.secondary'
                }}
              >
                {item.label || 'Chưa có tên'}
              </Typography>
              <Typography
                variant='caption'
                sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
              >
                {item.url || 'Chưa có URL'}
              </Typography>
            </Stack>
            <Stack direction='row' alignItems='center' spacing={1}>
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditItem(type, index)
                }}
                sx={{ color: '#3b82f6' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteItem(type, index)
                }}
                sx={{ color: '#ef4444' }}
              >
                <DeleteIcon />
              </IconButton>
              <FormControlLabel
                control={
                  <Switch
                    checked={item.visible}
                    onChange={(e) => {
                      e.stopPropagation()
                      setMenuData((prev) => {
                        const arr = [...prev[type]]
                        arr[index].visible = e.target.checked
                        return { ...prev, [type]: arr }
                      })
                    }}
                  />
                }
                label={item.visible ? 'Hiện' : 'Ẩn'}
                sx={{ ml: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ background: '#fafafa', p: 2 }}>
            {item.children && item.children.length > 0 ? (
              <Box sx={{ ml: 2 }}>
                {item.children.map((sub, subIdx) => (
                  <Box
                    key={subIdx}
                    sx={{
                      borderLeft: '2px solid #e0e0e0',
                      pl: 2,
                      py: 1,
                      mb: 1,
                      background: sub.visible ? '#fff' : '#f3f4f6',
                      borderRadius: 1,
                      opacity: sub.visible ? 1 : 0.8
                    }}
                  >
                    <Stack direction='row' alignItems='center' spacing={2}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 500,
                          flex: 1,
                          color: sub.visible ? 'text.primary' : 'text.secondary',
                        }}
                      >
                        {sub.label || 'Chưa có tên'}
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          fontFamily: 'monospace',
                          color: 'text.secondary'
                        }}
                      >
                        {sub.url || 'Chưa có URL'}
                      </Typography>
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
                            onChange={() =>
                              setMenuData((prev) => {
                                const arr = [...prev[type]]
                                arr[index].children[subIdx].visible =
                                  !arr[index].children[subIdx].visible
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
            ) : (
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontStyle: 'italic' }}
              >
                Chưa có thành phần. Nhấn "Thêm thành phần" để thêm.
              </Typography>
            )}
            <Button
              size='small'
              variant='outlined'
              onClick={() => handleAddSubmenu(type, index)}
              sx={{ mt: 2 }}
            >
              + Thêm thành phần
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button
        startIcon={<AddIcon />}
        variant='contained'
        onClick={() => handleAddItem(type)}
        sx={{ mt: 2, fontWeight: 600 }}
      >
        Thêm cột
      </Button>
    </Box>
  )

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
              hover vào "Sản phẩm". Menu chính sẽ trở thành tiêu đề cột, thành
              phần sẽ hiển thị bên dưới.
              <br />
              <b>Lưu ý:</b> Menu "Sản phẩm" sẽ luôn hiển thị trong header. Các
              menu khác có thể có hoặc không có thành phần. Cột chỉ cần tên, URL
              chỉ cần thiết cho thành phần.
            </Typography>
          </Alert>

          {renderMegamenuSettings()}

          <Typography
            variant='h6'
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <CategoryIcon />
            Quản lý thành phần menu mở rộng
          </Typography>
          {renderTreeMenu('mainMenu')}
        </>
      )
    } else {
      return (
        <MenuPreview
          menuData={{ mainMenu: menuData.mainMenu }}
          megamenuSettings={megamenuSettings}
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

        <DialogContent sx={{ pb: 2, p: 0, height: '100%' }}>
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

          <Box sx={{ p: 2, height: 'calc(95vh - 300px)', overflow: 'auto' }}>
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
            {editingSubIndex >= 0 ? 'Chỉnh sửa thành phần' : 'Chỉnh sửa cột'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {modalError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {modalError}
            </Alert>
          )}
          <Stack spacing={3}>
            {editingSubIndex >= 0 ? (
              <>
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
                  disableClearable // Ngăn xóa lựa chọn
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Chọn danh mục có sản phẩm'
                      required
                      helperText='Chọn danh mục có sản phẩm để tự động lấy URL và tên mặc định. Tên menu có thể tùy chỉnh.'
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
                <TextField
                  label='Tên menu'
                  value={editingItem?.label || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
                      ...prev,
                      label: e.target.value
                    }))
                  }
                  fullWidth
                  required
                />
              </>
            ) : (
              <TextField
                label='Tên menu'
                value={editingItem?.label || ''}
                onChange={(e) =>
                  setEditingItem((prev) => ({ ...prev, label: e.target.value }))
                }
                fullWidth
                required
              />
            )}

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
                  chọn danh mục, URL và tên mặc định sẽ được tự động điền. Tên
                  menu có thể tùy chỉnh theo ý muốn.
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

      <Dialog
        open={!!pendingDelete}
        onClose={cancelDeleteItem}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Xác nhận xóa
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa{' '}
            {pendingDelete?.subIndex >= 0 ? 'thành phần' : 'cột'} này?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={cancelDeleteItem}>Hủy</Button>
          <Button
            variant='contained'
            onClick={confirmDeleteItem}
            sx={{
              backgroundColor: '#ef4444',
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MegaMenuEditor
