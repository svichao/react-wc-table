import ReactBaseTable from "react-base-table"
import React, { useEffect } from "react"
function App(props) {
  console.log('props111: ', props);
  const {
    rowKey,
    container,
    columns = [],
    data = [],
    width,
    height,
    maxHeight,
    headerHeight=32,
    rowHeight=32,
    chartData,
    ...rest
  } = props
  console.log('container: ', container);
  console.log('chartData: ', chartData);


  useEffect(() => {
    console.log('props.chartData: ', props.chartData);
  }, [props.chartData]);

  useEffect(() => {
    console.log('props.chartData: ', props.chartData);
  }, [props.chartData]);
  

  return (
    <div className="bdlite-react-base-table-wrapper">
      <ReactBaseTable 
        rowKey={rowKey} 
        columns={columns}
        data={data}
        width={width}
        height={height}
        maxHeight={maxHeight}
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        {...rest}
      />
    </div>
  );
}

export default App;
