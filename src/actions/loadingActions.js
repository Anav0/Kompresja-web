import { SHOW_LOADING, HIDE_LOADING } from "../actions/types";

export const showLoading = (dispatch) => {
    dispatch({
        type: SHOW_LOADING,
        payload: true,
    })
}

export const hideLoading = (dispatch) => {
    dispatch({
        type: HIDE_LOADING,
        payload: false,
    })
}
