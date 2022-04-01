import React from "react";
import styled from "@emotion/styled";
import {Box, Card, Typography} from "@mui/material";
import PropTypes from "prop-types";

const WidgetBox = styled(Card)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 20
}));

Widget.propTypes = {
    title: PropTypes.string,
    content: PropTypes.any,
    icon: PropTypes.any
};

export default function Widget(props) {
    const { title, content, icon } = props;

    return (
        <WidgetBox>
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
                <Typography variant="h4">{content}</Typography>
            </Box>
            <Box>
                {icon}
            </Box>
        </WidgetBox>
    )
}