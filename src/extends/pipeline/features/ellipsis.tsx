// @ts-nocheck
import Typography from 'antd/es/typography';
import React from 'react';

const { Text } = Typography;

const Ellipsis = (props) => {
  const { ellipsis, style, children, ...rest } = props;
  if (ellipsis && ellipsis.tooltip) {
    return (
      <Text ellipsis={ellipsis} style={{ ...style }}>
        {children}
      </Text>
    );
  }
  return (
    <div
      className="bdlite-react-base-table-ellipsis"
      style={{
        width: '100%',
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
