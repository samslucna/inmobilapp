// components/DataTablePagination.jsx
import { Box, Grid, Typography, TablePagination, Pagination, PaginationItem, useMediaQuery, useTheme } from "@mui/material";

const DataTablePagination = ({
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  from,
  to,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  if (totalCount === 0) return null;

  if (isMobile) {
    return (
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(e, value) => onPageChange(e, value - 1)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            siblingCount={0}
            boundaryCount={1}
            disabled={isLoading}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  minWidth: 36,
                  height: 36,
                }}
              />
            )}
          />
        </Box>
        <Box sx={{ textAlign: "center", mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="caption" color="textSecondary">
            Mostrando {from} - {to} de {totalCount} registros
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            Mostrando {from} - {to} de {totalCount} registros
          </Typography>
        </Grid>
        <Grid item>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage="Filas por página:"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            showFirstButton
            showLastButton
            disabled={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataTablePagination;