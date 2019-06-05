import { SHOW_SNACKBAR, HIDE_SNACKBAR } from "./types";

export const showSnackbar = (message, variant, duration = 2000) => (dispatch) => {
    dispatch({
        type: SHOW_SNACKBAR,
        payload: {
            variant: variant,
            duration: duration,
            message: message
        },
    })
};
export const hideSnackbar = (dispatch) => {
    dispatch({
        type: HIDE_SNACKBAR,
    })
};
