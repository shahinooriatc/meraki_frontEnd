import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import MuiCard from "@mui/material/Card";
import {Alert, Button, Grid, IconButton, InputAdornment, MenuItem} from "@mui/material";
import * as yup from 'yup';
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {AuthActions} from "../../slices/actions";
import {GeneralSelector, UserSelector} from "../../selectors";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {push} from "connected-react-router";
import Input from "../../components/Input";
import SelectField from "../../components/SelectField";

const Card = styled(MuiCard)(({theme}) => ({
    width: "60%",
    margin: "auto",
    padding: 40,

    [theme.breakpoints.down('sm')]: {
        width: 'auto',
        // margin: 20
    }
}));

const users = [
    {
        name: 'Admin',
        email: 'merakiadmin@example.com',
        password: 'merakiadmin'
    },
    {
        name: 'Human Resource',
        email: 'merakihrmanager@example.com',
        password: 'merakihrmanager'
    },
    {
        name: 'Department Manager',
        email: 'merakiopmanager@example.com',
        password: 'merakiopmanager'
    },
    {
        name: 'Staff',
        email: 'merakistaffmarketing@example.com',
        password: 'merakistaffmarketing'
    }
]

export default function Login() {
    const dispatch = useDispatch();
    const profile = useSelector(UserSelector.profile());
    const error = useSelector(GeneralSelector.error(AuthActions.login.type));
    const loading = useSelector(GeneralSelector.loader(AuthActions.login.type));

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (profile?._id) {
            dispatch(push('/app/dashboard'));
        }
    }, [profile]);

    const validationSchema = yup.object({
        email: yup.
            string('Enter your email').
            email('Enter a valid email').
            required('Email is required'),
        password: yup.
            string('Enter your password').
            min(8, 'Password should be of minimum 8 characters length').
            required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            role: null
        },
        validationSchema: validationSchema,
        validateOnChange: true,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        if (formik.values.role) {
            const { email, password } = formik.values.role;

            formik.setFieldValue('email', email);
            formik.setFieldValue('password', password);
        }
    }, [formik.values.role]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (values) => {
        dispatch(AuthActions.login(values));
    };

    return (
        <Card>
            {error && (
                <Alert
                    sx={{ mb: 4 }}
                    variant="filled"
                    severity="error">{error.message}</Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} direction="column">
                    <Grid item>
                        <SelectField
                            name="role"
                            label="Select Role"
                            value={formik.values.role ?? ''}
                            onChange={formik.handleChange}>
                            {users.map((item, i) => (
                                <MenuItem key={i} value={item}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                    <Grid item>
                        <Input
                            name="email"
                            label="Email address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}/>
                    </Grid>
                    <Grid item>
                        <Input
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}/>
                    </Grid>
                    <Grid item>
                        <Button
                            fullWidth
                            disabled={loading}
                            size='large'
                            type="submit"
                            variant="contained"
                            color="primary">
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Card>
    )
}