import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// @mui
import { faker } from '@faker-js/faker';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Button,
  CardActions,
  Box,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import moment from 'moment';
import BarChartComponent from './BarChart';
import Iconify from '../components/iconify';
// components
// sections
import { AppWidgetSummary, AppNewsUpdate, AppOrderTimeline } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [pelanggan, setPelanggan] = useState([]);
  const [teknisi, setTeknisi] = useState([]);
  const [perbaikan, setPerbaikan] = useState([]);
  const [antrian, setAntrian] = useState([]);
  const navigate = useNavigate();
  const [perbaikanData, setPerbaikanData] = useState([]);
  const [antrianData, setAntrianData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const dataCookie = Cookies.get('data');
  let nama = '';
  if (dataCookie) {
    const data = JSON.parse(dataCookie);
    nama = data.nama;
  }

  const handleClickCustomer = () => {
    navigate('/dashboard/user');
  };
  const handleClickTeknisi = () => {
    navigate('/dashboard/teknisi');
  };
  const handleClickPerbaikan = () => {
    navigate('/dashboard/perbaikan');
  };
  const handleClickAntrian = () => {
    navigate('/dashboard/booking');
  };
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('http://127.0.0.1:3000/all/perbaikan', {
          headers,
        });

        setPerbaikanData(response.data['Data Perbaikan']);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('http://127.0.0.1:3000/antrian/admin/all', {
          headers,
        });

        setAntrianData(response.data['Data Antrian']);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get('http://127.0.0.1:3000/perbaikan/chart/total', {
          headers,
        });

        setChartData(response.data['Chart Perbaikan']);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await fetch('http://127.0.0.1:3000/user', { headers });
        const response2 = await fetch('http://127.0.0.1:3000/teknisi', { headers });
        const response3 = await fetch('http://127.0.0.1:3000/all/perbaikan', { headers });
        const response4 = await fetch('http://127.0.0.1:3000/antrian/admin', { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const pelangganData = data['Data Pelanggan'];
        const data2 = await response2.json();
        const teknisiData = data2['Data Pelanggan'];
        const data3 = await response3.json();
        const perbaikanData = data3['Data Perbaikan'];
        const data4 = await response4.json();
        const antrianData = data4['Data Antrian'];
        setPelanggan(pelangganData);
        setTeknisi(teknisiData);
        setPerbaikan(perbaikanData);
        setAntrian(antrianData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const formattedChartData = {
    xAxis: [
      {
        scaleType: 'band',
        data: chartData.map((item) => {
          const date = new Date(item.month);
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        }),
      },
    ],
    series: [{ data: chartData.map((item) => item.totalBiaya) }],
  };
  const todayBookings = antrianData.slice(0, 5);
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back {nama}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Customer"
              total={pelanggan.length === 0 ? '0' : pelanggan.length.toString()}
              color="info"
              icon={'ant-design:contacts-outlined'}
              onClick={handleClickCustomer}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Teknisi"
              total={teknisi.length === 0 ? '0' : teknisi.length.toString()}
              color="primary"
              icon={'ant-design:user-outlined'}
              onClick={handleClickTeknisi}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Orders"
              total={perbaikan.length === 0 ? '0' : perbaikan.length.toString()}
              color="warning"
              icon={'ant-design:laptop-outlined'}
              onClick={handleClickPerbaikan}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={handleClickAntrian}
          >
            <AppWidgetSummary
              title="Booking Hari ini"
              total={antrian.length === 0 ? '0' : antrian.length.toString()}
              color="success"
              icon={'ant-design:calendar-twotone'}
            />
          </Grid>

          {/* <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              width={500}
              height={300}
            /> */}
          {/* <BarChart xAxis={formattedChartData.xAxis} series={formattedChartData.series} width={700} height={500} /> */}
          <BarChartComponent />
          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardHeader title="List Perbaikan" />
              <Divider />
              {perbaikanData.length === 0 ? (
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada perbaikan
                  </Typography>
                </CardContent>
              ) : (
                <>
                  {perbaikanData.slice(0, 5).map((perbaikan) => (
                    <Box key={perbaikan.id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box sx={{ flex: { xs: 'none', sm: 3 }, mb: { xs: 2, sm: 0 } }}>
                        <CardHeader
                          title={perbaikan.kendala}
                          subheader={`${perbaikan.perangkat} | kode perbaikan: ${perbaikan.kodePerbaikan} `}
                        />
                        <CardContent sx={{ paddingTop: { xs: 0, sm: '10px' } }}>
                          <Typography variant="body2" color="text.secondary">
                            <div
                              style={{
                                display: 'inline-block',
                                fontWeight: '700',
                                backgroundColor:
                                  perbaikan.status === 'Option 1'
                                    ? '#ff9999'
                                    : perbaikan.status === 'Dalam Proses Diagnosa'
                                    ? '#FFC107'
                                    : perbaikan.status === 'Selesai'
                                    ? '#4CAF50'
                                    : perbaikan.status === 'Sedang diperbaiki'
                                    ? '#2196F3'
                                    : '',
                                color:
                                  perbaikan.status === 'Option 1'
                                    ? '#ffffff'
                                    : perbaikan.status === 'Dalam Proses Diagnosa'
                                    ? '#000'
                                    : perbaikan.status === 'Selesai'
                                    ? '#ffffff'
                                    : perbaikan.status === 'Sedang diperbaiki'
                                    ? '#000000'
                                    : '',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                fontSize: '12px',
                                lineHeight: '1',
                                textAlign: 'center',
                              }}
                            >
                              {perbaikan.status}
                            </div>
                          </Typography>
                        </CardContent>
                      </Box>
                      <Box sx={{ flex: { xs: 1, sm: 1 } }}>
                        <CardContent sx={{ paddingTop: { xs: 0, sm: '35px' } }}>
                          <Typography variant="body2" color="text.secondary">
                            {moment(perbaikan.createdAt).startOf('hour').fromNow()}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Box>
                  ))}
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      onClick={handleClickPerbaikan}
                      size="small"
                      color="inherit"
                      endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
                    >
                      View All
                    </Button>
                  </CardActions>
                </>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardHeader title="List Booking lima hari kedepan" />
              <Divider />
              {todayBookings.length > 0 ? (
                <CardContent>
                  <Typography variant="body2">
                    {todayBookings.map((antrian, index) => (
                      <Box key={antrian.id} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {index + 1}.
                        </Typography>
                        <Box sx={{ flex: '1' }}>
                          <CardHeader
                            title={`Kode Booking: ${antrian.id}`}
                            subheader={`${antrian.User.nama} | ${antrian.User.email}`}
                          />
                          <CardContent sx={{ paddingTop: 0 }}>
                            <Typography variant="body2" color="text.secondary">
                              Tanggal Booking: {moment(antrian.TanggalAntrian).locale('id').format('DD MMMM YYYY')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <div
                                style={{
                                  display: 'inline-block',
                                  fontWeight: '700',
                                  backgroundColor:
                                    antrian.status === 'Pending'
                                      ? '#3498db'
                                      : antrian.status === 'Reschedule - Toko Tutup'
                                      ? '#e74c3c'
                                      : antrian.status === 'Reschedule - Fully Booked'
                                      ? '#e74c3c'
                                      : antrian.status === 'Approved'
                                      ? '#2ecc71'
                                      : antrian.status === 'Sedang diperbaiki'
                                      ? '#ffff99'
                                      : '',
                                  color:
                                    antrian.status === 'Pending'
                                      ? '#ffffff'
                                      : antrian.status === 'Reschedule - Toko Tutup'
                                      ? '#ffffff'
                                      : antrian.status === 'Reschedule - Fully Booked'
                                      ? '#ffffff'
                                      : antrian.status === 'Cancelled'
                                      ? '#ffffff'
                                      : antrian.status === 'Approved'
                                      ? '#ffffff'
                                      : antrian.status === 'Sedang diperbaiki'
                                      ? '#000000'
                                      : '',
                                  borderRadius: '4px',
                                  padding: '5px 10px',
                                  fontSize: '12px',
                                  lineHeight: '1',
                                  textAlign: 'center',
                                }}
                              >
                                {antrian.status}
                              </div>
                            </Typography>
                          </CardContent>
                        </Box>
                      </Box>
                    ))}
                  </Typography>
                </CardContent>
              ) : (
                <CardContent>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Tidak ada booking hari ini.
                  </Typography>
                </CardContent>
              )}
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleClickAntrian}
                  size="small"
                  color="inherit"
                  endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
                >
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
