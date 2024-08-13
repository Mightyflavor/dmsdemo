import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MainCard from 'components/MainCard';
import OrdersTable from './OrdersTable';

export default function DashboardDefault() {
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [pendingDocuments, setPendingDocuments] = useState(0);
  const [approvedDocuments, setApprovedDocuments] = useState(0);
  const [rejectedDocuments, setRejectedDocuments] = useState(0);

  useEffect(() => {
    // Fetch data from your backend API
    axios.get('https://dmsdemo-1.onrender.com/docu')
      .then(response => {
        const documents = response.data;

        // Calculate counts based on status
        const total = documents.length;
        const pending = documents.filter(doc => doc.status === 'Pending').length;
        const approved = documents.filter(doc => doc.status === 'Approved').length;
        const rejected = documents.filter(doc => doc.status === 'Rejected').length;

        // Update state
        setTotalDocuments(total);
        setPendingDocuments(pending);
        setApprovedDocuments(approved);
        setRejectedDocuments(rejected);
      })
      .catch(error => {
        console.error('Error fetching document data:', error);
      });
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Documents" count={totalDocuments} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Pending Documents" count={pendingDocuments} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Approved Documents" count={approvedDocuments} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Rejected Documents" count={rejectedDocuments} />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Documents</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
    </Grid>
  );
}
