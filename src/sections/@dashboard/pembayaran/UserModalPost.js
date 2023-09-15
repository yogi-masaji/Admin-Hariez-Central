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
  Select,
  MenuItem,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// components
import Iconify from '../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

const ModalPostButton = ({ onPostModal }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [perangkat, setPerangkat] = useState('');
  const [kodePerbaikan, setKodePerbaikan] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nomorTeleponError, setNomorTeleponError] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [kendala, setKendala] = useState('');
  const [biaya, setBiaya] = useState('');
  const [idTeknisi, setIdTeknisi] = useState('');
  const [teknisiData, setTeknisiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get('http://127.0.0.1:3000/teknisi', { headers });
        const { data } = response;
        const teknisiData = data['Data Pelanggan'];
        setTeknisiData(teknisiData);
        console.log(teknisiData);
        setIdTeknisi(teknisiData[0]?.id || ''); // Store the first teknisi ID or an empty string if teknisiData is empty
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleOpen = () => {
    setKendala('');
    setPerangkat('');
    setBiaya('');
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

  const handleNomorTeleponChange = (e) => {
    const { value } = e.target;
    const nomorTeleponRegex = /^[1-9][0-9]*$/;

    if (value === '' || (nomorTeleponRegex.test(value) && !/[^\d.,;]/.test(value))) {
      setBiaya(value);
      setNomorTeleponError('');
    } else {
      setNomorTeleponError('Nomor Telepon harus berupa angka');
    }
  };

  const handlePostDataPelanggan = () => {
    setLoading(true);
    const token = Cookies.get('token');
    if (kodePerbaikan.length !== 8) {
      setError(true);
      setErrorMessage('Kode Perbaikan must be 8 characters long');
      return;
    }

    const newPelanggan = {
      idTeknisi,
      biaya,
      kendala,
      perangkat,
      kodePerbaikan,
    };

    axios
      .post('http://127.0.0.1:3000/perbaikan/new', newPelanggan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
    maxHeight: isMobile ? '80vh' : '100%',
    overflowY: isMobile ? 'scroll' : 'hidden',
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
        Data Perbaikan Baru
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Masukkan data perbaikan
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Kode Perbaikan
          </Typography>
          <TextField
            value={kodePerbaikan}
            onChange={(e) => setKodePerbaikan(e.target.value)}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
            inputProps={{
              maxLength: 8,
            }}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Kendala
          </Typography>
          <TextField
            value={kendala}
            onChange={(e) => setKendala(e.target.value)}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
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
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Teknisi
          </Typography>
          <Select
            value={idTeknisi}
            onChange={(e) => setIdTeknisi(e.target.value)}
            sx={{ mt: 1, width: '100%' }}
            displayEmpty
          >
            {teknisiData.length > 0 ? (
              teknisiData.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.nama}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No data available</MenuItem>
            )}
          </Select>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Biaya
          </Typography>
          <TextField
            value={biaya}
            onChange={handleNomorTeleponChange}
            id="outlined-basic"
            variant="outlined"
            sx={{ mt: 1, width: '100%' }}
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp. </InputAdornment>,
            }}
          />
          <Button
            onClick={handlePostDataPelanggan}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="eva:plus-fill" />}
            sx={buttonStyle}
            disabled={
              !kodePerbaikan || !kendala || !perangkat || !idTeknisi || !biaya || loading || kodePerbaikan.length !== 8
            }
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
