import { showLoading, hideLoading } from "../actions/loadingActions"
import store from "../store";

export function readFileContent(file) {

    return new Promise((resolve, reject) => {

        //store.dispatch(showLoading);
        if (!file)
            reject(new Error("file cannot be null"));

        let reader = new FileReader();

        reader.onload = (e) => {
            setTimeout(() => {
                resolve(e.target.result);
            }, 5000);
        }

        try {
            reader.readAsText(file);
        }
        catch (err) {
            reject(err);
        }
    });

}
