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
  Slide,
  Divider,
} from '@mui/material';
import { styled, makeStyles } from '@mui/styles';
import { red } from '@mui/material/colors';
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

export default function StatusDeleteModal({ id, updatePerbaikanData, onDelete }) {
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(modalOpen);
  const [showAlert, setShowAlert] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (!modalOpen) {
      setStatus('');
    }
  }, [modalOpen]);

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setOpen(false);
  };

  const handleSnackBarClose = () => {
    setSuccess(false);
    setError(false);
    setErrorMessage('');
  };

  const handleDeleteOpen = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        const deletionResult = onDelete(id);
        console.log('Deletion Result:', deletionResult);

        if (deletionResult) {
          setSuccess(true);
        } else {
          setError(true);
        }

        setLoading(false);
        setOpen(false);
        setShowAlert(true);
        resolve();
      }, 800);
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

  const DeleteButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  }));

  return (
    <>
      <DeleteButton onClick={handleDeleteOpen}>
        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
        Delete
      </DeleteButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              color: 'red',
            }}
          >
            <Iconify icon={'eva:alert-circle-outline'} sx={{ mr: 2 }} />
            Konfirmasi
          </Typography>
          <Divider sx={{ my: 2, borderColor: '#000', borderWidth: 1 }} />
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
            Apakah Anda yakin ingin menghapus data ini?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5 }}>
            <Button variant="outlined" onClick={handleClose}>
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              color="error"
              sx={{ marginLeft: '8px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ marginRight: '4px' }} />
                  Menghapus
                </>
              ) : (
                'Hapus'
              )}
            </Button>
          </div>
        </Box>
      </Modal>

      {success && (
        <Snackbar
          open={showAlert}
          autoHideDuration={2000}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' }}
          className={classes.snackbar}
        >
          <Alert severity="success" variant="filled" sx={{ color: '#FFF', backgroundColor: '#4CAF50' }}>
            <AlertTitle>Success</AlertTitle>
            <strong>Berhasil Menghapus Data</strong>
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar
          open={showAlert}
          autoHideDuration={2000}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' }}
          className={classes.snackbar}
          onClose={handleSnackBarClose}
        >
          <Alert severity="error" variant="filled" sx={{ color: '#FFF', backgroundColor: '#f44336' }}>
            <AlertTitle>Error</AlertTitle>
            <strong>Gagal Menghapus Data</strong>
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
