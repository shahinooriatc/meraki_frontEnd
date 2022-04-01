import React, {useEffect} from "react";
import styled from "@emotion/styled";
import {Box, Hidden} from "@mui/material";
import {ReactComponent as Logo} from "assets/logo2.svg";
import {ReactComponent as Illustration} from 'assets/login-illustration.svg';
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {UserActions} from "../slices/actions";

const Root = styled(Box)(() => ({
    width: '100%',
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}));

const Content = styled(Box)(({ theme }) => ({
    width: '50%',

    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: 20
    }
}));

AuthLayout.propTypes = {
    children: PropTypes.any
};

export default function AuthLayout({children}) {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('merakihr-token');
        
        if (token) {
            dispatch(UserActions.profileUser());
        }
    }, [dispatch]);

    return (
        <Root>
            <Hidden smDown>
                <Box>
                    <Illustration width={500} height={500}/>
                </Box>
            </Hidden>
            <Content>
                <Box sx={{ textAlign: 'center' }}>
                    <Logo width={200} height={100}/>
                </Box>

                {children}
            </Content>
        </Root>
    )
}