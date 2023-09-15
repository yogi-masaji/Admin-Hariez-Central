import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Container, Typography, Grid, Card } from '@mui/material';
import moment from 'moment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Label,
  Cell,
} from 'recharts';

const BarChartComponent = () => {
  const [chartData, setChartData] = useState([]);
  const [pieChart, setPieChart] = useState([]);

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

        const response = await axios.get('http://127.0.0.1:3000/antrian/chart/pelayanan', {
          headers,
        });

        setPieChart(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const formattedChartData = chartData.map((item) => ({
    month: moment(item.month).format('MMMM YYYY'),
    total: item.totalBiaya,
  }));
  const colorMap = {
    1: '#8884d8', // Laptop Repair
    2: '#82ca9d', // PC Repair
    3: '#ffc658', // Device Maintenance
  };
  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', height: '100%' }}
          >
            <Typography variant="h4" sx={{ mb: 5 }}>
              Grafik pendapatan 2023
            </Typography>

            {/* Your other components here */}

            {/* BarChart */}
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={formattedChartData} margin={{ left: 50, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', height: '100%' }}
          >
            <Typography variant="h4" sx={{ mb: 5 }}>
              Layanan Perbaikan
            </Typography>

            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={pieChart} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {pieChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorMap[entry.idJenis]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              {pieChart.map((entry) => (
                <div key={entry.idJenis} style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: colorMap[entry.idJenis],
                      marginRight: '8px',
                    }}
                  />
                  <Typography variant="body1">{entry.jenis}</Typography>
                </div>
              ))}
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BarChartComponent;
