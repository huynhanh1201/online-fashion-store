import React from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/assets/StyleAdmin.jsx'
import UserRow from './UserRow'

const UserTable = React.memo(function UserTable({
  users,
  page,
  handleOpenModal,
  loading
}) {
  const validUsers = users.filter((user) => !user.destroy)

  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
              STT
            </StyledTableCell>
            <StyledTableCell>Tên</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Quyền</StyledTableCell>
            <StyledTableCell className='hide-on-mobile'>
              Ngày tạo
            </StyledTableCell>
            <StyledTableCell className='hide-on-mobile'>
              Cập nhật
            </StyledTableCell>
            <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
              Hành động
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <StyledTableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell className='hide-on-mobile'></StyledTableCell>
              <StyledTableCell className='hide-on-mobile'></StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          ) : validUsers.length > 0 ? (
            validUsers.map((user, idx) => (
              <UserRow
                key={user._id}
                user={user}
                index={(page - 1) * 10 + idx + 1}
                handleOpenModal={handleOpenModal}
              />
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={7} align='center'>
                Không có người dùng nào
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  )
})
export default UserTable
