import React from "react";
import {Add} from "@mui/icons-material";
import {Fab} from "@mui/material";
import PropTypes from "prop-types";

FloatingButton.propTypes = {
    onClick: PropTypes.func
};

export default function FloatingButton(props) {
    const { onClick } = props;

    return (
        <Fab
            variant="extended"
            color="primary"
            onClick={onClick}
            sx={{ position: "fixed", bottom: 30, right: 20 }}>
            <Add sx={{ mr: 1 }} />
            Add Data
        </Fab>
    )
}