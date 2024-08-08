import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import { pdfjs } from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import moment from 'moment';
import { getDocument } from 'pdfjs-dist';
import { getIsAuthenticated, getStaffId, getToken, getRoles } from '../js/stateUtils';
import { fetchClient } from "../js/fetchClient";
import '../css/AbsenceRequestCopy.css';

const leaveTypes = [
  { value: "annual", label: "Annual Leave" },
  { value: "mc", label: "Medical Leave" },
];

const AbsenceRequestCopy = () => {
  const [employeeId, setEmployeeId] = useState(getStaffId());
  const [leaveType, setLeaveType] = useState("annual");
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("2024-06-19");
  const [appliedEndDate, setAppliedEndDate] = useState("2024-06-19");
  const [ocrResult, setOcrResult] = useState("");
  const [dates, setDates] = useState({});
  const [isValidDates, setIsValidDates] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [metadataId, setMetadataId] = useState(""); // Store metadataId
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');


  useEffect(() => {
    //setIsUploading(true);
  },[leaveType]);


  const extractDates = (text) => {
    const datePattern = /\b(\d{1,2}(?:st|nd|rd|th)?[-\/\s]?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\d{1,2})[-\/\s]?\d{2,4})\b/gi;
    const matches = text.match(datePattern);
    const dateCounts = {};
  
    if (matches) {
      matches.forEach(dateStr => {
        const date = moment(dateStr, [
          "DD-MM-YYYY", "DD/MM/YYYY", "DD MMM YYYY", "DD MMMM YYYY",
          "MMMM DD, YYYY", "MMM DD, YYYY", "DD/MM/YY", "DD-MM-YY"
        ], true);
  
        if (date.isValid()) {
          const formattedDate = date.format('YYYY-MM-DD');
          if (dateCounts[formattedDate]) {
            dateCounts[formattedDate] += 1;
          } else {
            dateCounts[formattedDate] = 1;
          }
        }
      });
    }
    return dateCounts;
  };

  const isValid = (dates, startDate, endDate) => {
    if (!dates[startDate] || !dates[endDate]) {
      return false;
    }
  
    if (startDate === endDate) {
      return dates[startDate] >= 2;
    }
  
    return dates[startDate] && dates[endDate];
  };
  

  const handleDropLocal = useCallback(
    async (acceptedFiles) => {
        setIsUploading(true);
        setMessage('');
        setMessageType('');
        if (new Date(appliedStartDate) > new Date(appliedEndDate)) {
          alert("Applied start date must be on or before applied end date");
          return;
        }
  
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        console.log("Processing file", selectedFile);
  
        const reader = new FileReader();
        reader.onload = async (e) => {
          const buffer = e.target.result;
  
          let images = [];
          if (selectedFile.type === "application/pdf") {
            const pdf = await getDocument({ data: buffer }).promise;
            for (let i = 0; i < pdf.numPages; i++) {
              const page = await pdf.getPage(i + 1);
              const viewport = page.getViewport({ scale: 2 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
  
              await page.render({ canvasContext: context, viewport }).promise;
              const dataUrl = canvas.toDataURL('image/png');
              const imgBuffer = await (await fetch(dataUrl)).arrayBuffer();
              images.push(new Uint8Array(imgBuffer));
            }
          } else if (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg") {
            images = [buffer];
          }
  
          const ocrResults = await Promise.all(
            images.map(image => Tesseract.recognize(image, 'eng'))
          );
          const ocrText = ocrResults.map(result => result.data.text).join(' ');
  
          const dates = extractDates(ocrText);
          const isValidDates = isValid(dates, moment(appliedStartDate).format("YYYY-MM-DD"), moment(appliedEndDate).format("YYYY-MM-DD"));
  
          // Simulating saving metadata and returning the response
          const metadataId = 'simulatedMetadataId';

          setUploadedFileName(selectedFile.name);
          setOcrResult(ocrText);
          setDates(dates);
          setIsValidDates(isValidDates);
          setMetadataId(metadataId);
          setIsUploading(false);
        };
  
        reader.readAsArrayBuffer(selectedFile);
      },
      [employeeId, appliedStartDate, appliedEndDate]
    );
  
    

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (new Date(appliedStartDate) > new Date(appliedEndDate)) {
        alert("Applied start date must be on or before applied end date");
        return;
      }

      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      console.log("Sending file to backend", selectedFile)

      const formData = new FormData();
      formData.append("file", selectedFile);
      //formData.append("name", employeeName);
      formData.append("id", employeeId);
      formData.append("appliedStartDate", appliedStartDate);
      formData.append("appliedEndDate", appliedEndDate);

      setIsUploading(true);

      axios
        .post("/uploadMC", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setIsUploading(false);
          setUploadedFileName(selectedFile.name);
          setOcrResult(response.data.text);
          setDates(response.data.dates);
          setIsValidDates(response.data.isValidDates);
          setMetadataId(response.data.metadataId); // Store metadataId
        })
        .catch((error) => {
          setIsUploading(false);
          console.error("Error uploading file:", error);
        });
    },
    [employeeId, appliedStartDate, appliedEndDate]
  );

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Submitting form");
    setMessage('Please wait...');
    //setIsUploading(true);
    setMessageType('success');
    const formData = new FormData();
    //formData.append("name", employeeName);
    formData.append("staffId", employeeId);
    formData.append("leaveType", leaveType);
    formData.append("appliedStartDate", appliedStartDate);
    formData.append("appliedEndDate", appliedEndDate);
    formData.append("file",file);
    formData.append("uploadedFileName",uploadedFileName);
    //formData.append("ocrResult",ocrResult);
    //formData.append("dates",dates);
    formData.append("isValidDates",isValidDates);
    console.log("formData :: ",formData);
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    console.log("------------", Object.keys(dates).length );
    for (let date in dates) {
      if (dates.hasOwnProperty(date)) {
        console.log(`${date}: ${dates[date]}`);
      }
    }
    //formData.append("metadataId", metadataId); // Append metadataId; if no MC, will be null
    
    const response = await fetchClient('submitEmployeeLeave',{
      method: 'POST',
      body: formData,//JSON.stringify(formData),
    },null);
    console.log("response :: ",response);
    const responseData = await response.text();
    console.log("responseData :: ",responseData);
    if (response.ok) {
      setMessage(responseData);
      setMessageType('success');
    } else {
      setMessage('File is not Uploaded successfully please try again later');
      setMessageType('error');
    }
    setFile(null);
    setAppliedStartDate('2024-06-19');
    setAppliedEndDate('2024-06-19');
    setLeaveType('annual');
    setUploadedFileName('');
    setOcrResult('');
    setDates({});
    setIsValidDates(false);


    // axios
    //   .post("/submitAbsenceRequest", formData, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     navigate("/");
    //   })
    //   .catch((error) => {
    //     console.error("Error submitting form:", error);
    //   });



  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmSubmit = () => {
    setIsDialogOpen(false);
    handleSubmit();
  };

  // useEffect(() => {
  //   console.log("appliedStartDate :: ",appliedStartDate);
  // },[appliedStartDate]);

  useEffect(() => {
    const isFormFilled =
      employeeId &&
      leaveType &&
      appliedStartDate &&
      appliedEndDate;
    const isMedicalValid =
      leaveType === "medical" ? file && isValidDates : true;
    setIsFormValid(isFormFilled && isMedicalValid);
  }, [
    employeeId,
    leaveType,
    appliedStartDate,
    appliedEndDate,
    file,
    isValidDates,
  ]);

  return (
    <Grid container justifyContent="center" sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, width: "80%" }}>
        <Typography variant="h5" gutterBottom>
          Absence Request
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDialogOpen();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  label="Leave Type"
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={appliedStartDate}
                onChange={(e) => setAppliedStartDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={appliedEndDate}
                onChange={(e) => setAppliedEndDate(e.target.value)}
                required
              />
            </Grid>

            {leaveType === "mc" && appliedEndDate && appliedStartDate && (
              <Grid item xs={12}>
                <FileUpload
                  onDrop={handleDropLocal}
                  isUploading={isUploading}
                  uploadedFileName={uploadedFileName}
                />
              </Grid>
            )}

            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
            {console.log("disabled :: ",!isFormValid , !isUploading)}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isFormValid || isUploading || message==='Please wait...'}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* <Box mt={4}>
          <Typography variant="h6">OCR Result:</Typography>
          <Typography variant="body1">{ocrResult}</Typography>
          <Typography variant="h6">Extracted Dates:</Typography>
          <ul>
            {Object.entries(dates).map(([date, count]) => (
              <li key={date}>
                {date}: {count} times
              </li>
            ))}
          </ul>
          <Typography variant="h6">Is valid:</Typography>
          <Typography variant="body1">{isValidDates.toString()}</Typography>
        </Box> */}
      </Paper>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Submission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to submit this form?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AbsenceRequestCopy;
