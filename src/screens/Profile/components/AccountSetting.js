import React, {useState} from "react";
import {
    Card, Grid, IconButton, InputAdornment, Typography
} from "@mui/material";
import Input from "components/Input";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import PropTypes from "prop-types";

AccountSetting.propTypes = {
    formik: PropTypes.object
};

export default function AccountSetting(props) {
    const { formik } = props;

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Card sx={{ mb: 3 }}>
            <Typography variant='h5' sx={{ mb: 4 }}>Account Setting</Typography>
            <Grid container spacing={3}>
                <Grid item lg={6} xs={12}>
                    <Input
                        label="Email"
                        type="email"
                        name='email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}/>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <Input
                        label="Password"
                        inputProps={{
                            autoComplete: "new-password"
                        }}
                        placeholder='●●●●●●●●●●'
                        type="password"
                        name='password'
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}/>
                </Grid>
            </Grid>
        </Card>
    )
}