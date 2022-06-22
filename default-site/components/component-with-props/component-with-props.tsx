import React from "react";
import PropTypes from "prop-types";

export default function ComponentWithProps({ components }) {
  console.log("components", components);

  return (
    <div>
      Components with props
      {components.map(({ title, component }) => (
        <div className="wrapper">
          <div className="title">{title}</div>
          {component}
        </div>
      ))}
    </div>
  );
}

ComponentWithProps.propTypes = {
  components: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string,
      element: PropTypes.element,
    }),
  ),
};
