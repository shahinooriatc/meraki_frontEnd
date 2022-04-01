import React from "react";
import {Box, Grid, MenuItem} from "@mui/material";
import ROLES from "constants/role";
import {NameSort} from "constants/sort";
import styled from "@emotion/styled";
import {useSelector} from "react-redux";
import {DepartmentSelector, DesignationSelector} from "selectors";
import Input from "components/Input";
import SelectField from "components/SelectField";
import PropTypes from "prop-types";
import Can from "../../../utils/can";
import {actions, features} from "../../../constants/permission";

const FilterBox = styled(Box)(() => ({
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
}));

Filter.propTypes = {
    filter: PropTypes.object,
    onChange: PropTypes.func
};

export default function Filter(props) {
    const { filter, onChange } = props;
    const departments = useSelector(DepartmentSelector.getDepartments());
    const designations = useSelector(DesignationSelector.getDesignations());

    return (
        <FilterBox>
            <Grid container spacing={3} justifyContent="space-between">
                <Grid item lg={12} sm={12} xs={12} container justifyContent='space-between'>
                    <Grid item lg={4}>
                        <Input
                            fullWidth
                            size='small'
                            label="Search"
                            placeholder='Search by name or email'
                            value={filter.keyword}
                            name="keyword"
                            onChange={onChange}/>
                    </Grid>
                    <Grid item lg={2}>
                        <SelectField
                            label="Sort"
                            value={filter.sort}
                            name="sort"
                            onChange={onChange}>
                            {Object.keys(NameSort).map((key) => (
                                <MenuItem key={key} value={NameSort[key].value}>
                                    {NameSort[key].name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                </Grid>
                <Grid item lg={12} sm={12} xs={12} container spacing={3} justifyContent='space-between'>
                    <Grid item lg={3} sm={12} xs={12}>
                        <SelectField
                            label="Role"
                            value={filter.role}
                            name="role"
                            onChange={onChange}>
                            <MenuItem value={-1}>All Role</MenuItem>
                            {Object.keys(ROLES).map(key => (
                                <MenuItem key={key} value={key}>
                                    {ROLES[key].name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                    <Grid item lg={3} sm={12} xs={12}>
                        <SelectField
                            label="Status"
                            value={filter.status}
                            name="status"
                            onChange={onChange}>
                            <MenuItem value={-1}>All Status</MenuItem>
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={0}>Non Active</MenuItem>
                        </SelectField>
                    </Grid>
                    {Can(actions.readAll, features.user) && (
                        <Grid item lg={3} sm={12} xs={12}>
                            <SelectField
                                label="Department"
                                value={filter.department}
                                name="department"
                                onChange={onChange}>
                                <MenuItem value={-1}>All Department</MenuItem>
                                {departments.map((item, i) => (
                                    <MenuItem key={i} value={item._id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </SelectField>
                        </Grid>
                    )}
                    <Grid item lg={3} sm={12} xs={12}>
                        <SelectField
                            label="Designation"
                            value={filter.designation}
                            name="designation"
                            onChange={onChange}>
                            <MenuItem value={-1}>All Designations</MenuItem>
                            {designations.map((item, i) => (
                                <MenuItem key={i} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                </Grid>
            </Grid>
        </FilterBox>
    )
}