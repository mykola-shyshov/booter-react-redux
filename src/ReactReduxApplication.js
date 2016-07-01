import {createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {context} from 'booter-di';

let store;
let creators = {};

export default function ReactReduxApplication(props) {
  console.log('ReactReduxApplication');

  let reducers = props.reducers;
  creators = props.creators;

  Object.keys(creators).forEach((name) => {
    context.provideBean(name, creators[name]);
  });

  let reducersFns = {};

  Object.keys(reducers).forEach((reducerName) => {
    let reducer = reducers[reducerName];
    let methods = {};
    Reflect.ownKeys(reducer).filter((key) => {
      return reducer[key].__reducer !== undefined;
    }).forEach((key) => {
      methods[reducer[key].__rducer.action] = reducer[key];
    });

    console.log('methods', methods);
    reducersFns[reducerName] = wrapReducerMethods(methods);
  });

  console.log('reducers fns', reducersFns);

  // TODO: inherit
  return function(clazz) {
    let reduxRouterMiddleware = routerMiddleware();
    let middleware = [reduxRouterMiddleware];

    let wrappderCreateStoreFn = applyMiddleware(...middleware)(createStore);

    store = wrappderCreateStoreFn(combineReducers(reducersFns));
    return clazz;
  }
}

export function getActionCreator(name) {
  return context.getBean(name);
}

function wrapReducerMethods(actionHandlers) {
  return function(state = {}, action) {
    if (actionHandlers[action.type] == undefined) {
       return state;
    }
    return actionHandlers[action.type](state, action);
  }
}


