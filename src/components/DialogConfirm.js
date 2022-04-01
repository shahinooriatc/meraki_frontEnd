import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from "prop-types";

DialogConfirm.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.any,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func
};

export default function DialogConfirm(props) {
    const { open, title, content, onSubmit, onClose } = props;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit} autoFocus variant="contained" color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}