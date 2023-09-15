import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from '@mui/material';
import { styled } from '@mui/system';
import { BuildCircle, CheckCircle } from '@mui/icons-material';
import Iconify from '../components/iconify';

export default function PerbaikanDetailPage() {
  const { id } = useParams();
  const [perbaikanData, setPerbaikanData] = useState(null);

  useEffect(() => {
    const fetchPerbaikanData = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`http://127.0.0.1:3000/perbaikan/${id}`, { headers });
        console.log(response.data['Data Perbaikan']);
        setPerbaikanData(response.data['Data Perbaikan']);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerbaikanData();
  }, [id]);

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
      </Stack>
      <Box sx={{ p: 4, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2 }}>
        {perbaikanData?.Statuses && perbaikanData.Statuses.length > 0 ? (
          <Stepper orientation="vertical">
            {perbaikanData.Statuses.reverse().map(
              (
                status,
                index // Reverse the array
              ) => (
                <Step
                  key={index}
                  active={index === 0} // Set the last step as active
                  completed={index !== 0} // Set all other steps as completed
                >
                  <StepLabel
                    classes={{
                      completed: 'completed',
                      active: 'active',
                    }}
                    icon={
                      index === 0 ? (
                        <BuildCircle />
                      ) : (
                        <CheckCircle
                          style={{
                            color: '#00FF00',
                          }}
                        />
                      )
                    }
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      className={index === perbaikanData.Statuses.length - 1 ? 'active' : 'completed'} // Apply active class to the last step and completed class to the rest
                    >
                      {status.status}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      className={index === perbaikanData.Statuses.length - 1 ? 'active' : 'completed'} // Apply active class to the last step and completed class to the rest
                    >
                      {moment(status.createdAt).locale('id').format('DD MMMM YYYY')}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      className={index === perbaikanData.Statuses.length - 1 ? 'active' : 'completed'} // Apply active class to the last step and completed class to the rest
                    >
                      {moment(status.createdAt).locale('id').format('HH:mm')}
                    </Typography>
                  </StepLabel>
                </Step>
              )
            )}
          </Stepper>
        ) : (
          <>
            <Typography variant="body1" component="p" mb={3}>
              Belum ada status.
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to={`/dashboard/status-perbaikan/${id}`}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tambahkan Status
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}
