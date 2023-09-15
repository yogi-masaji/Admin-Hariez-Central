import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import moment from 'moment';
import 'moment/locale/id';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/komplain';
// mock
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'kode Booking', label: 'Kode Perbaikan', alignRight: false },
  { id: 'Komplain', label: 'Komplain', alignRight: false },
  { id: 'Pelanggan', label: 'Pelanggan', alignRight: false },
  { id: 'Teknisi', label: 'Teknisi', alignRight: false },
  { id: 'Perangkat', label: 'Perangkat', alignRight: false },
  { id: 'Harga', label: 'Harga', alignRight: false },
  { id: 'tanggal perbaikan', label: 'Tanggal Perbaikan', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  // const stabilizedThis = array.map((el, index) => [el, index]);
  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });
  if (query) {
    return filter(array, (_user) => _user.id.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return array;
}

export default function PerbaikanPage() {
  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('nama');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [pelanggan, setPelanggan] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPelanggan = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await fetch('http://127.0.0.1:3000/komplain', { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const perbaikanData = data['Data Komplain'];

        setPelanggan(perbaikanData);
        console.log(perbaikanData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPelanggan();
  }, []);

  const handleRequestSort = (event, property) => {
    // if (property === 'nama') {
    //   const isAsc = orderBy === property && order === 'asc';
    //   setOrder(isAsc ? 'desc' : 'asc');
    //   setOrderBy(property);
    // }
  };

  // const handleClick = (event, nama) => {
  //   const selectedIndex = selected.indexOf(nama);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, nama);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pelanggan.length) : 0;

  const filteredUsers = applySortFilter(pelanggan, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  function getStatusColor(status) {
    switch (status) {
      case 'Option 1':
        return 'status-option1';
      case 'Option 2':
        return 'status-option2';
      case 'Option 3':
        return 'status-option3';
      case 'Sedang diperbaiki':
        return 'status-diperbaiki';
      default:
        return '';
    }
  }

  return (
    <>
      <Helmet>
        <title> Data Komplain</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Data Komplain
          </Typography>
          {/* <Button  variant="contained" startIcon={<Iconify icon="eva:more-vertical-fill" />}>
            Pelanggan Baru
          </Button> */}
          {/* <ModalPostButton onPostModal={handlePostModal} /> */}
        </Stack>

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const {
                      id,
                      nama,
                      email,
                      nomorTelepon,
                      status,
                      kendala,
                      perangkat,
                      kodePerbaikan,
                      TanggalAntrian,
                      biaya,
                      komplain,
                    } = row;
                    const number = index + 1 + page * rowsPerPage;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="left">{number}</TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap sx={{ padding: '20px' }}>
                              {row.PerbaikanNew.kodePerbaikan}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{row.komplain}</TableCell>
                        <TableCell align="left">{row.User.nama}</TableCell>
                        <TableCell align="left">{row.PerbaikanNew.teknisi.nama}</TableCell>
                        <TableCell align="left">{row.PerbaikanNew.perangkat}</TableCell>
                        <TableCell align="left">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                            row.PerbaikanNew.biaya
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {moment(row.PerbaikanNew.createdAT).locale('id').format('DD MMMM YYYY')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3, textAlign: 'center' }}>
                        <Paper
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2,
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Data Teknisi Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pelanggan.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
