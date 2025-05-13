import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
} from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

function Footer() {
    return (
        <Box sx={{ bgcolor: '#0d47a1', color: '#fff', py: 5, mt: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h5" fontWeight="bold">
                            Cosysta
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e3f2fd' }}>
                            Your one-stop destination for quality and value.
                            Lorem ipsum dolor sit
                            <br/> amet consectetur, adipisicing elit.
                             Corrupti, ipsa! Deserunt consequuntur,
                        </Typography>
                    </Grid>

                    <Grid item xs={12} mr={18} sm={4}>
                        <Typography variant="h5" fontWeight="bold">
                            Links
                        </Typography>
                        {['Home', 'Shop', 'Contact', 'FAQs'].map((text) => (
                            <Link
                                key={text}
                                href="#"
                                underline="none"
                                sx={{
                                    display: 'block',
                                    color: '#bbdefb',
                                    fontSize: '0.8rem',
                                    '&:hover': { color: '#fff' },
                                }}
                            >
                                {text}
                            </Link>
                        ))}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h5" fontWeight="bold">
                            Connect
                        </Typography>
                        <Box>
                            {[Facebook, Twitter, Instagram, YouTube].map((Icon, i) => (
                                <IconButton
                                    key={i}
                                    size="small"
                                    sx={{ color: '#bbdefb', '&:hover': { color: '#fff' } }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Box mt={3} textAlign="center">
                    <Typography variant="caption" sx={{ color: '#90caf9' }}>
                        &copy; {new Date().getFullYear()} Cosysta. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
