import { combineReducers } from "redux";
import loadingReducer from "./loadingReducer";
import snackBarReducer from "./snackbarReducer";

export default combineReducers({
    loading: loadingReducer,
    snackbar: snackBarReducer
})