import React, {useState} from "react";
import {
    Button, Card, Chip, FormControl, Grid, IconButton, InputAdornment, MenuItem, Typography
} from "@mui/material";
import ROLES from "constants/role";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import * as yup from "yup";
import {useDispatch} from "react-redux";
import Input from "components/Input";
import SelectField from "components/SelectField";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {UserActions} from "slices/actions";
import PropTypes from "prop-types";
import Can from "../../../../utils/can";
import {actions, features} from "../../../../constants/permission";

AccountSetting.propTypes = {
    user: PropTypes.object,
    form: PropTypes.object
};

export default function AccountSetting(props) {
    const { user, form } = props;
    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);

    const validationSchema = yup.object({
        email: yup.string().email().
        required('Email is required'),
        role: yup.array().required("Role is required")
    });

    const formik = useFormik({
        initialValues: {
            email: user?.email ?? "",
            role: user?.role ?? [],
        },
        enableReinitialize: true,
        validateOnChange: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleRole = ({ target }) => {
        formik.setFieldValue('role', target.value);
    }

    const handleSubmit = (values) => {
        const params = {
            id: user._id,
            ...form,
            ...values,
        };

        dispatch(UserActions.updateUser(params));
    }

    return (
        <Card>
            <Typography variant='h5' sx={{ mb: 4 }}>Account Setting</Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item lg={6} xs={12}>
                        <Input
                            label="Email"
                            type="email"
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={Can(actions.readSome, features.user)}/>
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
                            helperText={(formik.touched.password && formik.errors.password) || (
                                user._id && "Leave empty if do not want to change password"
                            )}
                            disabled={Can(actions.readSome, features.user)}/>
                    </Grid>
                    <Grid item lg={12} xs={12}>
                        <FormControl fullWidth>
                            <SelectField
                                multiple
                                disabled={Can(actions.readSome, features.user)}
                                value={formik.values.role}
                                onChange={handleRole}
                                input={<Input sx={{
                                    '& .MuiInputBase-root': {
                                        height: 'auto'
                                    }
                                }} label="Role" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}>
                                {Object.keys(ROLES).map(key => (
                                    <MenuItem key={key} value={key}>
                                        {ROLES[key].name}
                                    </MenuItem>
                                ))}
                            </SelectField>
                        </FormControl>
                    </Grid>
                    <Grid sx={{ mt: 3 }} item container justifyContent="flex-end">
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Card>
    )
}