"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Spawn;
function Spawn(name) {
  return function (target, prop, descriptor) {
    descriptor.value.__action = true;
  };
}