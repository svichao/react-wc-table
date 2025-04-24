import React from 'react';
import Text from 'react-texty';
import 'react-texty/styles.css';

const Ellipsis = (props) => {
  const { ellipsis, style, children, ...rest } = props;
  if (ellipsis && ellipsis.tooltip) {
    return (
      <Text
        tooltip={ellipsis.tooltip}
        style={{ ...style, fontSize: 'inherit' }}
      >
        {children}
      </Text>
    );
  }
  return (
    <div
      className="bdlite-react-base-table-ellipsis"
      style={{
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Ellipsis;
