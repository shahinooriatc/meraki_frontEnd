import React from "react";
import styled from "@emotion/styled";
import {Box, IconButton, Typography} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";

const RootBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    marginBottom: 30
}));

PageTitle.propTypes = {
    isBack: PropTypes.func,
    title: PropTypes.string
};

export default function PageTitle(props) {
    const history = useHistory();
    const { isBack, title } = props;

    return (
        <RootBox>
            {isBack && (
                <IconButton onClick={() => history.goBack()}
                    sx={{
                        mr: 2
                    }}>
                    <ArrowBack/>
                </IconButton>
            )}
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
        </RootBox>
    )
}