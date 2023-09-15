import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Checkbox, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

export default function RegisterForm() {
  const [nama, setNama] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const handleClick = (e) => {
    e.preventDefault();
    if (!email || !password || !nama || !nomorTelepon) {
      setIsError(true);
      setErrorMessage('Please enter all the fields.');
      return;
    }

    if (password.length < 8) {
      setIsError(true);
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setIsError(true);
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    axios
      .post('http://127.0.0.1:3000/signup', {
        email,
        password,
        nama,
        nomorTelepon,
      })
      .then((response) => {
        console.log(response.data);
        setIsSuccess(true);
        setIsError(false);
        setErrorMessage('');
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };
  const handleNamaChange = (e) => {
    setNama(e.target.value);
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };
  const handleNomorTeleponChange = (e) => {
    setNomorTelepon(e.target.value);
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (isError) {
      setIsError(false);
      setErrorMessage('');
    }
  };

  return (
    <>
      <Stack spacing={3} sx={{ my: 5 }}>
        <TextField name="nama" label="Nama" value={nama} onChange={handleNamaChange} />
        <TextField
          name="nomorTelepon"
          label="Nomor Telepon"
          type="number"
          value={nomorTelepon}
          onChange={handleNomorTeleponChange}
        />
        <TextField name="email" label="Email address" value={email} onChange={handleEmailChange} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body2">
          Already have an account? <Link to="/login">Sign In</Link>
        </Typography>
        {isError && (
          <Alert severity="error" onClose={() => setIsError(false)}>
            {errorMessage}
          </Alert>
        )}
        {isSuccess && <Alert severity="success">Registration successful! Redirecting to the login page...</Alert>}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleClick}
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </LoadingButton>
    </>
  );
}
