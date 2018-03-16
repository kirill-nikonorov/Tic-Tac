import {render} from 'react-dom';
import React from "react"
import {createStore} from "redux";
import {Provider} from "react-redux"

import rootReducer from "./reducers/rootReducer"

import App from "./components/App";

let store = createStore(rootReducer);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
)


if (module.hot) {
    module.hot.accept()
}