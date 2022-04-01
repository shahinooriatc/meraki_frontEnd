import React, {useState} from "react";
import {Box, Tab} from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import EmployeeList from "./components/EmployeeList";
import {styled} from "@mui/material/styles";
import AttendanceList from "./components/AttendanceList";
import ExpensesList from "./components/ExpensesList";

const TABS = [
    {
        id: "employee",
        name: "Employee",
        component: EmployeeList
    },
    {
        id: "attendance",
        name: "Attendance",
        component: AttendanceList
    },
    {
        id: "expenses",
        name: "Expenses",
        component: ExpensesList
    }
];

const Panel = styled(TabPanel)(() => ({
    padding: "20px 0"
}));

export default function Report() {
    const [tabActive, setTabActive] = useState(TABS[0].id);

    const handleChangeTab = (e, val) => {
        setTabActive(val);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <TabContext value={tabActive}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                        {TABS.map((item, i) => (
                            <Tab
                                key={i}
                                label={item.name}
                                value={item.id}/>
                        ))}
                    </TabList>
                </Box>
                {TABS.map(({id, component: Component}, i) => (
                    <Panel key={i} value={id} index={i}>
                        <Component/>
                    </Panel>
                ))}
            </TabContext>
        </Box>
    )
}