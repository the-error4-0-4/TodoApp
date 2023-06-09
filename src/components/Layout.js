import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import format from 'date-fns/format';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import supabase from '../config/SupabaseClient';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
const drawerWidth = 240;

const active = {
    background: '#f4f4f4'
}

export default function Layout({ children }) {
    const [user, setUser] = useState(false);
    const[username,setUsername]=useState('Anonymus');
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setUser(true);
            setUsername(user.user_metadata.username);


        }
        else {
            console.log('no user');
        }
    }

    useEffect(() => {
        fetchUser();




    }, [])

    const location = useLocation()
    const navigate = useNavigate()
    const menuItems = [
        {
            text: 'My Notes',
            icon: <SubjectOutlinedIcon color='secondary' />,
            path: '/'
        },
        {
            text: 'Create Notes',
            icon: <AddCircleOutlinedIcon color='secondary' />,
            path: '/create'
        }

    ]
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
                elevation={0}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }} >
                        Today is the {format(new Date(), 'do MMMM Y')}
                    </Typography>

                    <Typography>
                        {username}
                    </Typography>
                    <Avatar alt="Remy Sharp" src="/60111.jpg" sx={{ ml: 2 }} />


                </Toolbar>
            </AppBar>



            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >

                <Typography align='center' variant="h5">
                    TodoApp
                </Typography>

                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                style={location.pathname === item.path ? active : null}


                            >

                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>

                        </ListItem>
                    ))}

                    {!user && <ListItem>
                        <ListItemButton
                            onClick={() => navigate('/login')}


                        >

                            <ListItemIcon><LoginIcon color='secondary' /></ListItemIcon>
                            <ListItemText primary='Login' />


                        </ListItemButton>
                    </ListItem>}

                    {!user && <ListItem>
                        <ListItemButton
                            onClick={() => navigate('/signup')}

                        >

                            <ListItemIcon><AddIcon color='secondary' /></ListItemIcon>
                            <ListItemText primary='Create An Account' />


                        </ListItemButton>
                    </ListItem>}


                    {user &&
                        <ListItem>
                            <ListItemButton
                                onClick={async () => {

                                    const { error } = await supabase.auth.signOut()
                                    if (error) {
                                        console.log('Error logging out:', error.message);
                                        toast.error(error.message);
                                        return;
                                    }

                                    setUser(false);
                                    navigate('/login')



                                }
                                }

                            >

                                <ListItemIcon><LogoutIcon color='secondary' /></ListItemIcon>
                                <ListItemText primary='Logout' />


                            </ListItemButton>
                        </ListItem>

                    }

                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}