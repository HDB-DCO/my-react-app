import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import close icon

const FileModal = ({ open, onClose, fileUrl, fileType }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        File Viewer
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {fileType === 'image' && <img src={fileUrl} alt="Preview" style={{ width: '100%' }} />}
        {fileType === 'pdf' && (
          <embed
            src={fileUrl}
            type="application/pdf"
            style={{ width: '100%', height: '500px' }}
          />
        )}
        {/* Add more file types as needed */}
      </DialogContent>
    </Dialog>
  );
};

export default FileModal;
