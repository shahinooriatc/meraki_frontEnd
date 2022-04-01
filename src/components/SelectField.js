import React from "react";
import {FormControl, Select, Typography} from "@mui/material";
import Input from "./Input";
import PropTypes from "prop-types";

SelectField.propTypes = {
    label: PropTypes.string,
    children: PropTypes.any
};

export default function SelectField(props) {
    const { label, children } = props;

    return (
        <FormControl fullWidth>
            {label && (
                <Typography variant='caption'>{label}</Typography>
            )}
            <Select
                fullWidth
                input={<Input/>}
                {...props}>
                {children}
            </Select>
        </FormControl>
    )
}