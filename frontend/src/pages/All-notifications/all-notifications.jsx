import { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Divider,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from '@mui/material';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined, NotificationOutlined, WarningOutlined, SearchOutlined } from '@ant-design/icons';

// Sample notifications data
const notificationsData = [
  { id: 1, type: 'System', content: "System update scheduled for 3 AM tomorrow.", time: '2 min ago', icon: <SettingOutlined />, color: 'info' },
  { id: 2, type: 'Message', content: 'John Doe sent you a message.', time: '5 min ago', icon: <MessageOutlined />, color: 'primary' },
  { id: 3, type: 'Alert', content: 'Your profile is 80% complete. Complete it to access new features.', time: '1 hour ago', icon: <WarningOutlined />, color: 'warning' },
  { id: 4, type: 'Promotion', content: 'New promotion available: 20% off on all items!', time: '3 hours ago', icon: <GiftOutlined />, color: 'success' },
  { id: 5, type: 'Update', content: 'App version 1.5 is now available. Update now!', time: 'Yesterday', icon: <NotificationOutlined />, color: 'info' },
];

export default function AllNotifications() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filter notifications based on search query and selected filter
  const filteredNotifications = notificationsData.filter((notification) => {
    return (
      (filter === '' || notification.type === filter) &&
      (search === '' || notification.content.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        All Notifications
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search notifications..."
          fullWidth
          InputProps={{
            startAdornment: (
              <IconButton>
                <SearchOutlined />
              </IconButton>
            ),
          }}
          value={search}
          onChange={handleSearchChange}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filter-label">Filter By</InputLabel>
          <Select labelId="filter-label" value={filter} label="Filter By" onChange={handleFilterChange}>
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="System">System</MenuItem>
            <MenuItem value="Message">Message</MenuItem>
            <MenuItem value="Alert">Alert</MenuItem>
            <MenuItem value="Promotion">Promotion</MenuItem>
            <MenuItem value="Update">Update</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={1}>
        <List>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Box key={notification.id}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${notification.color}.lighter`, color: `${notification.color}.main` }}>
                      {notification.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="h6">{notification.content}</Typography>}
                    secondary={notification.time}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="caption">{notification.time}</Typography>
                  </ListItemSecondaryAction>
                </ListItemButton>
                <Divider />
              </Box>
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">No notifications found</Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
}
