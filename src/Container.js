import {connect} from 'react-redux';
import {getActionCreator} from './ReactReduxApplication';

export default function Container(props) {
  let actionCreators = props.creators;
  let storeInit = props.store.init;

  return function(clazz) {
    let connectedClazz = connect(
      storeInit
    )(clazz);

    let constructor = function() {

      actionCreators.forEach((crName) => {
        let bean = getActionCreator(crName);

        if (bean == undefined) {
          throw new Error('bean is not defined, ' + crName);
        }

        Reflect.ownKeys(bean).forEach((prop) => {
          if (bean[prop].__action === true) {
            actions[prop] = (bean[prop]);
          }
        });
      });

      connectedClazz.prototype.constructor.apply(this, arguments);
    };

    inherits(constructor, connectedClazz);
    return constructor;
  }
}

function inherits(subClass, superClass) {
  subClass.prototype = Object.create(
    superClass && superClass.prototype,
    {
       constructor: {
         value: subClass,
         enumerable: false,
         writable: true,
         configurable: true
       }
    }
  );

  Object.setPrototypeOf(subClass, superClass);
}

