"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Reduce;
function Reduce(action) {
  return function (target, prop, descriptor) {
    descriptor.value.__reducer = {
      action: action
    };
  };
}