'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Container;

var _reactRedux = require('react-redux');

var _booterDi = require('booter-di');

function Container(props) {
  var actionCreators = props.creators;
  var storeInit = props.store.init;

  return function (clazz) {
    var connectedClazz = (0, _reactRedux.connect)(storeInit)(clazz);

    var constructor = function constructor() {

      actionCreators.forEach(function (crName) {
        var bean = _booterDi.ApplicationContext.getContext().getBean(crName);

        if (bean == undefined) {
          throw new Error('bean is not defined, ' + crName);
        }

        Reflect.ownKeys(bean).forEach(function (prop) {
          if (bean[prop].__action === true) {
            actions[prop] = bean[prop];
          }
        });
      });

      connectedClazz.prototype.constructor.apply(this, arguments);
    };

    inherits(constructor, connectedClazz);
    return constructor;
  };
}

function inherits(subClass, superClass) {
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  Object.setPrototypeOf(subClass, superClass);
}