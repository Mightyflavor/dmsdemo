import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Perform login logic
    navigate('/dashboard/default'); // Redirect to the dashboard after successful login
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h4">Log In</Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Enter your credentials to continue
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin onSuccess={handleLoginSuccess} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
