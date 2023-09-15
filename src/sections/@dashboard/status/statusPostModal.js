import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Button,
  Modal,
  Typography,
  TextField,
  Box,
  Snackbar,
  AlertTitle,
  CircularProgress,
  Alert,
} from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';

export default function StatusPostModal({ idPerbaikan, updatePerbaikanData }) {
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!modalOpen) {
      setStatus('');
    }
  }, [modalOpen]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSnackBarClose = () => {
    setSuccess(false);
    setError(false);
    setErrorMessage('');
  };

  const handleAddStatus = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        'http://127.0.0.1:3000/status',
        {
          idPerbaikan,
          status,
        },
        { headers }
      );
      // console.log('Status added:', response.data);
      updatePerbaikanData();
      setIsLoading(true);
      setSuccess(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(false);
        handleCloseModal();
      }, 500);
    } catch (error) {
      console.error('Error adding status:', error);
      setError(true);
      setErrorMessage('Failed to add status.');
    }
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
      <Button variant="contained" onClick={handleOpenModal} startIcon={<Iconify icon="eva:plus-fill" />}>
        Tambah Status Baru
      </Button>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h3" gutterBottom>
            Tambah Status Baru
          </Typography>
          <TextField
            label="Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLoading}
          />
          <Button
            sx={buttonStyle}
            variant="contained"
            onClick={handleAddStatus}
            disabled={isLoading || status.trim() === ''}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ marginRight: '10px' }} />
            ) : (
              <Iconify icon="eva:plus-fill" sx={{ marginRight: '10px' }} />
            )}
            {isLoading ? 'Loading...' : 'Tambah Status'}
          </Button>
        </Box>
      </Modal>
      <Snackbar open={success} autoHideDuration={3000} onClose={handleSnackBarClose}>
        <Alert
          onClose={handleSnackBarClose}
          severity="success"
          variant="filled"
          sx={{ color: '#FFF', backgroundColor: '#4CAF50' }}
        >
          <AlertTitle>Success</AlertTitle>
          <strong>Berhasil Menambahkan Status</strong>
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={3000} onClose={handleSnackBarClose}>
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
    </>
  );
}
