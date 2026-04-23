import {
    GET_DATA_OVERTIME_SUCCESS,
    GET_DATA_OVERTIME_FAILURE,
    CREATE_DATA_OVERTIME_SUCCESS,
    CREATE_DATA_OVERTIME_FAILURE,
    DELETE_DATA_OVERTIME_SUCCESS,
    DELETE_DATA_OVERTIME_FAILURE
} from '../../action/dataOvertimeAction/dataOvertimeActionTypes';

const initialState = {
    dataOvertime: [],
    message: null,
    error: null
};

const dataOvertimeReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_OVERTIME_SUCCESS:
            return {
                ...state,
                dataOvertime: action.payload,
                message: null,
                error: null,
            };
        case GET_DATA_OVERTIME_FAILURE:
            return {
                ...state,
                error: action.payload,
                message: '',
            };
        case CREATE_DATA_OVERTIME_SUCCESS:
            return {
                ...state,
                message: null,
                error: null,
            };
        case CREATE_DATA_OVERTIME_FAILURE:
            return {
                ...state,
                error: action.payload,
                message: null,
            };
        case DELETE_DATA_OVERTIME_SUCCESS:
            return {
                ...state,
                message: action.payload,
                error: null,
            };
        case DELETE_DATA_OVERTIME_FAILURE:
            return {
                ...state,
                error: action.payload,
                message: null,
            };
        default:
            return state;
    }
};

export default dataOvertimeReducer;
