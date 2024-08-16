import { useState, useEffect } from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';

export default function DocumentReviewPage() {
  const theme = useTheme();
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [status, setStatus] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('https://dmsdemo-wt6x.onrender.com/docu/status/pending');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch (err) {
        console.error('Error fetching documents:', err.message);
      }
    };

    fetchDocuments();
  }, []);

  const handleApprove = async () => {
    try {
      await updateDocumentStatus('Approved');
      setStatus('Approved');
      setSnackbarMessage('Document approved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error approving document:', err.message);
    }
  };

  const handleReject = async () => {
    try {
      await updateDocumentStatus('Rejected', rejectReason);
      setStatus('Rejected');
      setSnackbarMessage('Document rejected!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setOpenRejectDialog(false);
    } catch (err) {
      console.error('Error rejecting document:', err.message);
    }
  };

  const handleCloseReview = () => {
    setSnackbarMessage('Review session closed.');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const updateDocumentStatus = async (newStatus, reason = '') => {
    try {
      const response = await fetch(`https://dmsdemo-wt6x.onrender.com/docu/${currentDocument._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document status');
      }

      const updatedDocument = await response.json();
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc._id === updatedDocument._id ? updatedDocument : doc
        )
      );
      setCurrentDocument(updatedDocument);
    } catch (err) {
      console.error('Error updating document status:', err.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleRejectOpen = () => {
    setOpenRejectDialog(true);
  };

  const handleRejectClose = () => {
    setOpenRejectDialog(false);
  };

  const handleDocumentSelect = (document) => {
    setCurrentDocument(document);
    setStatus(document.status);
  };

  if (documents.length === 0) {
    return <Typography>No documents with status 'Pending' found.</Typography>;
  }

  return (
    <MainCard title="Document Review">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Select a document to review:</Typography>
          {documents.map((doc) => (
            <Button key={doc._id} onClick={() => handleDocumentSelect(doc)} sx={{ mb: 2 }}>
              {doc.name}
            </Button>
          ))}
        </Grid>

        {currentDocument && (
          <>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {currentDocument.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {currentDocument.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Date: {currentDocument.date}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Category: {currentDocument.category}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Extra Notes: {currentDocument.extraNotes}
              </Typography>
              <Button
                variant="contained"
                href={`https://dmsdemo-wt6x.onrender.com/${currentDocument.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 2 }}
              >
                View Attachment
              </Button>
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
                <Button variant="outlined" onClick={handleCloseReview}>
                  Close
                </Button>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>

      {/* Snackbar for Document Approved or Review Closed */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

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
