import { Children, isValidElement, cloneElement } from "react";

function CloneComponents({ components, children, ...props }) {
  return Children.map(components, (component) => {
    if (isValidElement(component)) {
      return cloneElement(component, {
        ...component.props,
        children,
        ...props,
      });
    }
    return component;
  });
}

export default CloneComponents;
