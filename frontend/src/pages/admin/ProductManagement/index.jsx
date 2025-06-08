// // components/ProductManagement.jsx
// import React from 'react'
//
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
// import Box from '@mui/material/Box'
// import AddIcon from '@mui/icons-material/Add'
//
// import ProductTable from './ProductTable'
// import ProductPagination from './ProductPagination'
//
// import useProducts from '~/hook/admin/useProducts'
//
// import { updateProduct, deleteProduct } from '~/services/admin/productService'
//
// const AddProductModal = React.lazy(() => import('./modal/AddProductModal'))
// const EditProductModal = React.lazy(() => import('./modal/EditProductModal'))
// const DeleteProductModal = React.lazy(
//   () => import('./modal/DeleteProductModal')
// )
// const ViewProductModal = React.lazy(() => import('./modal/ViewProductModal'))
//
// const ProductManagement = () => {
//   const [page, setPage] = React.useState(1)
//   const [limit] = React.useState(10)
//   const [modalType, setModalType] = React.useState(null)
//   const [selectedProduct, setSelectedProduct] = React.useState(null)
//
//   const { products, totalPages, fetchProducts, loading } = useProducts()
//
//   React.useEffect(() => {
//     fetchProducts(page, limit)
//   }, [page, limit])
//
//   const handleChangePage = (event, value) => setPage(value)
//
//   const handleOpenModal = (type, product = null) => {
//     setSelectedProduct(product)
//     setModalType(type)
//   }
//
//   const handleCloseModal = () => {
//     setSelectedProduct(null)
//     setModalType(null)
//   }
//
//   const handleSaveProduct = async (id, updatedData) => {
//     const result = await updateProduct(id, updatedData)
//     if (result) await fetchProducts(page, limit)
//   }
//
//   const handleDeleteProduct = async (id) => {
//     const result = await deleteProduct(id)
//     if (result) await fetchProducts(page, limit)
//   }
//
//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'space-between'
//         }}
//       >
//         <Typography variant='h5' sx={{ mb: 2 }}>
//           Quản lý sản phẩm
//         </Typography>
//         <Button
//           variant='contained'
//           sx={{ mb: 2, backgroundColor: '#001f5d' }}
//           startIcon={<AddIcon />}
//           onClick={() => handleOpenModal('add')}
//         >
//           Thêm sản phẩm
//         </Button>
//       </Box>
//
//       <ProductTable
//         products={products}
//         loading={loading}
//         handleOpenModal={handleOpenModal}
//       />
//
//       <React.Suspense fallback={<></>}>
//         {modalType === 'add' && (
//           <AddProductModal
//             open
//             onClose={handleCloseModal}
//             onSuccess={() => fetchProducts(page, limit)}
//           />
//         )}
//         {modalType === 'view' && selectedProduct && (
//           <ViewProductModal
//             open
//             onClose={handleCloseModal}
//             product={selectedProduct}
//           />
//         )}
//         {modalType === 'edit' && selectedProduct && (
//           <EditProductModal
//             open
//             onClose={handleCloseModal}
//             product={selectedProduct}
//             onSave={handleSaveProduct}
//           />
//         )}
//         {modalType === 'delete' && selectedProduct && (
//           <DeleteProductModal
//             open
//             onClose={handleCloseModal}
//             product={selectedProduct}
//             onDelete={handleDeleteProduct}
//           />
//         )}
//       </React.Suspense>
//
//       <ProductPagination
//         page={page}
//         totalPages={totalPages}
//         onPageChange={handleChangePage}
//       />
//     </>
//   )
// }
//
// export default ProductManagement

import React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'

import ProductTable from './ProductTable'
import ProductPagination from './ProductPagination'

import useProducts from '~/hooks/admin/useProducts'
import useCategories from '~/hooks/admin/useCategories'

import { updateProduct, deleteProduct } from '~/services/admin/productService'

const AddProductModal = React.lazy(() => import('./modal/AddProductModal'))
const EditProductModal = React.lazy(() => import('./modal/EditProductModal'))
const DeleteProductModal = React.lazy(
  () => import('./modal/DeleteProductModal')
)
const ViewProductModal = React.lazy(() => import('./modal/ViewProductModal'))
const ViewDesc = React.lazy(() => import('./modal/ViewDescriptionModal.jsx'))
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import ViewDescriptionModal from '~/pages/admin/ProductManagement/modal/ViewDescriptionModal.jsx'
import useColorPalettes from '~/hooks/admin/useColorPalettes.js'
import useSizePalettes from '~/hooks/admin/useSizePalettes.js'

const ProductManagement = () => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [modalType, setModalType] = React.useState(null)
  const [selectedProduct, setSelectedProduct] = React.useState(null)

  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('')
  const [minPrice, setMinPrice] = React.useState('')
  const [maxPrice, setMaxPrice] = React.useState('')
  const [createdAt, setCreatedAt] = React.useState('')

  const [pendingSearchTerm, setPendingSearchTerm] = React.useState('')
  const [pendingCategory, setPendingCategory] = React.useState('')
  const [pendingMinPrice, setPendingMinPrice] = React.useState('')
  const [pendingMaxPrice, setPendingMaxPrice] = React.useState('')
  const [pendingCreatedAt, setPendingCreatedAt] = React.useState('')

  const { products, fetchProducts, loading, total } = useProducts()
  const { categories, fetchCategories } = useCategories()
  const [showAdvancedFilter, setShowAdvancedFilter] = React.useState(false)

  const [colorPalette, setColorPalette] = React.useState(null)
  const [sizePalette, setSizePalette] = React.useState(null)
  const { getColorPaletteId } = useColorPalettes()
  const { getSizePaletteId } = useSizePalettes()

  React.useEffect(() => {
    fetchCategories()
  }, [])

  React.useEffect(() => {
    fetchProducts({
      page,
      limit,
      categoryId: selectedCategory,
      search: searchTerm,
      priceMin: minPrice,
      priceMax: maxPrice,
      ...(createdAt && { createdAt: new Date(createdAt).toISOString() })
    })
  }, [page, limit, selectedCategory, searchTerm, minPrice, maxPrice, createdAt])

  const handleChangePage = (event, value) => setPage(value)

  const handleOpenModal = async (type, product = null) => {
    setSelectedProduct(product)
    setModalType(type)

    if (type === 'view' && product) {
      try {
        const colorPalette = await getColorPaletteId(product._id)
        const sizePalette = await getSizePaletteId(product._id)

        // Bạn có thể lưu dữ liệu này vào state nếu cần dùng ở modal
        setColorPalette(colorPalette)
        setSizePalette(sizePalette)
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu palette:', error)
      }
    }
  }
  const handleCloseModal = () => {
    setSelectedProduct(null)
    setModalType(null)
  }

  const handleSearch = () => {
    setSearchTerm(removeVietnameseTones(pendingSearchTerm.toLowerCase()))
    setSelectedCategory(pendingCategory)
    setMinPrice(pendingMinPrice)
    setMaxPrice(pendingMaxPrice)
    setCreatedAt(pendingCreatedAt)
    setPage(1)
  }

  const handleSaveProduct = async (id, updatedData) => {
    try {
      const result = await updateProduct(id, updatedData)
      console.log('Result from updateProduct:', result) // Debugging log
      if (result) {
        await fetchProducts({
          page,
          limit,
          categoryId: selectedCategory,
          search: searchTerm,
          priceMin: minPrice,
          priceMax: maxPrice,
          ...(createdAt && { createdAt: new Date(createdAt).toISOString() })
        })
      }
      return result // Explicitly return the result
    } catch (error) {
      console.error('Error in handleSaveProduct:', error)
      return false // Return false on error
    }
  }

  const handleDeleteProduct = async (id) => {
    const result = await deleteProduct(id)
    if (result) {
      await fetchProducts({
        page,
        limit,
        categoryId: selectedCategory,
        search: searchTerm,
        priceMin: minPrice,
        priceMax: maxPrice,
        ...(createdAt && { createdAt: new Date(createdAt).toISOString() })
      })
    }
  }

  const removeVietnameseTones = (str) => {
    str
      .normalize('NFD') // tách các dấu ra khỏi ký tự
      .replace(/[\u0300-\u036f]/g, '') // xóa các dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2
        }}
      >
        <Button
          variant='contained'
          sx={{ backgroundColor: '#001f5d', padding: '13px 20px' }}
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('add')}
        >
          Thêm sản phẩm
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'end' }}>
            <TextField
              variant='outlined'
              placeholder='Tìm kiếm sản phẩm...'
              value={pendingSearchTerm}
              onChange={(e) => setPendingSearchTerm(e.target.value)}
              sx={{ width: 300, ...StyleAdmin.InputCustom }}
            />

            <Button
              variant='outlined'
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            >
              <FilterListIcon />
            </Button>

            <Button
              variant='contained'
              sx={{ backgroundColor: '#001f5d', color: '#fff' }}
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Box>

          {showAdvancedFilter && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 200, ...StyleAdmin.FormSelect }}>
                <InputLabel id='category-label'>Lọc theo danh mục</InputLabel>
                <Select
                  labelId='category-label'
                  value={pendingCategory}
                  label='Lọc theo danh mục'
                  onChange={(e) => setPendingCategory(e.target.value)}
                  MenuProps={{
                    PaperProps: { sx: StyleAdmin.FormSelect.SelectMenu }
                  }}
                >
                  <MenuItem value=''>Tất cả</MenuItem>
                  {categories
                    .filter((cat) => !cat.destroy)
                    .map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                label='Giá từ'
                type='number'
                value={pendingMinPrice}
                onChange={(e) => setPendingMinPrice(e.target.value)}
                sx={StyleAdmin.InputCustom}
              />
              <TextField
                label='Giá đến'
                type='number'
                value={pendingMaxPrice}
                onChange={(e) => setPendingMaxPrice(e.target.value)}
                sx={StyleAdmin.InputCustom}
              />
              <TextField
                label='Ngày tạo'
                type='datetime-local'
                value={pendingCreatedAt}
                onChange={(e) => setPendingCreatedAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={StyleAdmin.InputCustom}
              />
            </Box>
          )}
        </Box>
      </Box>

      <ProductTable
        products={products}
        loading={loading}
        handleOpenModal={handleOpenModal}
        addProduct={() => handleOpenModal('add')}
        page={page - 1}
        rowsPerPage={limit}
        total={total}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddProductModal
            open
            onClose={handleCloseModal}
            onSuccess={() =>
              fetchProducts({
                page,
                limit,
                categoryId: selectedCategory,
                search: searchTerm,
                priceMin: minPrice,
                priceMax: maxPrice,
                ...(createdAt && {
                  createdAt: new Date(createdAt).toISOString()
                })
              })
            }
          />
        )}
        {modalType === 'view' && selectedProduct && (
          <ViewProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            colorPalette={colorPalette}
            sizePalette={sizePalette}
          />
        )}
        {modalType === 'edit' && selectedProduct && (
          <EditProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            onSave={handleSaveProduct}
          />
        )}
        {modalType === 'delete' && selectedProduct && (
          <DeleteProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            onDelete={handleDeleteProduct}
          />
        )}
        {modalType === 'viewDesc' && selectedProduct && (
          <ViewDescriptionModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
          />
        )}
      </React.Suspense>
    </>
  )
}

export default ProductManagement
