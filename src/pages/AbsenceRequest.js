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

const leaveTypes = [
  { value: "annual", label: "Annual Leave" },
  { value: "medical", label: "Medical Leave" },
];

const AbsenceRequest = () => {
  const [employeeName, setEmployeeName] = useState("Ryan");
  const [employeeId, setEmployeeId] = useState("12345");
  const [leaveType, setLeaveType] = useState("medical");
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
      formData.append("name", employeeName);
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
    [employeeName, employeeId, appliedStartDate, appliedEndDate]
  );

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Submitting form");

    const formData = new FormData();
    formData.append("name", employeeName);
    formData.append("id", employeeId);
    formData.append("leaveType", leaveType);
    formData.append("appliedStartDate", appliedStartDate);
    formData.append("appliedEndDate", appliedEndDate);
    formData.append("metadataId", metadataId); // Append metadataId; if no MC, will be null

    axios
      .post("/submitAbsenceRequest", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
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
      employeeName &&
      employeeId &&
      leaveType &&
      appliedStartDate &&
      appliedEndDate;
    const isMedicalValid =
      leaveType === "medical" ? file && isValidDates : true;
    setIsFormValid(isFormFilled && isMedicalValid);
  }, [
    employeeName,
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
                label="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
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
            <Grid item xs={12} sm={6}></Grid>
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

            {leaveType === "medical" && appliedEndDate && appliedStartDate && (
              <Grid item xs={12}>
                <FileUpload
                  onDrop={handleDrop}
                  isUploading={isUploading}
                  uploadedFileName={uploadedFileName}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isFormValid}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        <Box mt={4}>
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
        </Box>
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

export default AbsenceRequest;
