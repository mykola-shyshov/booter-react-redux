export function Reduce(action) {
  return function(target, prop, descriptor) {
    descriptor.value.__reducer = {
      action: action
    };
  };
}

