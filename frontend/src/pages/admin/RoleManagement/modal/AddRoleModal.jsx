// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Box,
//   Typography,
//   Checkbox,
//   Chip,
//   FormControlLabel,
//   Grid,
//   Paper
// } from '@mui/material'
// import { useForm, Controller } from 'react-hook-form'
// import { Stack } from '@mui/material'
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
// const AddRoleModal = ({ open, onClose, onSubmit, p }) => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//     setValue,
//     watch
//   } = useForm({
//     defaultValues: {
//       name: '',
//       label: '',
//       permissions: []
//     }
//   })
//
//   const selectedPermissions = watch('permissions') || []
//   const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
//
//   const handleTogglePermission = (key) => {
//     const current = new Set(selectedPermissions)
//     if (current.has(key)) {
//       current.delete(key)
//     } else {
//       current.add(key)
//     }
//     setValue('permissions', Array.from(current))
//   }
//
//   const handleSave = (data) => {
//     onSubmit(data, 'add')
//     onClose()
//     reset()
//   }
//
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth='md'
//       PaperProps={{
//         sx: {
//           display: 'flex',
//           flexDirection: 'column',
//           marginTop: '50px',
//           height: '85vh',
//           maxHeight: '85vh' // đảm bảo không vượt quá
//         }
//       }}
//     >
//       <DialogTitle sx={{ pb: 1 }}>Thêm vai trò</DialogTitle>
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
//           onClick={handleSubmit(handleSave)}
//           variant='contained'
//           sx={{
//             backgroundColor: 'var(--primary-color)',
//             color: '#fff',
//             textTransform: 'none'
//           }}
//         >
//           Thêm
//         </Button>
//       </DialogActions>
//       <DialogContent dividers sx={{ pt: 0 }}>
//         <Controller
//           name='name'
//           control={control}
//           rules={{ required: 'Không được bỏ trống tên vai trò' }}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               fullWidth
//               margin='normal'
//               label='Tên vai trò'
//               error={!!errors.name}
//               helperText={errors.name?.message}
//             />
//           )}
//         />
//         <Controller
//           name='label'
//           control={control}
//           rules={{ required: 'Không được bỏ trống tên hiển thị' }}
//           render={({ field }) => (
//             <TextField
//               {...field}
//               fullWidth
//               margin='normal'
//               label='Tên hiển thị'
//               error={!!errors.label}
//               helperText={errors.label?.message}
//             />
//           )}
//         />
//
//         <Box mt={2}>
//           <Typography variant='subtitle1' fontWeight={600} mb={2}>
//             Phân quyền
//           </Typography>
//
//           <Grid container spacing={2}>
//             <Grid item size={4} xs={12} md={4}>
//               <Paper
//                 variant='outlined'
//                 sx={{ p: 1, maxHeight: 400, overflowY: 'auto' }}
//               >
//                 {p.map((groupItem, idx) => {
//                   const groupSelectedCount = groupItem.permissions.filter(
//                     (perm) => selectedPermissions.includes(perm.key)
//                   ).length
//                   return (
//                     <Box
//                       key={idx}
//                       sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         cursor: 'pointer',
//                         p: 1,
//                         borderBottom: '1px solid #eee',
//                         backgroundColor:
//                           idx === selectedGroupIndex ? '#f5f5f5' : 'transparent'
//                       }}
//                       onClick={() => setSelectedGroupIndex(idx)}
//                     >
//                       <Typography fontWeight={500}>
//                         {groupItem.group}
//                       </Typography>
//                       <Chip
//                         size='small'
//                         label={`${groupSelectedCount}/${groupItem.permissions.length}`}
//                         color={groupSelectedCount > 0 ? 'primary' : 'default'}
//                         sx={{ ml: 1 }}
//                       />
//                     </Box>
//                   )
//                 })}
//               </Paper>
//             </Grid>
//
//             <Grid size={8} item xs={12} md={8}>
//               <Paper
//                 variant='outlined'
//                 sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}
//               >
//                 <Box
//                   display='flex'
//                   justifyContent='start'
//                   alignItems='start'
//                   flexDirection='column'
//                 >
//                   <Typography fontWeight={600}>
//                     {p[selectedGroupIndex]?.group || '---'}
//                   </Typography>
//                   <Box sx={{ mt: 1 }}>
//                     <Stack direction='row' spacing={2}>
//                       <Button
//                         size='small'
//                         startIcon={<CheckCircleOutlineIcon fontSize='small' />}
//                         sx={{ color: '#1a73e8', textTransform: 'none' }}
//                         onClick={() => {
//                           const keys =
//                             p[selectedGroupIndex]?.permissions.map(
//                               (perm) => perm.key
//                             ) || []
//                           setValue(
//                             'permissions',
//                             Array.from(
//                               new Set([...selectedPermissions, ...keys])
//                             )
//                           )
//                         }}
//                       >
//                         Chọn tất cả
//                       </Button>
//
//                       <Button
//                         size='small'
//                         startIcon={
//                           <CancelOutlinedIcon fontSize='small' color='error' />
//                         }
//                         sx={{ color: '#f00', textTransform: 'none' }}
//                         onClick={() => {
//                           const keys =
//                             p[selectedGroupIndex]?.permissions.map(
//                               (perm) => perm.key
//                             ) || []
//                           setValue(
//                             'permissions',
//                             selectedPermissions.filter((k) => !keys.includes(k))
//                           )
//                         }}
//                       >
//                         Huỷ tất cả
//                       </Button>
//                     </Stack>
//                   </Box>
//                 </Box>
//                 <Box display='flex' flexDirection='column' gap={1}>
//                   {p[selectedGroupIndex]?.permissions.map((perm) => (
//                     <FormControlLabel
//                       key={perm.key}
//                       control={
//                         <Checkbox
//                           checked={selectedPermissions.includes(perm.key)}
//                           onChange={() => handleTogglePermission(perm.key)}
//                         />
//                       }
//                       label={perm.label}
//                     />
//                   ))}
//                 </Box>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   )
// }
//
// export default AddRoleModal

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Paper
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { Stack } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

const AddRoleModal = ({ open, onClose, onSubmit, p }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      label: '',
      permissions: []
    }
  })

  const selectedPermissions = watch('permissions') || []
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)

  const handleTogglePermission = (key) => {
    const current = new Set(selectedPermissions)
    if (current.has(key)) {
      current.delete(key)
    } else {
      current.add(key)
    }
    setValue('permissions', Array.from(current))
  }

  const handleSave = (data) => {
    onSubmit(data, 'add')
    onClose()
    reset()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
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
      <DialogTitle sx={{ pb: 1 }}>Thêm vai trò</DialogTitle>
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
          onClick={handleSubmit(handleSave)}
          variant='contained'
          sx={{
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            textTransform: 'none'
          }}
        >
          Thêm
        </Button>
      </DialogActions>
      <DialogContent dividers sx={{ pt: 0 }}>
        <Controller
          name='name'
          control={control}
          rules={{
            required: 'Không được bỏ trống tên vai trò',
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Tên chỉ chứa chữ cái, số và dấu gạch dưới'
            },
            maxLength: {
              value: 50,
              message: 'Tên vai trò không được quá 50 ký tự'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin='normal'
              label={
                <>
                  Tên vai trò <span style={{ color: 'red' }}>*</span> (bắt buộc)
                </>
              }
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name='label'
          control={control}
          rules={{
            required: 'Không được bỏ trống tên hiển thị',
            maxLength: {
              value: 100,
              message: 'Tên hiển thị không được quá 100 ký tự'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin='normal'
              label={
                <>
                  Tên hiển thị <span style={{ color: 'red' }}>*</span> (bắt
                  buộc)
                </>
              }
              error={!!errors.label}
              helperText={errors.label?.message}
            />
          )}
        />

        <Box mt={2}>
          <Typography variant='subtitle1' fontWeight={600} mb={2}>
            Phân quyền
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={4} xs={12} md={4}>
              <Paper
                variant='outlined'
                sx={{ p: 1, maxHeight: 400, overflowY: 'auto' }}
              >
                {p.map((groupItem, idx) => {
                  const groupSelectedCount = groupItem.permissions.filter(
                    (perm) => selectedPermissions.includes(perm.key)
                  ).length
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        p: 1,
                        borderBottom: '1px solid #eee',
                        backgroundColor:
                          idx === selectedGroupIndex ? '#f5f5f5' : 'transparent'
                      }}
                      onClick={() => setSelectedGroupIndex(idx)}
                    >
                      <Typography fontWeight={500}>
                        {groupItem.group}
                      </Typography>
                      <Chip
                        size='small'
                        label={`${groupSelectedCount}/${groupItem.permissions.length}`}
                        color={groupSelectedCount > 0 ? 'primary' : 'default'}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  )
                })}
              </Paper>
            </Grid>

            <Grid size={8} item xs={12} md={8}>
              <Paper
                variant='outlined'
                sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}
              >
                <Box
                  display='flex'
                  justifyContent='start'
                  alignItems='start'
                  flexDirection='column'
                >
                  <Typography fontWeight={600}>
                    {p[selectedGroupIndex]?.group || '---'}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Stack direction='row' spacing={2}>
                      <Button
                        size='small'
                        startIcon={<CheckCircleOutlineIcon fontSize='small' />}
                        sx={{ color: '#1a73e8', textTransform: 'none' }}
                        onClick={() => {
                          const keys =
                            p[selectedGroupIndex]?.permissions.map(
                              (perm) => perm.key
                            ) || []
                          setValue(
                            'permissions',
                            Array.from(
                              new Set([...selectedPermissions, ...keys])
                            )
                          )
                        }}
                      >
                        Chọn tất cả
                      </Button>

                      <Button
                        size='small'
                        startIcon={
                          <CancelOutlinedIcon fontSize='small' color='error' />
                        }
                        sx={{ color: '#f00', textTransform: 'none' }}
                        onClick={() => {
                          const keys =
                            p[selectedGroupIndex]?.permissions.map(
                              (perm) => perm.key
                            ) || []
                          setValue(
                            'permissions',
                            selectedPermissions.filter((k) => !keys.includes(k))
                          )
                        }}
                      >
                        Huỷ tất cả
                      </Button>
                    </Stack>
                  </Box>
                </Box>
                <Box display='flex' flexDirection='column' gap={1}>
                  {p[selectedGroupIndex]?.permissions.map((perm) => (
                    <FormControlLabel
                      key={perm.key}
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(perm.key)}
                          onChange={() => handleTogglePermission(perm.key)}
                        />
                      }
                      label={perm.label}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddRoleModal
