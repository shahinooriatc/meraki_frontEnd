import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    Grid,
    Switch,
    Typography
} from "@mui/material";
import PageTitle from "components/PageTitle";
import styled from "@emotion/styled";
import Avatar from "assets/avatar.svg";
import {useDispatch, useSelector} from "react-redux";
import {GeneralSelector, UserSelector} from "selectors";
import {useParams} from "react-router-dom";
import {DepartmentActions, DesignationActions, UserActions} from "slices/actions";
import MenuForm from "./components/Form/MenuForm";
import menus from "./constants/menus";
import Can from "../../utils/can";
import {actions, features} from "../../constants/permission";
import FormSkeleton from "../../components/Skeleton/FormSkeleton";

const Picker = styled(Box)(() => ({
    width: 120,
    height: 120,
    margin: "40px auto 10px auto",

    "& input": {
        display: "none"
    },

    "& img": {
        width: "100%",
        borderRadius: 100
    }
}));

const SwitchBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
}));

export default function FormUser() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(UserSelector.getUserById());
    const loading = useSelector(GeneralSelector.loader(UserActions.getUserById.type));
    const [preview, setPreview] = useState(null);
    const [selected, setSelected] = useState(menus[0].id);
    const [form, setForm] = useState({
        avatar: null,
        status: false
    });

    useEffect(() => {
        dispatch(DepartmentActions.getDepartments());
        dispatch(DesignationActions.getDesignations());

        if (id) {
            dispatch(UserActions.getUserById(id));
        }
    }, []);

    useEffect(() => {
        setForm({
            avatar: user.avatar,
            status: user.status === 1
        });
    }, [user]);

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);

        setForm({
            ...form,
            avatar: file
        });
        setPreview(objectUrl);
    };

    const handleToggleStatus = (e) => {
        const { checked } = e.target;

        setForm({
            ...form,
            status: checked
        });
    };

    return (
        <Box>
            <PageTitle isBack={true} title={`${Can(actions.readAll, features.user) ? 'Update' : 'Detail'} Employee`}/>

            {loading ? (
                <FormSkeleton/>
            ) : (
                <Grid container spacing={3}>
                    <Grid item lg={4} sm={12} xs={12}>
                        <Card>
                            <Picker>
                                <input
                                    readOnly={Can(actions.readSome, features.user)}
                                    type="file"
                                    id="profile"
                                    onChange={handleChangeImage}/>
                                <label htmlFor="profile">
                                    <img
                                        alt="profile"
                                        src={preview || form.avatar || Avatar}/>
                                </label>
                            </Picker>

                            <Box sx={{ mt: 7 }}>
                                <SwitchBox>
                                    <Typography>Disable Account</Typography>
                                    <Switch
                                        disabled={Can(actions.readSome, features.user)}
                                        checked={form.status}
                                        name="status"
                                        onChange={handleToggleStatus}/>
                                </SwitchBox>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <MenuForm
                                    selected={selected}
                                    onSelect={(id) => setSelected(id)}/>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item lg={8} sm={12} xs={12}>
                        {menus.map(({id, component: Component}, i) => {
                            if (selected === id) {
                                return <Component
                                    key={i}
                                    user={user}
                                    form={form}/>
                            }

                            return <div key={i}/>
                        })}
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}