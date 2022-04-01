import {get, post, patch, del} from "../utils/api";

const API_URL = process.env.REACT_APP_API_URL;

const GetDepartments = async (params) => get(`${API_URL}/department`, params);

const GetDepartmentById = async (id) => get(`${API_URL}/department/${id}`);

const CreateDepartment = async (params) => post(`${API_URL}/department`, params);

const UpdateDepartment = async (id, params) => patch(`${API_URL}/department/${id}`, params);

const DeleteDepartment = async (id) => del(`${API_URL}/department/${id}`);

export const DepartmentService = {
    GetDepartments,
    GetDepartmentById,
    CreateDepartment,
    UpdateDepartment,
    DeleteDepartment
};
