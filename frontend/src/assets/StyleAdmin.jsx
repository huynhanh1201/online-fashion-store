import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { tableCellClasses } from '@mui/material/TableCell'
const StyleAdmin = {
  TableColumnSTT: {
    textAlign: 'center',
    width: '50px'
  },
  OverlayModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  NoneOverlayModal: {
    backgroundColor: 'transparent',
    boxShadow: 'none'
  },
  InputCustom: {
    '& .MuiOutlinedInput-input': {
      color: '#000' // đây là phần text trong input
    },
    InputViews: {
      '& .MuiOutlinedInput-input': {
        color: '#808080' // đây là phần text trong input
      }
    },
    '& label': {
      // color: '#000' // màu label
    },
    '& label.Mui-focused': {
      color: '#000' // màu label khi focus
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#000' // màu viền mặc định
      },
      '&:hover fieldset': {
        borderColor: '#000' // màu viền khi hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000', // màu viền khi focus
        borderWidth: '1px' // độ dày viền khi focus
      }
    },
    CursorNone: {
      '& .MuiOutlinedInput-root:hover': {
        cursor: 'no-drop' // ẩn con trỏ khi hover toàn vùng
      },
      '& .MuiOutlinedInput-input:hover': {
        cursor: 'no-drop' // ẩn con trỏ trong vùng input
      }
    }
  },
  FormSelect: {
    color: '#808080',
    '& label': {
      color: '#000'
    },
    '& label.Mui-focused': {
      color: '#000'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#000'
      },
      '&:hover fieldset': {
        borderColor: '#000'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000',
        borderWidth: '1px'
      }
    },
    SelectMenu: {
      '& .MuiMenu-list': {
        padding: '0 !important'
      },
      '& .MuiMenuItem-root': {
        fontSize: '14px',
        padding: '12px 16px',
        color: '#000',
        '&:hover': {
          backgroundColor: '#f0f0f0'
        }
      },
      '& .Mui-selected': {
        backgroundColor: '#ebebeb !important',
        '&:hover': {
          backgroundColor: '#ebebeb'
        }
      },
      '& .MuiDivider-root': {
        margin: '4px 0',
        backgroundColor: '#ccc'
      }
    }
  }
}
export default StyleAdmin

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#001f5d',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    borderRight: '1px solid #e0e0e0',
    padding: '8px',
    whiteSpace: 'nowrap'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0',
    padding: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  [theme.breakpoints.down('sm')]: {
    '&.hide-on-mobile': {
      display: 'none'
    }
  }
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  }
}))

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  overflowX: 'auto',
  maxWidth: '100%',
  '&::-webkit-scrollbar': {
    height: '8px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#001f5d',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1'
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '600px'
  }
}))
// Profile
export const readOnlyBottomBorderInputSx = {
  '& .MuiInputBase-root': {
    fontSize: 16,
    color: '#000'
  },
  '& .MuiInput-underline:before': {
    borderBottom: '1px solid #000'
  },
  '& .MuiInput-underline:hover:before': {
    borderBottom: '1px solid #000'
  },
  '& .MuiInput-underline:after': {
    borderBottom: '1px solid #000'
  }
}
