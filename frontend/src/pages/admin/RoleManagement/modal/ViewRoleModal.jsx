import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Box,
  Typography,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Paper,
  DialogActions,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import dayjs from 'dayjs'
const ViewRoleModal = ({ open, onClose, p, role }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [selectedGroupName, setSelectedGroupName] = useState(0)

  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions || [])

      const firstGroup = p.find((group) =>
        group.permissions.some((perm) =>
          (role.permissions || []).includes(perm.key)
        )
      )

      if (firstGroup) {
        setSelectedGroupName(firstGroup.group)
      }
    }
  }, [role, p])
  const selectedGroup = p.find((g) => g.group === selectedGroupName)

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
      <DialogTitle sx={{ pb: 1 }}>Xem vai trò</DialogTitle>
      <DialogActions sx={{ p: 0, justifyContent: 'start', pb: 2, pl: 3 }}>
        <Button
          variant='outlined'
          color='error'
          onClick={onClose}
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
      <DialogContent dividers sx={{ pt: 0 }}>
        <Table size='small'>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography fontWeight={500}>Tên vai trò</Typography>
              </TableCell>
              <TableCell>{role?.name || ''}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography fontWeight={500}>Tên hiển thị</Typography>
              </TableCell>
              <TableCell>{role?.label || ''}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography fontWeight={500}>Ngày tạo</Typography>
              </TableCell>
              <TableCell>
                {role?.createdAt
                  ? dayjs(role.createdAt).format('HH:mm DD/MM/YYYY')
                  : ''}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography fontWeight={500}>Ngày cập nhật</Typography>
              </TableCell>
              <TableCell>
                {role?.updatedAt
                  ? dayjs(role.updatedAt).format('HH:mm DD/MM/YYYY')
                  : ''}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box mt={2}>
          <Typography variant='subtitle1' fontWeight={600} mb={2}>
            Phân quyền
          </Typography>
          {selectedPermissions.length === 0 ? (
            <Typography color='#000'>Không có dữ liệu phân quyền</Typography>
          ) : (
            <Grid container spacing={2}>
              <Grid item size={4} xs={12} md={4}>
                <Paper
                  variant='outlined'
                  sx={{ p: 1, maxHeight: 400, overflowY: 'auto' }}
                >
                  {p
                    .filter((groupItem) =>
                      groupItem.permissions.some((perm) =>
                        selectedPermissions.includes(perm.key)
                      )
                    )
                    .map((groupItem, idx) => {
                      const groupSelectedCount = groupItem.permissions.filter(
                        (perm) => selectedPermissions.includes(perm.key)
                      ).length
                      console.log('groupItem', groupItem)
                      return (
                        <Box
                          key={groupItem.group}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            p: 1,
                            borderBottom: '1px solid #eee',
                            backgroundColor:
                              idx === selectedGroupIndex
                                ? '#f5f5f5'
                                : 'transparent'
                          }}
                          onClick={() => setSelectedGroupName(groupItem.group)}
                        >
                          <Typography fontWeight={500}>
                            {groupItem.group}
                          </Typography>
                          <Chip
                            size='small'
                            label={`${groupSelectedCount}/${groupItem.permissions.length}`}
                            color={
                              groupSelectedCount > 0 ? 'primary' : 'default'
                            }
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      )
                    })}
                </Paper>
              </Grid>

              <Grid item size={8} xs={12} md={8}>
                <Paper variant='outlined' sx={{ p: 2 }}>
                  <Typography fontWeight={600} mb={1}>
                    {selectedGroup?.group || '---'}
                  </Typography>

                  <Box display='flex' flexDirection='column' gap={1}>
                    {selectedGroup?.permissions
                      .filter((perm) => selectedPermissions.includes(perm.key))
                      .map((perm) => (
                        <FormControlLabel
                          key={perm.key}
                          control={<Checkbox checked />}
                          label={perm.label}
                        />
                      ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ViewRoleModal
