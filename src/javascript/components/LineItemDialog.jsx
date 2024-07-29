import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Box,
} from '@material-ui/core'

const LineItemDialog = ({ open, setOpen, lineItems, total }) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box width="100%">
      <Dialog fullScreen onClose={handleClose} open={open}>
        <DialogTitle>Score Detail</DialogTitle>
        <DialogContent dividers>
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineItems.map((item) => (
                <TableRow key={item[0]}>
                  <TableCell>{item[0]}</TableCell>
                  <TableCell>{item[1]}</TableCell>
                </TableRow>
              ))}
              {!lineItems.length && (
                <TableRow>
                  <TableCell>
                    <em>no scoring items</em>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  <b>Total</b>
                </TableCell>
                <TableCell>
                  <b>{total}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LineItemDialog
