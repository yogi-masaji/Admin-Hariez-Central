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
import { set } from 'lodash';
import Iconify from '../../../components/iconify/Iconify';

export default function StatusUpdateModal({ idPerbaikan, onUpdate, updatePerbaikanData, statusId, handlePutStatus }) {
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

  const handleOpenModal = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`http://127.0.0.1:3000/status/${statusId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataStatus = response.data;
      // console.log(dataStatus);
      setStatus(dataStatus.status);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSnackBarClose = () => {
    setSuccess(false);
    setError(false);
    setErrorMessage('');
  };

  const handleUpdateStatus = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const updateStatus = {
        status,
      };
      await axios.put(`http://127.0.0.1:3000/status/${statusId}`, updateStatus, { headers });

      handlePutStatus();
      // updatePerbaikanData();
      setIsLoading(true);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsLoading(false);
        handleCloseModal();
      }, 1000);
    } catch (error) {
      console.error('Error updating status:', error);
      setIsLoading(false);
      setError(true);
      setErrorMessage('Failed to update status.');
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
      <Button variant="contained" onClick={handleOpenModal} startIcon={<Iconify icon="eva:edit-fill" />}>
        Edit
      </Button>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h3" gutterBottom>
            Edit Status
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
            onClick={handleUpdateStatus}
            disabled={isLoading || status.trim() === ''}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ marginRight: '10px' }} />
            ) : (
              <Iconify icon="eva:plus-fill" sx={{ marginRight: '10px' }} />
            )}
            {isLoading ? 'Loading...' : 'Edit Status'}
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
          <strong>Berhasil Mengedit Status</strong>
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
