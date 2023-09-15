// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Data Perbaikan',
    path: '/dashboard/perbaikan',
    icon: icon('ic_lock'),
  },
  {
    title: 'Pelanggan',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Teknisi',
    path: '/dashboard/teknisi',
    icon: icon('ic_teknisi'),
  },
  {
    title: 'Laporan Keuangan',
    path: '/dashboard/laporan',
    icon: icon('ic_report'),
  },
  {
    title: 'Konfirmasi Pembayaran',
    path: '/dashboard/konfirmasi-pembayaran',
    icon: icon('ic_pembayaran'),
  },
  {
    title: 'Booking',
    path: '/dashboard/booking',
    icon: icon('ic_booking'),
  },
  {
    title: 'Komplain',
    path: '/dashboard/komplain',
    icon: icon('ic_complaint'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
