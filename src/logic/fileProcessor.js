import { showLoading, hideLoading, showSnackbar } from "../actions"
import store from "../store";

export function readFileContent(file) {

    return new Promise((resolve, reject) => {

        store.dispatch(showLoading);
        if (!file)
            reject(new Error("file cannot be null"));

        let reader = new FileReader();

        reader.onload = (e) => {
            setTimeout(() => {
                store.dispatch(hideLoading);
                store.dispatch(showSnackbar("Kompresja zakończona","info"))
                resolve(e.target.result);
            }, 1000);
        }

        try {
            reader.readAsText(file);
        }
        catch (err) {
            reject(err);
        }
    });

}
