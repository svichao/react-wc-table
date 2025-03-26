import { getHeaderStyleFromColumn } from './config';


const DefaultHeaderRenderer = ({ cells, columns, headerIndex }) => {
  console.log('cells, columns, headerIndex: ', cells, columns, headerIndex);
  columns.forEach((column, columnIndex) => {
    cells[columnIndex].props.style={
      ...cells[columnIndex].props.style,
      ...getHeaderStyleFromColumn(column)
    }
  })
  return cells
};
export default DefaultHeaderRenderer;