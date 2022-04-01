import React from "react";
import {FormControl, FormHelperText, InputBase, Typography} from "@mui/material";
import PropTypes from "prop-types";

Input.propTypes = {
    label: PropTypes.string,
    helperText: PropTypes.string,
    error: PropTypes.bool
};

export default function Input(props) {
    const { label, helperText, error } = props;

    return (
        <FormControl fullWidth>
            {label && (
                <Typography variant='caption' sx={{ textAlign: 'left' }}>{label}</Typography>
            )}
            <InputBase
                fullWidth
                helperText=''
                {...props}/>
            {helperText && (
                <FormHelperText error={error}>{helperText}</FormHelperText>
            )}
        </FormControl>
    )
}