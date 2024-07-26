import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  FormControl,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import Autocomplete from "@mui/material/Autocomplete";

const roles = ["Project Leader", "Admin", "Contract Staff"];
const requiredFields = ["name", "nric", "id", "role"];

const AddEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    nric: "",
    id: "",
    nationality: "",
    email: "",
    role: "", // Ensure role is initialized as an empty string
    department: "",
    section: "",
    workStation: "",
    projectLeader: "",
    vendor: "",
    contract: "",
    contractStart: "",
    contractEnd: "",
    contractsServed: "",
    dailyRate: "",
    leaveQuota: "",
  });
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState(""); // State to store error message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const handleFileDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);

      setIsUploading(true);
      // axios.post
    },
    [files]
  );

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(employeeData).forEach((key) => {
      formData.append(key, employeeData[key]);
    });
    // files.forEach((file) => {
    //   formData.append("files", file); // should match the name in upload.array('files', 10)
    // });

    setIsUploading(true);
    setError(""); // Clear any previous errors
    axios
      .post("/addEmployee", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setIsUploading(false);
        navigate("/");
      })
      .catch((error) => {
        setIsUploading(false);
        setError(
          "Error adding employee: " +
            (error.response?.data?.error || error.message)
        );
        console.error("Error adding employee:", error);
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

  useEffect(() => {
    const isFormFilled = requiredFields.every((field) => employeeData[field]);
    setIsFormValid(isFormFilled);
  }, [employeeData]);

  return (
    <Grid container justifyContent="center" sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 4, width: "80%" }}>
        <Typography variant="h5" gutterBottom>
          Add Employee
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}{" "}
        {/* Display error message */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDialogOpen();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Staff Information
              </Typography>
            </Grid>
            {Object.keys(employeeData).map((key) => {
              if (
                key === "name" ||
                key === "nric" ||
                key === "id" ||
                key === "nationality" ||
                key === "email"
              ) {
                const isRequired = requiredFields.includes(key);
                let label;
                if (key === "nric") {
                  label = "NRIC";
                } else if (key === "id") {
                  label = "Staff Number";
                } else {
                  label = key.charAt(0).toUpperCase() + key.slice(1);
                }
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      name={key}
                      label={label}
                      value={employeeData[key]}
                      onChange={handleChange}
                      required={isRequired}
                    />
                  </Grid>
                );
              } else {
                return null;
              }
            })}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <Autocomplete
                  options={roles}
                  renderInput={(params) => (
                    <TextField {...params} label="Role" fullWidth required={requiredFields.includes("role")}/>
                  )}
                  value={employeeData.role}
                  onChange={(e, value) => {
                    setEmployeeData({ ...employeeData, role: value });
                  }}
                  autoComplete
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Department Information
              </Typography>
            </Grid>
            {Object.keys(employeeData).map((key) => {
              if (
                key === "department" ||
                key === "section" ||
                key === "workStation" ||
                key === "projectLeader"
              ) {
                const isRequired = requiredFields.includes(key);
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      name={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={employeeData[key]}
                      onChange={handleChange}
                      required={isRequired}
                    />
                  </Grid>
                );
              } else {
                return null;
              }
            })}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contract Information
              </Typography>
            </Grid>
            {Object.keys(employeeData).map((key) => {
              if (
                key === "vendor" ||
                key === "contract" ||
                key === "contractStart" ||
                key === "contractEnd" ||
                key === "contractsServed" ||
                key === "dailyRate" ||
                key === "leaveQuota"
              ) {
                const isRequired = requiredFields.includes(key);
                const isDate = key.includes("Start") || key.includes("End");
                const dateType = isDate ? "date" : "text";
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      name={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      type={dateType}
                      InputLabelProps={isDate ? { shrink: true } : {}}
                      value={employeeData[key]}
                      onChange={handleChange}
                      required={isRequired}
                    />
                  </Grid>
                );
              } else {
                return null;
              }
            })}

            {/* <Grid item xs={12}>
              <FileUpload onDrop={handleFileDrop} isUploading={isUploading} uploadedFileName={uploadedFileName}/>
            </Grid> */}
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
      </Paper>
    </Grid>
  );
};

export default AddEmployee;
