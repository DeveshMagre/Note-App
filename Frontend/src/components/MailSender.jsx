import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";

const MailSender = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button variant="contained" color="primary" onClick={handleClick}>
        Send Mail
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled">
          Mail Sent Successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MailSender;
