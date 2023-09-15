import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Container,
  Stack,
  Typography,
  Card,
  Box,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import account from '../_mock/account';

export default function ProfilePage() {
  const [profile, setProfile] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [PasswordErrorMessage, setPasswordErrorMessage] = useState('');
  const [PasswordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get('http://127.0.0.1:3000/admin/detail', { headers });
      console.log(response.data);
      setProfile(response.data);
      setNama(response.data.nama);
      setEmail(response.data.email);
      setNomorTelepon(response.data.nomorTelepon);
    };

    fetchProfileData();
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNamaChange = (event) => {
    const value = event.target.value;
    setNama(value);
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handleNomorTeleponChange = (event) => {
    const value = event.target.value;
    setNomorTelepon(value);
  };

  const updateProfile = () => {
    setIsLoading(true); // Set loading state to true
    if (nama.trim() === '' || email.trim() === '' || nomorTelepon.trim() === '') {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      setIsLoading(false);
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
      return;
    }

    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const updatedProfile = {
      ...profile,
      nama,
      email,
      nomorTelepon,
    };

    axios
      .put(`http://127.0.0.1:3000/admin/update/${profile.id}`, updatedProfile, { headers })
      .then((response) => {
        console.log(response.data);
        setProfile(updatedProfile);
        setSuccessMessage('Profile updated successfully.');
        setTimeout(() => {
          setErrorMessage('');
          setSuccessMessage('');
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage('Failed to update profile.');
        setSuccessMessage('');
      });
  };

  const updatePassword = () => {
    setIsLoading(true); // Set loading state to true

    if (password.trim() === '' || confirmPassword.trim() === '') {
      setPasswordErrorMessage('Password and Confirm Password fields are required.');
      setPasswordSuccessMessage('');
      setIsLoading(false);
      setTimeout(() => {
        setPasswordErrorMessage('');
      }, 1000);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordErrorMessage('Password and Confirm Password fields must match.');
      setPasswordSuccessMessage('');
      setIsLoading(false);
      setTimeout(() => {
        setPasswordErrorMessage('');
      }, 1000);
      return;
    }
    if (password.length < 6) {
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      setPasswordSuccessMessage('');
      setIsLoading(false);
      setTimeout(() => {
        setPasswordErrorMessage('');
      }, 1000);
      return;
    }

    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const updatedPassword = {
      password,
    };

    axios
      .put(`http://127.0.0.1:3000/admin/update/password/${profile.id}`, updatedPassword, { headers })
      .then((response) => {
        console.log(response.data);
        setPasswordSuccessMessage('Password updated successfully.');
        setTimeout(() => {
          setPasswordErrorMessage('');
          setPasswordSuccessMessage('');
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setPasswordErrorMessage('Failed to update password.');
        setPasswordSuccessMessage('');
        setIsLoading(false);
      });
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
      </Stack>

      <Card sx={{ mb: 5 }}>
        <Box sx={{ p: 5, display: 'flex' }}>
          <Avatar src={account.photoURL} alt="photoURL" sx={{ mr: 2 }} />
          <Stack spacing={1}>
            <Typography fontWeight={700}>{profile.nama}</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.nomorTelepon}
            </Typography>
          </Stack>
        </Box>
      </Card>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>
      </Stack>
      <Card sx={{ mb: 5 }}>
        <Box sx={{ p: 5, display: 'flex' }}>
          <Stack spacing={1}>
            <Typography fontWeight={700}>Nama</Typography>
            <TextField id="nama" variant="outlined" value={nama} onChange={handleNamaChange} />
            <Typography fontWeight={700}>Email</Typography>
            <TextField id="email" variant="outlined" value={email} onChange={handleEmailChange} />
            <Typography fontWeight={700}>Nomor Telepon</Typography>
            <TextField
              id="nomorTelepon"
              variant="outlined"
              value={nomorTelepon}
              onChange={handleNomorTeleponChange}
              type="number"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              style={{ backgroundColor: 'blue', marginTop: '20px' }}
              onClick={updateProfile}
              disabled={isLoading} // Disable the button while loading
            >
              Simpan
            </Button>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
          </Stack>
        </Box>
      </Card>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Change Password
        </Typography>
      </Stack>
      <Card sx={{ mb: 5 }}>
        <Box sx={{ p: 5, display: 'flex' }}>
          <Stack spacing={1}>
            <Typography fontWeight={700}>Password</Typography>
            <TextField
              id="password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={toggleShowPassword}>{showPassword ? <VisibilityOff /> : <Visibility />}</Button>
                  </InputAdornment>
                ),
              }}
            />
            <Typography fontWeight={700}>Confirm Password</Typography>
            <TextField
              id="confirmPassword"
              variant="outlined"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={toggleShowPassword}>{showPassword ? <VisibilityOff /> : <Visibility />}</Button>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              style={{ backgroundColor: 'blue', marginTop: '20px' }}
              onClick={updatePassword}
              disabled={isLoading} // Disable the button while loading
            >
              Change Password
            </Button>
            {PasswordErrorMessage && <Alert severity="error">{PasswordErrorMessage}</Alert>}
            {PasswordSuccessMessage && <Alert severity="success">{PasswordSuccessMessage}</Alert>}
          </Stack>
        </Box>
      </Card>
    </Container>
  );
}
