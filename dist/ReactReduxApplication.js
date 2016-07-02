'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ReactReduxApplication;

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _booterDi = require('booter-di');

var store = void 0;
var creators = {};

function ReactReduxApplication(props) {
  console.log('running app as ReactReduxApplication');

  var reducers = props.reducers;
  creators = props.creators;

  Object.keys(creators).forEach(function (name) {
    _booterDi.ApplicationContext.getContext().provideBean(name, creators[name]);
  });

  var reducersFns = {};

  Object.keys(reducers).forEach(function (reducerName) {
    var reducer = reducers[reducerName];
    var methods = {};
    Reflect.ownKeys(reducer).filter(function (key) {
      return reducer[key].__reducer !== undefined;
    }).forEach(function (key) {
      methods[reducer[key].__rducer.action] = reducer[key];
    });

    reducersFns[reducerName] = wrapReducerMethods(methods);
  });

  // TODO: inherit
  return function (clazz) {
    var reduxRouterMiddleware = (0, _reactRouterRedux.routerMiddleware)();
    var middleware = [reduxRouterMiddleware];

    var wrappderCreateStoreFn = _redux.applyMiddleware.apply(undefined, middleware)(_redux.createStore);

    store = wrappderCreateStoreFn((0, _redux.combineReducers)(reducersFns));
    return clazz;
  };
}

function wrapReducerMethods(actionHandlers) {
  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments[1];

    if (actionHandlers[action.type] == undefined) {
      return state;
    }
    return actionHandlers[action.type](state, action);
  };
}