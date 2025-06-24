import { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import UploadDocument from './components/UploadDocument';
import SearchBox from './components/SearchBox';
import GarbageSchedule from './components/cases/GarbageSchedule';
import PotholeReport from './components/cases/PotholeReport';
import McpPanel from './components/cases/McpPanel';
import ChatBox from './components/ChatBox';

const drawerWidth = 240;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('chat');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {/* <ListItem button onClick={() => setActiveModule('upload')}>
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText primary="Subir archivo" />
        </ListItem> */}
        <ListItem button onClick={() => setActiveModule('search')}>
          <ListItemIcon><SearchIcon /></ListItemIcon>
          <ListItemText primary="Buscar" />
        </ListItem>
        <ListItem button onClick={() => setActiveModule('chat')}>
          <ListItemIcon><ChatIcon /></ListItemIcon>
          <ListItemText primary="💬 Chat General" />
        </ListItem>
        {/* <ListItem button onClick={() => setActiveModule('garbage')}>
          <ListItemIcon><ChatIcon /></ListItemIcon>
          <ListItemText primary="🗑️ Recolección de basura" />
        </ListItem>
        <ListItem button onClick={() => setActiveModule('pothole')}>
          <ListItemIcon><ChatIcon /></ListItemIcon>
          <ListItemText primary="🚧 Reportar bache o poste" />
        </ListItem> */}
        <ListItem button onClick={() => setActiveModule('mcp')}>
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText primary="📂 MCP" />
        </ListItem>

      </List>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case 'upload':
        return <UploadDocument />;
      case 'search':
        return <SearchBox />;
      case 'chat':
        return (
          <ChatBox
            initialPrompt=""
            title="💬 Asistente Municipal General"
            userId="user_general"
            sessionId="session_general"
            enableToolbar={true}
          />
        );
      case 'garbage':
        return <GarbageSchedule />;
      case 'pothole':
        return <PotholeReport />;
      case 'mcp':
        return <McpPanel />;
      case 'default':
        return (
          <ChatBox
            initialPrompt=""
            title="💬 Asistente Municipal General"
            userId="user_general"
            sessionId="session_general"
            enableToolbar={true}
          />
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Agente MCP – Momostenango
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;
