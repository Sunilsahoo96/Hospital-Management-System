import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
const API_URL = process.env.REACT_APP_API_URL;

const generateUAN = (counter) => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0].replace(/-/g, "");
  return `${formattedDate}${counter}`;
};

function PatientRegistration() {
  const [counter, setCounter] = useState(() => {
    return Number(localStorage.getItem("uanCounter")) || 1; // Get counter from localStorage
  });

  const [formData, setFormData] = useState({
    uan: "",
    patientName: "",
    guardianName: "",
    address: "",
    mobile: "",
    alternateMobile: "",
  });

  // Update UAN whenever counter changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      uan: generateUAN(counter),
    }));
  }, [counter]); // Runs when counter updates

  useEffect(() => {
    setCounter((prev) => prev + 1); // Increment counter once when the component mounts
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/patient/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Patient Registered Successfully!");

        // Increment counter for next UAN
        const newCounter = counter + 1;
        setCounter(newCounter);
        localStorage.setItem("uanCounter", newCounter);

        // Reset form with new UAN
        setFormData({
          uan: generateUAN(newCounter),
          patientName: "",
          guardianName: "",
          address: "",
          mobile: "",
          alternateMobile: "",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Patient Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="UAN Number" name="uan" value={formData.uan} disabled />
          <TextField fullWidth margin="normal" label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Address" name="address" value={formData.address} onChange={handleChange} multiline rows={3} required />
          <TextField fullWidth margin="normal" label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} required />
          <TextField fullWidth margin="normal" label="Alternate Mobile Number" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default PatientRegistration;
