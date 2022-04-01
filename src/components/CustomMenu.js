import React, {useState} from "react";
import {Box, IconButton, Menu, Tooltip} from "@mui/material";
import {MoreHorizOutlined} from "@mui/icons-material";
import PropTypes from "prop-types";

CustomMenu.propTypes = {
    title: PropTypes.string,
    children: PropTypes.any
};

export default function CustomMenu({ title, children }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Tooltip title={title ?? 'Options'}>
                <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
                    <MoreHorizOutlined/>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: 140,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 8px 24px rgba(149, 157, 165, 0.2))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {children}
            </Menu>
        </Box>
    )
}