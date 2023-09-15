import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
// @mui
import {
  Button,
  Typography,
  Modal,
  Box,
  TextField,
  Alert,
  AlertTitle,
  Slide,
  Snackbar,
  MenuItem,
  InputAdornment,
  Select,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
// components
import Iconify from '../../../components/iconify/Iconify';

const useStyles = makeStyles((theme) => ({
  snackbar: {
    position: 'fixed',
    zIndex: theme.zIndex.tooltip + 1,
    [theme.breakpoints.up('md')]: {
      bottom: theme.spacing(2),
      transform: 'none',
      right: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(2),
      left: theme.spacing(2),
      transform: 'none',
    },
  },
}));

const ModalUpdate = ({ onUpdateModal, id }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kendala, setKendala] = useState('');
  const [biaya, setBiaya] = useState('');
  const [perangkat, setPerangkat] = useState('');
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [kodePerbaikan, setKodePerbaikan] = useState('');
  const classes = useStyles();

  const handleOpen = async () => {
    try {
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`http://127.0.0.1:3000/pembayaran/${id}`, { headers });
      const perbaikanData = response.data['Data Pembayaran'];
      setKendala(perbaikanData.User.nama);
      setBiaya(perbaikanData.PerbaikanNew.biaya);
      setPerangkat(perbaikanData.PerbaikanNew.perangkat);
      setStatus(perbaikanData.status);
      setKodePerbaikan(perbaikanData.PerbaikanNew.kodePerbaikan);
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackBarClose = () => {
    setSuccess(false);
  };

  const handleUpdatedataTeknisi = () => {
    setLoading(true);
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const updatePelanggan = {
      id,

      status,
    };
    onUpdateModal(id, updatePelanggan);
    axios
      .put(`http://127.0.0.1:3000/pembayaran/konfirmasi/${id}`, updatePelanggan, { headers })
      .then((response) => {
        const data = response.data;
        console.log(data);
        setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          handleClose();
        }, 500);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          const { message } = error.response.data;
          setOpen(true);
          setLoading(false);
          setErrorMessage(message);
          setError(true);
        } else {
          setErrorMessage('An error occurred');
          setError(true);
        }
      });
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    borderRadius: '20px',
    p: 4,
  };
  const buttonStyle = {
    width: '100%',
    height: '50px',
    maxWidth: 400,
    mt: 5,
  };
  return (
    <>
      <MenuItem onClick={handleOpen}>
        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
        Konfirmasi Pembayaran
      </MenuItem>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Konfirmasi Pembayaran
          </Typography>
          <Typography id="modal-modal-title" variant="p" component="h4">
            kode perbaikan : {kodePerbaikan}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Nama
          </Typography>
          <TextField
            value={kendala}
            onChange={(e) => setKendala(e.target.value)}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
            disabled
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Perangkat
          </Typography>
          <TextField
            value={perangkat}
            onChange={(e) => setPerangkat(e.target.value)}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
            disabled
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Biaya
          </Typography>
          <TextField
            value={biaya}
            onChange={(e) => setBiaya(e.target.value)}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp. </InputAdornment>,
            }}
            type="number"
            disabled
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Status
          </Typography>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
          >
            <MenuItem value={status}>{status}</MenuItem>
            <MenuItem value="Lunas">Lunas</MenuItem>
            <MenuItem value="Pembayaran Ditolak">Pembayaran Ditolak</MenuItem>
            <MenuItem value="Pembayaran Gagal">Pembayaran Gagal</MenuItem>
            {/* Add more options as needed */}
          </Select>
          <Button
            onClick={handleUpdatedataTeknisi}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="eva:plus-fill" />}
            sx={buttonStyle}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </Box>
      </Modal>
      {success && (
        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={handleSnackBarClose}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' }}
          className={classes.snackbar}
        >
          <Alert
            onClose={handleSnackBarClose}
            severity="success"
            variant="filled"
            sx={{ color: '#FFF', backgroundColor: '#4CAF50' }}
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Berhasil Mengedit Data</strong>
          </Alert>
        </Snackbar>
      )}

      {error && (
        <Snackbar
          open={error}
          autoHideDuration={2000}
          onClose={handleSnackBarClose}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' }}
          className={classes.snackbar}
        >
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            variant="filled"
            sx={{ color: '#FFF', backgroundColor: '#f44336' }}
          >
            <AlertTitle>Error</AlertTitle>
            <strong>{errorMessage}</strong>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default ModalUpdate;
