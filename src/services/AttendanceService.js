import {get, post, patch, del} from "../utils/api";

const API_URL = process.env.REACT_APP_API_URL;

const GetAttendances = async (params) => get(`${API_URL}/attendance`, params);

const GetAttendanceById = async (id) => get(`${API_URL}/attendance/${id}`);

const GetAttendanceUserToday = async () => get(`${API_URL}/attendance/today`);

const CreateAttendance = async (params) => post(`${API_URL}/attendance`, params);

const UpdateAttendance = async (id, params) => patch(`${API_URL}/attendance/${id}`, params);

const DeleteAttendance = async (id) => del(`${API_URL}/attendance/${id}`);

export const AttendanceService = {
    GetAttendances,
    GetAttendanceById,
    GetAttendanceUserToday,
    CreateAttendance,
    UpdateAttendance,
    DeleteAttendance
};