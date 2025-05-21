import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function AddColorModal({ open, onClose, onAddColor }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = (data) => {
    const newColor = {
      _id: crypto.randomUUID(),
      name: data.name,
      code: data.code
    }
    if (typeof onAddColor === 'function') {
      onAddColor(newColor)
    }
    reset()
    onClose()
  }

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm màu sắc</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-4'>
          <div>
            <label className='block mb-1 font-medium'>Tên màu</label>
            <TextField
              {...register('name', { required: 'Vui lòng nhập tên màu' })}
              placeholder='Ví dụ: Đỏ tươi'
              fullWidth
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className='block mb-1 font-medium'>Mã màu (hex)</label>
            <TextField
              type='color'
              {...register('code', { required: 'Vui lòng chọn mã màu' })}
              className='h-10 w-16 p-0 border-none'
            />
            {errors.code && (
              <p className='text-red-500 text-sm mt-1'>{errors.code.message}</p>
            )}
          </div>

          <DialogActions className='pt-4'>
            <Button type='button' variant='outlined' onClick={onClose}>
              Hủy
            </Button>
            <Button type='submit'>Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
