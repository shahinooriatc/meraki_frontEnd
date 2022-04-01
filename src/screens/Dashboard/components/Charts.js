import React from "react";
import {Card, Grid, Typography} from "@mui/material";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import {actions, features} from "../../../constants/permission";
import Can from "../../../utils/can";

Charts.propTypes = {
    employee: PropTypes.object,
    expense: PropTypes.object
};

export default function Charts(props) {
    const { employee, expense } = props;

    return (
        <Grid container spacing={3}>
            {Can(actions.readAll, features.user) && (
                <Grid item lg={6}>
                    <Card>
                        <Typography>Monthly Employee</Typography>
                        <Chart
                            options={employee.options}
                            series={employee.series}
                            type="area"/>
                    </Card>
                </Grid>
            )}
            {Can(actions.readAll, features.expense) && (
                <Grid item lg={6}>
                    <Card>
                        <Typography>Monthly Expenses</Typography>
                        <Chart
                            options={expense.options}
                            series={expense.series}
                            type="area"/>
                    </Card>
                </Grid>
            )}
            {Can(actions.readSome, features.user) && (
                <Grid item lg={6}>
                    <Card>
                        <Typography>Monthly Employee</Typography>
                        <Chart
                            options={employee.options}
                            series={employee.series}
                            type="area"/>
                    </Card>
                </Grid>
            )}
            {Can(actions.readSome, features.attendance) && (
                <Grid item lg={6}>
                    <Card>
                        <Typography>Monthly Attendance</Typography>
                        <Chart
                            options={expense.options}
                            series={expense.series}
                            type="area"/>
                    </Card>
                </Grid>
            )}
        </Grid>
    )
}