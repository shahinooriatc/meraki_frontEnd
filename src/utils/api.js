import axios from "axios";

export async function get(url, query) {
    const token = localStorage.getItem("merakihr-token");
    let queryString = "";

    if (query) {
        queryString = `?${new URLSearchParams(query).toString()}`;
    }

    return axios.get(url + queryString, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function post(url, data) {
    const token = localStorage.getItem("merakihr-token");

    const formData = new FormData();

    Object.keys(data).map(key => formData.append(key, data[key]));

    return axios.post(url, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
}

export async function patch(url, data) {
    const token = localStorage.getItem("merakihr-token");

    const formData = new FormData();

    Object.keys(data).map(key => formData.append(key, data[key]))

    return axios.patch(url, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
}

export async function del(url) {
    const token = localStorage.getItem("merakihr-token");

    return axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
}