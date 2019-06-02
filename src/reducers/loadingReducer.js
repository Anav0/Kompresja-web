import { SHOW_LOADING, HIDE_LOADING } from "../actions";

const initialState = {
    isLoading: false
}

export default function loading(state = initialState, action) {

    switch (action.type) {
        case SHOW_LOADING:
        case HIDE_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    }
}