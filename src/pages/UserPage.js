import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Menu,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import ModalUpdate from '../sections/@dashboard/user/UserModalUpdate';
import ModalPostButton from '../sections/@dashboard/user/UserModalPost';
import ModalDeleteButton from '../sections/@dashboard/user/UserModalDelete';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'nama', label: 'Nama', alignRight: false },
  { id: 'nomor telepon', label: 'Nomor telepon', alignRight: false },
  { id: '#', label: 'Action', alignCenter: false },
  { id: 'email', label: 'Email', alignRight: false },
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
    return filter(array, (_user) => _user.nama.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return array;
}

export default function UserPage() {
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
    const fetchPelanggan = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await fetch('http://127.0.0.1:3000/user', { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const pelangganData = data['Data Pelanggan'];

        setPelanggan(pelangganData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPelanggan();
  }, []);

  const DeletePelanggan = (id) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .delete(`http://127.0.0.1:3000/user/${id}`, { headers })
      .then((res) => {
        setPelanggan((prevPelanggan) => prevPelanggan.filter((pelanggan) => pelanggan.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const UpdatePelanggan = (id, updatedData) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .put(`http://127.0.0.1:3000/pelanggan/${id}`, updatedData, { headers })
      .then((res) => {
        setPelanggan((prevPelanggan) =>
          prevPelanggan.map((pelanggan) => (pelanggan.id === id ? { ...pelanggan, ...updatedData } : pelanggan))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePostModal = (data) => {
    setPelanggan((prevPelanggan) => [...prevPelanggan, data]);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

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

  return (
    <>
      <Helmet>
        <title> Data Pelanggan</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Data Pelanggan
          </Typography>
          {/* <Button  variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
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
                    const { id, nama, email, nomorTelepon } = row;
                    const number = index + 1 + page * rowsPerPage;

                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="left">{number}</TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap sx={{ padding: '20px' }}>
                              {nama}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{nomorTelepon}</TableCell>

                        <TableCell align="left">
                          <Button
                            id={`basic-button-${id}`}
                            aria-controls={`basic-menu-${id}`}
                            aria-haspopup="true"
                            aria-expanded={open && anchorEl && anchorEl.id === `basic-button-${id}`}
                            onClick={(event) => handleClick(event, `basic-button-${id}`)}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </Button>
                          <Menu
                            id={`basic-menu-${id}`}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && anchorEl.id === `basic-button-${id}`}
                            onClose={handleClose}
                            MenuListProps={{
                              'aria-labelledby': `basic-button-${id}`,
                            }}
                          >
                            <ModalUpdate id={id} onUpdateModal={UpdatePelanggan} />

                            <ModalDeleteButton onDelete={() => DeletePelanggan(id)} />
                          </Menu>
                        </TableCell>
                        <TableCell align="left">{email}</TableCell>

                        {/* <TableCell>
                        <ModalUpdate id={id} onUpdateModal={UpdatePelanggan} />
                        </TableCell>
                        <TableCell align="left">
                          <ModalDeleteButton onDelete={() => DeletePelanggan(id)} />
                        </TableCell> */}
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
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Pelanggan Not found
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
