import {combineReducers, configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import {createBrowserHistory} from "history";
import {connectRouter, routerMiddleware} from "connected-react-router";
import rootSaga from "./sagas";
import reducers from "./slices/reducers";

export const history = createBrowserHistory();
const connectedRouterMiddleware = routerMiddleware(history);

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    ...reducers
})

const store = () => {
    const sagaMiddleware = createSagaMiddleware();

    const store = configureStore({
        reducer: createRootReducer(history),
        middleware: [sagaMiddleware, connectedRouterMiddleware],
    });

    sagaMiddleware.run(rootSaga);

    return store;
}

export default store();
