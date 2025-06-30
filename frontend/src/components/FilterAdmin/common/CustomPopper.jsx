import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'

const StyledPopper = styled(Popper)(() => ({
  zIndex: 1300,
  '& .MuiAutocomplete-paper': {
    width: 'auto',
    maxWidth: 400
  }
}))

const CustomPopper = (props) => (
  <StyledPopper
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
  />
)

export default CustomPopper
