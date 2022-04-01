import {AccountCircleOutlined, AssignmentOutlined, DraftsOutlined, InsertDriveFileOutlined} from "@mui/icons-material";
import BasicInformation from "../components/Form/BasicInformation";
import AccountSetting from "../components/Form/AccountSetting";
import LeaveHistory from "../components/Form/Leave";
import Attendance from "../components/Form/Attendance";

const menus = [
    {
        id: 'basic',
        name: 'Basic Information',
        icon: InsertDriveFileOutlined,
        component: BasicInformation
    },
    {
        id: 'account',
        name: 'Account Setting',
        icon: AccountCircleOutlined,
        component: AccountSetting
    },
    {
        id: 'attendance',
        name: 'Attendance',
        icon: AssignmentOutlined,
        component: Attendance
    },
    {
        id: 'leave',
        name: 'Leave',
        icon: DraftsOutlined,
        component: LeaveHistory
    }
];

export default menus;