import React, { useState, useEffect } from 'react';
import axios from 'axios';

// @mui
import { Button, Typography, Modal, Box, Alert, AlertTitle, Slide, Snackbar, MenuItem, Divider } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
// components
import Iconify from '../../../components/iconify/Iconify';
// ----------------------------------------------------------------------

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

const ModalDeleteButton = ({ onDelete, id }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(false);
  const classes = useStyles();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackBarClose = () => {
    setSuccess(false);
    setShowAlert(false);
  };

  const handleDelete = async () => {
    setLoading(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        if (onDelete(id)) {
          setSuccess(true);
        } else {
          setError(true);
        }

        setLoading(false);
        setOpen(false);

        resolve();
      }, 500);
    });

    setTimeout(() => {
      setShowAlert(true);
    }, 500);
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

  return (
    <>
      <MenuItem onClick={handleOpen} sx={{ color: 'error.main' }}>
        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
        Delete
      </MenuItem>
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
};

export default ModalDeleteButton;
