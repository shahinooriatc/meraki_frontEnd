import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Login = async (params) => axios.post(`${API_URL}/login`, params);

export const AuthService = {
    Login
};
