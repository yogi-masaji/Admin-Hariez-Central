import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import {
  Container,
  Box,
  Typography,
  Stack,
  Grid,
  Item,
  Stepper,
  Step,
  StepConnector,
  StepIcon,
  StepLabel,
  Button,
  Modal,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { styled } from '@mui/system';
import Iconify from '../components/iconify';
import StatusPostModal from '../sections/@dashboard/status/statusPostModal';
import StatusDeleteModal from '../sections/@dashboard/status/statusDeleteModal';
import StatusUpdateModal from '../sections/@dashboard/status/statusUpdateModal';

export default function StatusPerbaikanPage() {
  const [perbaikanData, setPerbaikanData] = useState(null);
  const { id } = useParams();
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const fetchPerbaikanData = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`http://127.0.0.1:3000/perbaikan/${id}`, { headers });
        // console.log(response.data['Data Perbaikan']);
        setPerbaikanData(response.data['Data Perbaikan']);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerbaikanData();
  }, [id]);
  const updatePerbaikanData = async () => {
    try {
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`http://127.0.0.1:3000/perbaikan/${id}`, { headers });
      // console.log(response.data['Data Perbaikan']);
      setPerbaikanData(response.data['Data Perbaikan']);
    } catch (error) {
      console.error(error);
    }
  };

  const updateModal = (id) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .put(`http://127.0.0.1:3000/status/${id}`, {}, { headers })
      .then((res) => {
        // console.log(res);
        // console.log(res.data);
        setTimeout(() => {
          setSuccess(true);
        }, 500);
        updatePerbaikanData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeleteStatus = (id) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .delete(`http://127.0.0.1:3000/status/${id}`, { headers })
      .then((res) => {
        // console.log(res);
        // console.log(res.data);
        setTimeout(() => {
          setSuccess(true);
        }, 500);
        updatePerbaikanData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeleteButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  }));
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Detail Perbaikan
        </Typography>
      </Stack>
      <Box sx={{ p: 4, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2, overflowX: 'auto' }}>
        {perbaikanData ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Kode Perbaikan:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {perbaikanData.kodePerbaikan}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Pelanggan:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {perbaikanData.Antrian?.User?.nama}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Kendala:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {perbaikanData.kendala}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Perangkat:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {perbaikanData.perangkat}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Teknisi:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {perbaikanData.teknisi?.nama}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Tanggal Perbaikan:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {moment(perbaikanData.Antrian?.TanggalAntrian).locale('id').format('DD MMMM YYYY')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Status:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {perbaikanData.status}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="body1" component="h3" gutterBottom>
                  Biaya:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(perbaikanData.biaya)}
                </Typography>
              </Grid>
            </Grid>
          </div>
        ) : (
          <Typography>Loading perbaikan data...</Typography>
        )}
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mt={5} mb={5}>
        <Typography variant="h4" gutterBottom>
          Status Perbaikan
        </Typography>
        <StatusPostModal idPerbaikan={id} updatePerbaikanData={updatePerbaikanData} />
      </Stack>
      <Box sx={{ p: 4, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2 }}>
        <Stepper orientation="vertical" connector={<StepConnector sx={{ pr: { sm: 5 } }} />}>
          {perbaikanData?.Statuses?.map((status, index) => (
            <Step key={index} active completed={index < perbaikanData.Statuses.length}>
              <StepLabel>
                <Box
                  sx={{
                    display: 'flex',
                    p: 3,
                    boxShadow: 1,
                    borderRadius: 2,
                    maxWidth: {
                      xs: '100%',
                      sm: '50%',
                    }, // Adjust the maxWidth as per your requirement
                    backgroundColor: '#EDEFF2',
                  }}
                >
                  <Grid
                    container
                    sx={{
                      display: 'flex',
                    }}
                    spacing={{ xs: 3, sm: 2 }}
                  >
                    <Grid item>
                      <Typography variant="h6" component="h3">
                        {status.status}
                      </Typography>
                      <Typography variant="body1" component="p">
                        {moment(status.createdAt).locale('id').format('DD MMMM YYYY')}
                      </Typography>
                      <Typography variant="body1" component="p">
                        {moment(status.createdAt).locale('id').format('HH:mm')}
                      </Typography>
                    </Grid>
                    <Grid container spacing={2} item>
                      <Grid item>
                        <StatusUpdateModal statusId={status.id} handlePutStatus={() => updateModal(status.id)} />
                      </Grid>
                      <Grid item>
                        <StatusDeleteModal onDelete={() => DeleteStatus(status.id)} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
  );
}
