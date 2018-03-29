import {render} from "react-dom";
import React from "react";
import {createStore ,applyMiddleware } from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";


import rootReducer from "./reducers/rootReducer";

import App from "./components/App";

let store = createStore(rootReducer ,applyMiddleware(thunk));

render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById("root")
);


