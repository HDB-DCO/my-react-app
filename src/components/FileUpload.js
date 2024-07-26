import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FileUpload = ({ onDrop, isUploading, uploadedFileName }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
    });

    return (
        <Box
            {...getRootProps()}
            sx={{
                border: '2px dashed grey',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                minHeight: '150px', // Set a fixed height for the box
            }}
        >
            <input {...getInputProps()} />
            {!isUploading && !uploadedFileName && (
                <Box>
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'grey' }} />
                    <Typography>Browse Files</Typography>
                    <Typography variant="body2" color="textSecondary">Drag and drop files here</Typography>
                </Box>
            )}
            {isUploading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {uploadedFileName && !isUploading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                >
                    <CheckCircleIcon color="success" />
                    <Typography variant="body1" ml={1}>
                        {uploadedFileName}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default FileUpload;
