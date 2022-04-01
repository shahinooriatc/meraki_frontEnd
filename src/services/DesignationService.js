import {get, post, patch, del} from "../utils/api";

const API_URL = process.env.REACT_APP_API_URL;

const GetDesignations = async (params) => get(`${API_URL}/designation`, params);

const GetDesignationById = async (id) => get(`${API_URL}/designation/${id}`);

const CreateDesignation = async (params) => post(`${API_URL}/designation`, params);

const UpdateDesignation = async (id, params) => patch(`${API_URL}/designation/${id}`, params);

const DeleteDesignation = async (id) => del(`${API_URL}/designation/${id}`);

export const DesignationService = {
    GetDesignations,
    GetDesignationById,
    CreateDesignation,
    UpdateDesignation,
    DeleteDesignation
};
