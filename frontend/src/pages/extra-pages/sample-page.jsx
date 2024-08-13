// material-ui
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';

// Demo Document Data
const documentData = {
  name: 'Project Proposal',
  description: 'A proposal for the upcoming project.',
  date: '2024-08-10',
  category: 'Quote',
  extraNotes: 'Please review this document thoroughly before approving.',
  status: 'Pending',
};

export default function DocumentReviewPage() {
  const theme = useTheme();
  const [status, setStatus] = useState(documentData.status);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    setStatus('Approved');
    alert('Document approved!');
    // Here you would update the status in the database
  };

  const handleReject = () => {
    setStatus('Rejected');
    alert('Document rejected!');
    // Here you would update the status in the database with the reject reason
    setOpenRejectDialog(false);
  };

  const handleClose = () => {
    // Logic to close the review session or navigate away
    alert('Review session closed.');
  };

  const handleRejectOpen = () => {
    setOpenRejectDialog(true);
  };

  const handleRejectClose = () => {
    setOpenRejectDialog(false);
  };

  return (
    <MainCard title="Document Review">
      <Grid container spacing={3}>
        {/* Document Details */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            {documentData.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {documentData.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Date: {documentData.date}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Category: {documentData.category}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Extra Notes: {documentData.extraNotes}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color:
                status === 'Approved'
                  ? theme.palette.success.main
                  : status === 'Rejected'
                  ? theme.palette.error.main
                  : theme.palette.warning.main,
              mt: 2,
            }}
          >
            Status: {status}
          </Typography>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleApprove}
              disabled={status !== 'Pending'}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectOpen}
              disabled={status !== 'Pending'}
            >
              Reject
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Reject Reason Dialog */}
      <Dialog open={openRejectDialog} onClose={handleRejectClose}>
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this document.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejectReason"
            label="Reject Reason"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReject} color="error" disabled={!rejectReason}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
