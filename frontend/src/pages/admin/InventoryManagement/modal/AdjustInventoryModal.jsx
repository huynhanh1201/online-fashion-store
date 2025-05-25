import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'

const AdjustInventoryModal = ({ open, onClose, onSubmit, type }) => {
  const { register, handleSubmit, reset } = useForm()

  const handleFormSubmit = (data) => {
    onSubmit(Number(data.quantity))
    reset()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{type === 'in' ? 'Nhập kho' : 'Xuất kho'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <TextField
            label='Số lượng'
            type='number'
            fullWidth
            {...register('quantity', { required: true, min: 1 })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type='submit'
            variant='contained'
            color={type === 'in' ? 'success' : 'error'}
          >
            {type === 'in' ? 'Nhập kho' : 'Xuất kho'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AdjustInventoryModal
