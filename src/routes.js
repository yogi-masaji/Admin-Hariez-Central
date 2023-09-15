import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import TeknisiPage from './pages/TeknisiPage';
import PerbaikanPage from './pages/PerbaikanPage';
import PerbaikanDetailPage from './pages/PerbaikanDetailPage';
import StatusPerbaikanPage from './pages/StatusPerbaikanPage';
import BookingPage from './pages/BookingPage';
import KomplainPage from './pages/KomplainPage';
import LaporanPerbaikan from './pages/LaporanPerbaikan';
import LaporanPerbaikanDetail from './pages/LaporanPerbaikanDetail';
import ProfilePage from './pages/ProfilePage';
import KonfirmasiPembayaran from './pages/KonfirmasiPembayaran';
// ----------------------------------------------------------------------

function PrivateRoute({ element, children, ...rest }) {
  const location = useLocation();

  const isLoggedIn = !!Cookies.get('token');

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <DashboardLayout>{element || children}</DashboardLayout>;
}

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <PrivateRoute />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'teknisi', element: <TeknisiPage /> },
        { path: 'perbaikan', element: <PerbaikanPage /> },
        { path: 'laporan', element: <LaporanPerbaikan /> },
        { path: 'laporan/:key', element: <LaporanPerbaikanDetail /> },
        { path: 'perbaikan/detail/:id', element: <PerbaikanDetailPage /> },
        { path: 'status-perbaikan/:id', element: <StatusPerbaikanPage /> },
        { path: 'booking', element: <BookingPage /> },
        { path: 'konfirmasi-pembayaran', element: <KonfirmasiPembayaran /> },
        { path: 'komplain', element: <KomplainPage /> },
        { path: 'profile', element: <ProfilePage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <RegisterPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
