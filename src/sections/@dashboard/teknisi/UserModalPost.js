import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// @mui
import { Button, Typography, Modal, Box, TextField, Alert, AlertTitle, Slide, Snackbar } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// components
import Iconify from '../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

const ModalPostButton = ({ onPostModal }) => {
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

  

  const handleOpen = () => {
    setNama('');
    setNomorTelepon('');
    setEmail('');
    setOpen(true);
  };
  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setEmailError('');
    }
  };
  const handleSnackBarClose = () => {
    setSuccess(false);
    setError(false);
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

  const handlePostDataPelanggan = () => {
    setLoading(true);
    const token = Cookies.get('token');
    const newPelanggan = {
      nama,
      nomorTelepon,
      email,
    };

    axios
      .post('http://127.0.0.1:3000/teknisi', newPelanggan, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (onPostModal) {
          onPostModal(data);
        }
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
      <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
        Teknisi Baru
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Masukkan data teknisi
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
            onClick={handlePostDataPelanggan}
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
        >
          <Alert
            onClose={handleSnackBarClose}
            severity="success"
            variant="filled"
            sx={{ color: '#FFF', backgroundColor: '#4CAF50' }}
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Berhasil Menambahkan Data</strong>
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

export default ModalPostButton;
