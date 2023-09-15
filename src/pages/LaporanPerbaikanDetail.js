import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import PrintIcon from '@mui/icons-material/Print';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import './print.css';

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Stack,
  Divider,
} from '@mui/material';

export default function LaporanDetail() {
  const { key } = useParams();
  const [laporanData, setLaporanData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(`http://127.0.0.1:3000/perbaikan/laporan/${key}`, { headers });
        setLaporanData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [key]);

  return (
    <>
      <Helmet>
        <title>Laporan Perbaikan</title>
      </Helmet>
      <Container className="printable-component">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Laporan Keuangan {laporanData?.bulan} {laporanData?.tahun}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            style={{ backgroundColor: 'blue' }}
            // onClick={handlePrint}
            component={Link} // Use Link component from react-router-dom
            to={`/dashboard/laporan/${key}`}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  Details
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Deskripsi</TableCell>
                <TableCell align="right">Kode Perbaikan</TableCell>
                <TableCell align="right">Tanggal Perbaikan</TableCell>
                <TableCell align="right">Harga</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {laporanData?.['Data Perbaikan']?.map((data) => (
                <TableRow key={data.id}>
                  <TableCell>
                    <Typography variant="h6" component="span">
                      {data.perangkat}
                    </Typography>
                    <br />
                    <Typography variant="subtitle2" component="span" fontWeight="bold">
                      {data.kendala}
                    </Typography>
                    <br />
                    <Typography variant="subtitle2" component="span">
                      {data.Antrian.User.nama}
                    </Typography>
                    <br />
                  </TableCell>
                  <TableCell align="right">{data.kodePerbaikan}</TableCell>
                  <TableCell align="right">{moment(data.createdAt).locale('id').format('DD MMMM YYYY')}</TableCell>
                  <TableCell align="right">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.biaya)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableBody>
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell colSpan={1}>
                  <Typography variant="h6" component="span">
                    Total
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" component="span">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                      laporanData?.TotalBiaya
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
