import React from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, IconButton } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon, Logout as LogoutIcon } from '@mui/icons-material';

const CustomAppBar = ({ mode, setMode, search, setSearch, navigate }) => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Notes App
                </Typography>

                <TextField
                    variant="outlined"
                    style={{ backgroundColor: "white", borderRadius: "25px", color: "black" }}
                    size="small"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mr: 2, width: 300 }}
                />
                <IconButton
                    color="inherit"
                    onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                    sx={{ mr: 2 }}
                >
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>

                <Button
                    color="inherit"
                    endIcon={<LogoutIcon />}
                    onClick={() => navigate('/login')}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default CustomAppBar;