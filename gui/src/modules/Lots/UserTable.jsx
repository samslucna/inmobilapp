import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


export default function UserTable() {
 
 // const handleChangePage = (event: unknown, newPage: number) => {
 //   setPage(newPage);
 // };
//
 // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
 //   setRowsPerPage(+event.target.value);
 //   setPage(0);
 // };
//
  return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Hola</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover role="checkbox" tabIndex={-1} key={1}>
              <TableCell>Hola</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
      //rowsPerPageOptions={[10, 25, 100]}
      //component="div"
      //count={rows.length}
      //rowsPerPage={rowsPerPage}
      //page={page}
      //onPageChange={handleChangePage}
      //onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
