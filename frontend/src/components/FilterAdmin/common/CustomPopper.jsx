import Popper from '@mui/material/Popper'

const CustomPopper = (props) => (
  <Popper
    {...props}
    placement='bottom-start'
    modifiers={[
      {
        name: 'offset',
        options: {
          offset: [0, 4]
        }
      }
    ]}
    sx={{
      minWidth: '300px', // 👈 chỉnh chiều rộng gợi ý ở đây
      maxWidth: '500px', // nếu muốn giới hạn max
      zIndex: 1300
    }}
  />
)

export default CustomPopper
