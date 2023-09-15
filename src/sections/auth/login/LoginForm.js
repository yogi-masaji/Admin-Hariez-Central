import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
// @mui
import { Stack, IconButton, InputAdornment, TextField, Checkbox, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
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
        navigate('/dashboard', { replace: true });
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const handleClick = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setIsError(true);
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    axios
      .post('http://127.0.0.1:3000/login', {
        email,
        password,
      })
      .then((response) => {
        console.log(response.data);
        Cookies.set('token', response.data.token, {
          sameSite: 'strict',
          secure: true,
          expires: 1,
        });
        Cookies.set('data', JSON.stringify(response.data.admin), {
          sameSite: 'strict',
          secure: true,
          expires: 1,
        });
        setIsSuccess(true);
        setIsError(false);
        setErrorMessage('');
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
        setIsSuccess(false);
        setIsLoading(false);
        if (error.response?.data?.message === 'wrong email/password') {
          setErrorMessage(error.response.data.message);
        } else {
          console.log(error);
        }
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
        {isError && (
          <Alert severity="error" onClose={() => setIsError(false)}>
            {errorMessage}
          </Alert>
        )}
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
        {isLoading ? 'Logging In...' : 'Login'}
      </LoadingButton>
    </>
  );
}
