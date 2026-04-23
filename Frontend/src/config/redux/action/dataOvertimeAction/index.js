import axios from 'axios';
import {
    GET_DATA_OVERTIME_SUCCESS,
    GET_DATA_OVERTIME_FAILURE,
    CREATE_DATA_OVERTIME_SUCCESS,
    CREATE_DATA_OVERTIME_FAILURE,
    DELETE_DATA_OVERTIME_SUCCESS,
    DELETE_DATA_OVERTIME_FAILURE
} from './dataOvertimeActionTypes';

const API_URL = 'http://localhost:5000';

export const getDataOvertime = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/data_overtime`);
            dispatch({
                type: GET_DATA_OVERTIME_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_OVERTIME_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createDataOvertime = (data, navigate) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`${API_URL}/data_overtime`, data);
            dispatch({
                type: CREATE_DATA_OVERTIME_SUCCESS,
                payload: response.data
            });
            return response;
        } catch (error) {
            dispatch({
                type: CREATE_DATA_OVERTIME_FAILURE,
                payload: error.response ? error.response.data.msg : error.message
            });
            throw error;
        }
    };
};

export const deleteDataOvertime = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/data_overtime/${id}`);
            dispatch({
                type: DELETE_DATA_OVERTIME_SUCCESS,
                payload: response.data.msg
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_OVERTIME_FAILURE,
                payload: error.message
            });
        }
    };
};
