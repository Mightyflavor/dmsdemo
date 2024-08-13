import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { CommentOutlined, LockOutlined, FileProtectOutlined, SecurityScanOutlined, HistoryOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index, path) => {
    setSelectedIndex(index);
    // Navigate to the path here, for example:
    // navigate(path); // Uncomment if using a routing library like react-router-dom
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/support')}>
        <ListItemIcon>
          <FileProtectOutlined />
        </ListItemIcon>
        <ListItemText primary="Compliance" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/settings/account')}>
        <ListItemIcon>
          <SecurityScanOutlined />
        </ListItemIcon>
        <ListItemText primary="Security Settings" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2, '/privacy')}>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Privacy Center" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3, '/feedback')}>
        <ListItemIcon>
          <CommentOutlined />
        </ListItemIcon>
        <ListItemText primary="Feedback" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4, '/history')}>
        <ListItemIcon>
          <HistoryOutlined />
        </ListItemIcon>
        <ListItemText primary="Activity History" />
      </ListItemButton>
    </List>
  );
}
