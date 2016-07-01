export default function Spawn(name) {
  return function(target, prop, descriptor) {
    descriptor.value.__action = true;
  };
}

