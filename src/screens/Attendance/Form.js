import React, {useEffect} from "react";
import {
    Box,
    Button,
    Card,
    FormControl, FormControlLabel, FormLabel,
    Grid,
    MenuItem, Radio, RadioGroup,
    TextField
} from "@mui/material";
import PageTitle from "../../components/PageTitle";
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {useFormik} from "formik";
import {useParams} from "react-router-dom";
import {AttendanceSelector, GeneralSelector, UserSelector} from "../../selectors";
import {AttendanceActions, GeneralActions, UserActions} from "../../slices/actions";
import {toast} from "react-toastify";
import {goBack} from "connected-react-router";
import FormSkeleton from "../../components/Skeleton/FormSkeleton";

export default function FormAttendance() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const users = useSelector(UserSelector.getUsers());
    const attendance = useSelector(AttendanceSelector.getAttendanceById());
    const loading = useSelector(GeneralSelector.loader(AttendanceActions.getAttendanceById.type));
    const actions = [
        AttendanceActions.createAttendance.type,
        AttendanceActions.updateAttendance.type
    ];
    const success = useSelector(GeneralSelector.success(actions));

    useEffect(() => {
        dispatch(UserActions.getUsers());

        if (id) {
            dispatch(AttendanceActions.getAttendanceById(id));
        }
    }, []);

    useEffect(() => {
        if (success.length > 0) {
            const action = success.find(item => actions.includes(item.action));

            toast.success(`${action?.message ?? "Success"}`, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: false,
                pauseOnFocusLoss: false
            });

            dispatch(GeneralActions.removeSuccess(actions));

            if (action.action === AttendanceActions.createAttendance.type) {
                dispatch(goBack());
            }
        }
    }, [success]);

    const validationSchema = yup.object({
        user: yup.string().required('User is required'),
        action: yup.string()
    });

    const formik = useFormik({
        initialValues: {
            user: attendance?.user ?? "",
            action: (attendance?.checkIn && 'checkIn') || (attendance.checkOut && 'checkOut') || ''
        },
        enableReinitialize: true,
        validateOnChange: true,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const handleSubmit = (values) => {
        const params = {
            user: values.user,
        };

        params[values.action] = new Date();

        if (id) {
            params.id = id;
            dispatch(AttendanceActions.updateAttendance(params));
        } else {
            dispatch(AttendanceActions.createAttendance(params));
        }
    };

    return (
        <Box>
            <PageTitle isBack={true} title={`${id ? "Update" : "Create"} Attendance`}/>

            {loading ? (
                <FormSkeleton/>
            ) : (
                <Grid container justifyContent="center">
                    <Grid item lg={6}>
                        <Card>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    fullWidth
                                    select
                                    sx={{ mb: 2 }}
                                    label="Users"
                                    name="user"
                                    value={formik.values.user}
                                    onChange={formik.handleChange}>
                                    {users.map((item, i) => (
                                        <MenuItem key={i} value={item._id}>{item.name}</MenuItem>
                                    ))}
                                </TextField>
                                <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
                                    <FormLabel component="legend">Action</FormLabel>
                                    <RadioGroup
                                        row
                                        name="action"
                                        value={formik.values.action}
                                        onChange={formik.handleChange}>
                                        <FormControlLabel value='checkIn' control={<Radio disabled={formik.values.action === 'checkOut'} />} label='Check In' />
                                        <FormControlLabel value='checkOut' control={<Radio />} label='Check Out' />
                                    </RadioGroup>
                                </FormControl>
                                <Grid container justifyContent="flex-end">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained">
                                        Submit
                                    </Button>
                                </Grid>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}