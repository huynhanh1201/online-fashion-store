// import React, { useEffect } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
//   Box,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   IconButton,
//   Tooltip
// } from '@mui/material'
// import { Delete as DeleteIcon } from '@mui/icons-material'
// import { useForm } from 'react-hook-form'
// import usePermissions from '~/hooks/admin/usePermission.js'
// export default function AddPermissionModal({ open, onClose, onSuccess }) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//     setValue,
//     watch
//   } = useForm({
//     defaultValues: {
//       group: '',
//       keyParts: [''],
//       label: ''
//     }
//   })
//
//   const { fetchPermissions, permissions } = usePermissions()
//
//   useEffect(() => {
//     if (!open) return
//     fetchPermissions(1, 10000)
//   }, [open])
//
//   const groups = permissions.map((permission) => permission.group)
//
//   const keyParts = watch('keyParts')
//
//   const handleKeyChange = (index, value) => {
//     const updated = [...keyParts]
//     updated[index] = value
//     setValue('keyParts', updated)
//   }
//
//   const addKeyPart = () => {
//     setValue('keyParts', [...keyParts, ''])
//   }
//
//   const removeKeyPart = (index) => {
//     const updated = keyParts.filter((_, i) => i !== index)
//     setValue('keyParts', updated)
//   }
//
//   const onSubmit = (data) => {
//     const key = data.keyParts.join(':')
//     if (!/^([a-z]+:)+[a-z]+$/.test(key)) {
//       alert(
//         'Key không hợp lệ. Phải có định dạng "tên:chức năng" (vd: user:read)'
//       )
//       return
//     }
//     onSuccess({ group: data.group, key, label: data.label })
//     reset()
//   }
//
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       PaperProps={{
//         sx: {
//           display: 'flex',
//           flexDirection: 'column',
//           marginTop: '50px',
//           height: '85vh',
//           maxHeight: '85vh'
//         }
//       }}
//     >
//       <DialogTitle sx={{ pb: 1 }}>Thêm quyền mới</DialogTitle>
//       <DialogActions sx={{ p: 0, justifyContent: 'start', pb: 2, pl: 3 }}>
//         <Button
//           variant='outlined'
//           color='error'
//           onClick={onClose}
//           sx={{ textTransform: 'none' }}
//         >
//           Huỷ
//         </Button>
//         <Button
//           onClick={handleSubmit(onSubmit)}
//           variant='contained'
//           sx={{
//             backgroundColor: '#001f5d',
//             color: '#fff',
//             textTransform: 'none'
//           }}
//         >
//           Thêm
//         </Button>
//       </DialogActions>
//       <DialogContent dividers sx={{ pt: 0 }}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <TextField
//             select
//             label='Nhóm quyền'
//             fullWidth
//             margin='normal'
//             {...register('group', { required: 'Vui lòng chọn nhóm quyền' })}
//             error={!!errors.group}
//             helperText={errors.group?.message}
//           >
//             {groups.map((group) => (
//               <MenuItem key={group} value={group}>
//                 {group}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             label='Tên quyền'
//             fullWidth
//             margin='normal'
//             {...register('label', { required: 'Vui lòng nhập tên quyền' })}
//             error={!!errors.label}
//             helperText={errors.label?.message}
//           />
//           <Box mt={2}>
//             <Typography fontWeight={500} mb={1}>
//               Danh sách Key
//             </Typography>
//             <Table size='small'>
//               <TableHead>
//                 <TableRow>
//                   <TableCell align='center' sx={{ width: 65 }}>
//                     STT
//                   </TableCell>
//                   <TableCell>Giá trị</TableCell>
//                   <TableCell align='left' sx={{ width: 110 }}>
//                     Hành động
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {keyParts.map((part, index) => (
//                   <TableRow key={index}>
//                     <TableCell align='center' sx={{ width: 65 }}>
//                       {index + 1}
//                     </TableCell>
//                     <TableCell>
//                       <TextField
//                         value={part}
//                         onChange={(e) => handleKeyChange(index, e.target.value)}
//                         fullWidth
//                         size='small'
//                       />
//                     </TableCell>
//                     <TableCell align='left'>
//                       <Tooltip title='Xoá'>
//                         <IconButton
//                           onClick={() => removeKeyPart(index)}
//                           disabled={keyParts.length === 1}
//                           sx={{ ml: '-10px' }}
//                         >
//                           <DeleteIcon fontSize='small' color='error' />
//                         </IconButton>
//                       </Tooltip>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Box>
//         </form>
//       </DialogContent>
//       <DialogActions sx={{ justifyContent: 'start', padding: '16px 24px' }}>
//         <Button variant='outlined' onClick={addKeyPart}>
//           Thêm phần
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import usePermissions from '~/hooks/admin/usePermission.js'

export default function AddPermissionModal({ open, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      group: '',
      label: '',
      keyList: [{ key: '', label: '' }]
    }
  })

  const { fetchPermissions, permissions } = usePermissions()

  useEffect(() => {
    if (!open) return
    fetchPermissions(1, 10000)
  }, [open])

  const groups = permissions.map((permission) => permission.group)
  const keyList = watch('keyList') || []

  const handleChange = (index, field, value) => {
    const updated = [...keyList]
    updated[index][field] = value
    setValue('keyList', updated)
  }

  const addRow = () => {
    setValue('keyList', [...keyList, { key: '', label: '' }])
  }

  const removeRow = (index) => {
    const updated = keyList.filter((_, i) => i !== index)
    setValue('keyList', updated)
  }

  const onSubmit = (data) => {
    const isValid = data.keyList.every(
      (item) => /^([a-z]+:)+[a-z]+$/.test(item.key.trim()) && item.label.trim()
    )

    if (!isValid) {
      alert(
        'Mỗi dòng phải có key hợp lệ và tên quyền. Key phải có định dạng "tên:chức năng"'
      )
      return
    }

    const permissions = data.keyList.map(({ key, label }) => ({ key, label }))
    onSuccess({ group: data.group, permissions })
    reset()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          marginTop: '50px',
          height: '85vh',
          maxHeight: '85vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Thêm nhóm quyền mới</DialogTitle>
      <DialogActions sx={{ p: 0, justifyContent: 'start', pb: 2, pl: 3 }}>
        <Button
          variant='outlined'
          color='error'
          onClick={onClose}
          sx={{ textTransform: 'none' }}
        >
          Huỷ
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          sx={{
            backgroundColor: '#001f5d',
            color: '#fff',
            textTransform: 'none'
          }}
        >
          Thêm
        </Button>
      </DialogActions>
      <DialogContent dividers sx={{ pt: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            select
            label='Nhóm quyền'
            fullWidth
            margin='normal'
            {...register('group', { required: 'Vui lòng chọn nhóm quyền' })}
            error={!!errors.group}
            helperText={errors.group?.message}
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2}>
            <Typography fontWeight={500} mb={1}>
              Danh sách quyền
            </Typography>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ width: 65 }}>
                    STT
                  </TableCell>
                  <TableCell>Key</TableCell>
                  <TableCell>Tên quyền</TableCell>
                  <TableCell align='left' sx={{ width: 110 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keyList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell>
                      <TextField
                        value={item.key}
                        onChange={(e) =>
                          handleChange(index, 'key', e.target.value)
                        }
                        fullWidth
                        size='small'
                        placeholder='vd: coupon:create'
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.label}
                        onChange={(e) =>
                          handleChange(index, 'label', e.target.value)
                        }
                        fullWidth
                        size='small'
                        placeholder='Tên quyền'
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title='Xoá'>
                        <IconButton
                          onClick={() => removeRow(index)}
                          disabled={keyList.length === 1}
                          sx={{ ml: '-10px' }}
                        >
                          <DeleteIcon fontSize='small' color='error' />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'start', padding: '16px 24px' }}>
        <Button variant='outlined' onClick={addRow}>
          Thêm dòng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
