import React, { useState, useEffect } from 'react';
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemText, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const createProfileData = (first_name, last_name, father_name, pan_number, dob, sex) => {
  return { first_name, last_name, father_name, pan_number, dob, sex };
};


const createCardData = (card_provider, digits, card_number, card_expiry, card_type, cvv) => {
  return { card_provider, digits, card_number, card_expiry, card_type, cvv };
};

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [profileRows, setProfileRows] = useState([]);  
  const [cardRows, setCardRows] = useState([]);        
  const [currentView, setCurrentView] = useState('Profile'); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();     

  useEffect(() => {
    if (currentView === 'Profile') {
      fetchProfileData();
    } else if (currentView === 'Cards') {
      fetchCardsData();
    }
    else{
      navigate('/')
    }
  }, [currentView]);

  const fetchProfileData = async () => {
    try {
      const res = await axios.post(`https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/profile`, {
        count: 150,
        country_code: "en_IN",
        aadhar: true,
        dl: true,
        credit: true,
        debit: true,
        pan: true,
        passport: true,
        ssn: false,
      });
      const fetchedRows = res.data.data.map(profile => createProfileData(
        profile.first_name,
        profile.last_name,
        profile.father_name,
        profile.pan_number,
        profile.dob,
        profile.sex
      ));
      setProfileRows(fetchedRows);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCardsData = async () => {
    try {
      const res = await axios.post(`https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/card/credit`, {
        count: 250,
        country_code: "en_IN"
      });
      const fetchedRows = res.data.data.map(card => createCardData(
        card.card_provider,
        card.digits,
        card.card_number,
        card.card_expiry,
        card.card_type,
        card.cvv
      ));
      setCardRows(fetchedRows);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredProfileRows = profileRows.filter(row =>
    row.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.father_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.pan_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCardRows = cardRows.filter(row =>
    row.card_provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.card_expiry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.card_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const paginatedProfileRows = filteredProfileRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const paginatedCardRows = filteredCardRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Profile', 'Cards', 'Logout'].map((text) => (
          <ListItem button key={text} onClick={() => setCurrentView(text)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderContent = () => {
    return (
      <>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
        {currentView === 'Profile' && (
          <>
            <Typography variant="h5" gutterBottom>Profile Information</Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Father Name</TableCell>
                      <TableCell>PAN</TableCell>
                      <TableCell>DOB</TableCell>
                      <TableCell>Sex</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProfileRows.map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{row.first_name}</TableCell>
                        <TableCell>{row.last_name}</TableCell>
                        <TableCell>{row.father_name}</TableCell>
                        <TableCell>{row.pan_number}</TableCell>
                        <TableCell>{row.dob}</TableCell>
                        <TableCell>{row.sex}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProfileRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}

        {currentView === 'Cards' && (
          <>
            <Typography variant="h5" gutterBottom>Credit Card Information</Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Card Provider</TableCell>
                      <TableCell>Card Number</TableCell>
                      <TableCell>Digits</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Card Type</TableCell>
                      <TableCell>CVV</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCardRows.map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{row.card_provider}</TableCell>
                        <TableCell>{row.card_number}</TableCell>
                        <TableCell>{row.digits}</TableCell>
                        <TableCell>{row.card_expiry}</TableCell>
                        <TableCell>{row.card_type}</TableCell>
                        <TableCell>{row.cvv}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredCardRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </>
        )}

        {currentView === 'Logout' && (
          <>
            <Typography variant="h5" gutterBottom>Logging out...</Typography>
          </>
        )}
      </>
    );
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
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
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
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: { sm: `${drawerWidth}px` } }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
