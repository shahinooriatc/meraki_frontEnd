import React from "react";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import List from "@mui/material/List";
import menus from "../../constants/menus";
import {styled} from "@mui/material/styles";
import PropTypes from 'prop-types';

const MenuItem = styled(ListItem)(({ theme, active }) => ({
    padding: '10px 15px',
    marginBottom: 5,
    borderRadius: 15,

    '& .MuiButtonBase-root:hover': {
        borderRadius: 15
    },

    ...(active && {
        background: theme.palette.primary.light,

        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.main
        },

        '& .MuiTypography-root': {
            color: theme.palette.primary.main
        }
    })
}));

MenuForm.propTypes = {
    onSelect: PropTypes.func,
    selected: PropTypes.object
};

export default function MenuForm(props) {
    const { onSelect, selected } = props;

    return (
        <List>
            {menus.map(({id, name, icon: Component}, i) => (
                <MenuItem
                    key={i}
                    button
                    active={id === selected}
                    disablePadding
                    onClick={() => onSelect(id)}>
                    <ListItemIcon>
                        <Component />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                </MenuItem>
            ))}
        </List>
    )
}