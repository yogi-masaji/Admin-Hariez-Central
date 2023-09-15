import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
// @mui
import { Button, Typography, Modal, Box, TextField, Alert, AlertTitle, Slide, Snackbar, MenuItem } from '@mui/material';
import {makeStyles} from '@mui/styles';
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
  const [nama, setNama] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nomorTeleponError, setNomorTeleponError] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const classes = useStyles();

  const handleOpen = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`http://127.0.0.1:3000/teknisi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const dataTeknisi = response.data.dataTeknisi;

      setNama(dataTeknisi.nama);
      setNomorTelepon(dataTeknisi.nomorTelepon);
      setEmail(dataTeknisi.email);
      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const validateNomorTelepon = (nomorTelepon) => {
    const nomorTeleponRegex = /^[0-9]+$/;
    return nomorTeleponRegex.test(nomorTelepon);
  };

  const handleNomorTeleponChange = (e) => {
    const { value } = e.target;
    if (validateNomorTelepon(value) || value === '') {
      setNomorTelepon(value);
      setNomorTeleponError('');
    } else {
      setNomorTeleponError('Nomor Telepon harus berupa angka');
    }
  };

  const handleSnackBarClose = () => {
    setSuccess(false);
  };

  const handleUpdatedataTeknisi = () => {
    setLoading(true);
    const token = Cookies.get('token');
    const updatePelanggan = {
      id,
      nama,
      nomorTelepon,
      email,
    };
    onUpdateModal(id, updatePelanggan);
    axios
      .put(`http://127.0.0.1:3000/teknisi/${id}`, updatePelanggan, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
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
          setEmailError(message);
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
        Edit
      </MenuItem>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit data teknisi : {nama}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Nama
          </Typography>
          <TextField
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Nomor Telepon
          </Typography>
          <TextField
            value={nomorTelepon}
            onChange={handleNomorTeleponChange}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Email
          </Typography>
          <TextField
            error={!!emailError && email.length > 0}
            value={email}
            helperText={email.trim() !== '' ? emailError : ''}
            onChange={(e) => {
              const { value } = e.target;
              setEmail(value);
              if (value.trim() === '') {
                setEmailError('');
              }
            }}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
          />
          <Button
            onClick={handleUpdatedataTeknisi}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="eva:plus-fill" />}
            sx={buttonStyle}
            disabled={!nama || !nomorTelepon || !email || loading}
          >
            {loading && !emailError ? 'Menyimpan...' : 'Simpan'}
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
