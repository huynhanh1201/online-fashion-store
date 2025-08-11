// import React, { useEffect } from 'react'

// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   Divider,
//   CircularProgress,
//   Autocomplete,
//   TextField
// } from '@mui/material'
// import { IconButton, InputAdornment } from '@mui/material'
// import { Visibility, VisibilityOff } from '@mui/icons-material'
// import { useState } from 'react'
// import { useForm, Controller } from 'react-hook-form'
// import StyleAdmin from '~/assets/StyleAdmin.jsx'
// import usePermissions from '~/hooks/usePermissions'

// const EditAccountModal = ({ open, onClose, user, onSave, roles, permissions }) => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { isSubmitting }
//   } = useForm({
//     defaultValues: {
//       name: '',
//       password: '',
//       role: '',
//       roleId: ''
//     }
//   })
//   const { hasPermission } = usePermissions()
//   const [showPassword, setShowPassword] = useState(false)
//   const toggleShowPassword = () => setShowPassword((prev) => !prev)

//   useEffect(() => {
//     if (open && user) {
//       const selectedRole = roles.find((r) => r.name === user.role)
//       reset({
//         name: user.name || '',
//         password: '',
//         role: user.role || '',
//         roleId: selectedRole?._id || ''
//       })
//     }
//   }, [open, user, reset, roles])

//   const onSubmit = async (data) => {
//     const payload = {
//       name: data.name,
//       role: data.role,
//       roleId: data.roleId
//     }

//     // Chỉ gửi mật khẩu nếu được nhập
//     if (data.password?.trim()) {
//       payload.password = data.password
//     }

//     await onSave(payload, 'edit', user._id)
//     onClose()
//   }

//   const roleOptions = roles
//     .filter((role) => role.name !== 'customer')
//     .map((role) => ({
//       id: role._id,
//       name: role.name,
//       label: role.label || role.name
//     }))

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth='sm'
//       BackdropProps={{
//         sx: StyleAdmin.OverlayModal
//       }}
//     >
//       <DialogTitle>Cập nhật thông tin Tài khoàn</DialogTitle>
//       <Divider sx={{ my: 0 }} />
//       <DialogContent>
//         <form id='edit-user-form' onSubmit={handleSubmit(onSubmit)}>
//           <Controller
//             name='name'
//             control={control}
//             rules={{
//               required: 'Họ và tên là bắt buộc',
//               minLength: {
//                 value: 3,
//                 message: 'Họ và tên phải có ít nhất 3 ký tự'
//               },
//               maxLength: {
//                 value: 50,
//                 message: 'Họ và tên không vượt quá 50 ký tự'
//               },
//               validate: (value) =>
//                 value.trim() === value ||
//                 'Họ và tên không được có khoảng trắng ở đầu hoặc cuối'
//             }}
//             render={({ field, fieldState }) => (
//               <TextField
//                 {...field}
//                 label={
//                   <>
//                     Tên tài khoản <span style={{ color: 'red' }}>*</span>
//                   </>
//                 }
//                 fullWidth
//                 margin='normal'
//                 error={!!fieldState.error}
//                 helperText={fieldState.error?.message}
//                 sx={StyleAdmin.InputCustom}
//               />
//             )}
//           />

//           <Controller
//             name='password'
//             control={control}
//             rules={{
//               validate: (value) => {
//                 if (!value?.trim()) return true
//                 const regex =
//                   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/
//                 return (
//                   regex.test(value) ||
//                   'Mật khẩu phải từ 8–128 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
//                 )
//               }
//             }}
//             render={({ field, fieldState }) => (
//               <TextField
//                 {...field}
//                 label='Mật khẩu mới'
//                 type={showPassword ? 'text' : 'password'}
//                 fullWidth
//                 margin='normal'
//                 error={!!fieldState.error}
//                 helperText={
//                   fieldState.error?.message || 'Để trống nếu không đổi'
//                 }
//                 sx={StyleAdmin.InputCustom}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position='end' sx={{ pr: 1 }}>
//                       <IconButton onClick={toggleShowPassword} edge='end'>
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   )
//                 }}
//               />
//             )}
//           />
//           {hasPermission('account:technicalAdmin')  && (
//             <Controller
//               name='role'
//               control={control}
//               rules={{
//                 required: 'Vai trò là bắt buộc, vui lòng chọn 1 vai trò phù hợp'
//               }}
//               render={({ field, fieldState }) => (
//                 <Autocomplete
//                   options={roleOptions}
//                   getOptionLabel={(option) => option.label}
//                   isOptionEqualToValue={(option, value) =>
//                     option.name === value?.name
//                   }
//                   value={roleOptions.find((r) => r.name === field.value) || null}
//                   onChange={(_, selected) => {
//                     field.onChange(selected?.name || '')
//                     setValue('roleId', selected?.id || '') // ← Cập nhật roleId khi chọn
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label={
//                         <>
//                           Vai trò <span style={{ color: 'red' }}>*</span>
//                         </>
//                       }
//                       margin='normal'
//                       error={!!fieldState.error}
//                       helperText={fieldState.error?.message}
//                       sx={StyleAdmin.InputCustom}
//                       onFocus={(event) => {
//                         const input = event.target
//                         requestAnimationFrame(() => {
//                           input.setSelectionRange?.(
//                             input.value.length,
//                             input.value.length
//                           )
//                         })
//                       }}
//                     />
//                   )}
//                 />
//               )}
//             />
//           )}
//         </form>
//       </DialogContent>
//       <Divider sx={{ my: 0 }} />
//       <DialogActions sx={{ padding: '16px 24px' }}>
//         <Button
//           onClick={onClose}
//           disabled={isSubmitting}
//           color='error'
//           variant='outlined'
//           sx={{ textTransform: 'none' }}
//         >
//           Hủy
//         </Button>
//         <Button
//           type='submit'
//           form='edit-user-form'
//           variant='contained'
//           disabled={isSubmitting}
//           startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
//           sx={{
//             backgroundColor: '#001f5d',
//             color: '#fff',
//             textTransform: 'none'
//           }}
//         >
//           {isSubmitting ? 'Đang lưu' : 'Lưu'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default EditAccountModal

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
  CircularProgress,
  Autocomplete,
  TextField,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import usePermissions from '~/hooks/usePermissions'

const EditAccountModal = ({
  open,
  onClose,
  user,
  onSave,
  roles,
  permissions,
  profile
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      password: '',
      role: '',
      roleId: ''
    }
  })

  const { hasPermission } = usePermissions()
  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword((prev) => !prev)

  const isTechnician = user?.role?.toLowerCase() === 'technical_admin'

  useEffect(() => {
    if (open && user) {
      const selectedRole = roles.find((r) => r.name === user.role)
      reset({
        name: user.name || '',
        password: '',
        role: user.role || '',
        roleId: selectedRole?._id || ''
      })
    }
  }, [open, user, reset, roles])

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      role: data.role,
      roleId: data.roleId
    }

    if (data.password?.trim()) {
      payload.password = data.password
    }

    await onSave(payload, 'edit', user._id)
    onClose()
  }

  // const roleOptions = roles
  //   .filter((role) => role.name !== 'customer')
  //   .map((role) => ({
  //     id: role._id,
  //     name: role.name,
  //     label: role.label || role.name
  //   }))

  const roleOptions = roles
    .filter((role) => {
      if (role.name === 'customer') return false
      if (
        role.name === 'technical_admin' &&
        profile?.role !== 'technical_admin'
      )
        return false
      return true
    })
    .map((role) => ({
      id: role._id,
      name: role.name,
      label: role.label || role.name
    }))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Cập nhật thông tin Tài khoản</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='edit-user-form' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{
              required: 'Họ và tên là bắt buộc',
              minLength: { value: 3, message: 'Tối thiểu 3 ký tự' },
              maxLength: { value: 50, message: 'Tối đa 50 ký tự' },
              validate: (value) =>
                value.trim() === value ||
                'Không được có khoảng trắng ở đầu hoặc cuối'
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={
                  <>
                    Tên tài khoản <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={StyleAdmin.InputCustom}
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            rules={{
              validate: (value) => {
                if (!value?.trim()) return true
                const regex =
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/
                return (
                  regex.test(value) ||
                  'Mật khẩu phải từ 8–128 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
                )
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Mật khẩu mới'
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message || 'Để trống nếu không đổi'
                }
                sx={StyleAdmin.InputCustom}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end' sx={{ pr: 1 }}>
                      <IconButton onClick={toggleShowPassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          {/*{(profile?.role === 'technical_admin' ||*/}
          {/*  ((hasPermission('account:technicalAdmin') ||*/}
          {/*    hasPermission('account:update')) &&*/}
          {/*    !(*/}
          {/*      profile?.role === 'owner' && user?.role === 'technical_admin'*/}
          {/*    ))) && (*/}
          {/*  <Controller*/}
          {/*    name='role'*/}
          {/*    control={control}*/}
          {/*    rules={{*/}
          {/*      required: 'Vai trò là bắt buộc, vui lòng chọn 1 vai trò phù hợp'*/}
          {/*    }}*/}
          {/*    render={({ field, fieldState }) => (*/}
          {/*      <Autocomplete*/}
          {/*        options={roleOptions}*/}
          {/*        getOptionLabel={(option) => option.label}*/}
          {/*        isOptionEqualToValue={(option, value) =>*/}
          {/*          option.name === value?.name*/}
          {/*        }*/}
          {/*        value={*/}
          {/*          roleOptions.find((r) => r.name === field.value) || null*/}
          {/*        }*/}
          {/*        onChange={(_, selected) => {*/}
          {/*          field.onChange(selected?.name || '')*/}
          {/*          setValue('roleId', selected?.id || '')*/}
          {/*        }}*/}
          {/*        renderInput={(params) => (*/}
          {/*          <TextField*/}
          {/*            {...params}*/}
          {/*            label={*/}
          {/*              <>*/}
          {/*                Vai trò <span style={{ color: 'red' }}>*</span>*/}
          {/*              </>*/}
          {/*            }*/}
          {/*            margin='normal'*/}
          {/*            error={!!fieldState.error}*/}
          {/*            helperText={fieldState.error?.message}*/}
          {/*            sx={StyleAdmin.InputCustom}*/}
          {/*          />*/}
          {/*        )}*/}
          {/*      />*/}
          {/*    )}*/}
          {/*  />*/}
          {/*)}*/}
          {(profile?.role === 'technical_admin' ||
            ((hasPermission('account:technicalAdmin') ||
              hasPermission('account:update')) &&
              !(
                profile?.role === 'owner' && user?.role === 'technical_admin'
              ))) && (
            <Controller
              name='role'
              control={control}
              rules={{
                required: 'Vai trò là bắt buộc, vui lòng chọn 1 vai trò phù hợp'
              }}
              render={({ field, fieldState }) => {
                const isSameUser = user?._id === profile?._id

                return (
                  <Autocomplete
                    options={roleOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.name === value?.name
                    }
                    value={
                      roleOptions.find((r) => r.name === field.value) || null
                    }
                    onChange={(_, selected) => {
                      field.onChange(selected?.name || '')
                      setValue('roleId', selected?.id || '')
                    }}
                    disabled={isSameUser} // Không cho sửa khi là chính mình
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <>
                            Vai trò <span style={{ color: 'red' }}>*</span>
                          </>
                        }
                        margin='normal'
                        error={!!fieldState.error || isSameUser}
                        helperText={
                          isSameUser
                            ? 'Bạn không thể thay đổi vai trò của chính mình'
                            : fieldState.error?.message
                        }
                        sx={{
                          ...StyleAdmin.InputCustom,
                          pointerEvents: isSameUser ? 'none' : 'auto'
                        }}
                      />
                    )}
                  />
                )
              }}
            />
          )}
        </form>
      </DialogContent>

      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
        <Button
          type='submit'
          form='edit-user-form'
          variant='contained'
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{
            backgroundColor: '#001f5d',
            color: '#fff',
            textTransform: 'none'
          }}
        >
          {isSubmitting ? 'Đang lưu' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditAccountModal
