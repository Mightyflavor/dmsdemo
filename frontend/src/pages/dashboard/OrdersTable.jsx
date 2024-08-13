import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NumericFormat } from 'react-number-format';
import Dot from 'components/@extended/Dot';

const headCells = [
  { id: 'tracking_no', align: 'left', disablePadding: false, label: 'Tracking No.' },
  { id: 'name', align: 'left', disablePadding: true, label: 'Product Name' },
  { id: 'carbs', align: 'left', disablePadding: false, label: 'Status' },
  { id: 'protein', align: 'right', disablePadding: false, label: 'Invoice Worth' }
];

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  console.log("Status:", status);  // Debugging line to check status value

  let color;
  let title;

  switch (status) {
    case 'Pending':
      color = 'warning';
      title = 'Pending';
      break;
    case 'Approved':
      color = 'success';
      title = 'Approved';
      break;
    case 'Rejected':
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = status;  // Display the actual status if not matched
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function OrderTable() {
  const [rows, setRows] = useState([]);
  const order = 'asc';
  const orderBy = 'tracking_no';

  useEffect(() => {
    // Fetch data from your backend API
    axios.get('http://localhost:5000/docu')
      .then(response => {
        setRows(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {rows.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row._id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary">{row._id}</Link>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.paymentDetails?.amount || 0} displayType="text" thousandSeparator prefix="Rs." />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
