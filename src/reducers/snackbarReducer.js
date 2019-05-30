import { SHOW_SNACKBAR, HIDE_SNACKBAR } from "../actions";

const initialState = {
    message: "",
    variant: "error",
    duration: 0,
    isVisible: false,
}

export default function showSnackbar(state = initialState, action) {

    switch (action.type) {
        case SHOW_SNACKBAR:
            if (action.payload) {
                return {
                    ...state,
                    ...action.payload,
                    isVisible: true
                }
            }
            break;
        case HIDE_SNACKBAR:
            return {
                ...state,
                isVisible: false
            }
        default:
            break;
    }

    if (!state)
        throw new Error("State cannot be null")

    return state;
}