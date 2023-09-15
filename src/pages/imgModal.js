import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const ImageModal = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bukti Pembayaran</DialogTitle>
      <DialogContent>
        <img src={imageUrl} alt="Large" style={{ width: '100%', height: 'auto' }} />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
