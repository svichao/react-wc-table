export const getHeaderStyleFromColumn = (column) => {
  const { header } = column;
  if (!header) return {};

  const style = {};

  if (header.align) {
    style.textAlign = header.align;
    if (header.align === 'right') {
      style.justifyContent = 'flex-end';
    } else if (header.align === 'center') {
      style.justifyContent = 'center';
    } else {
      style.justifyContent = 'flex-start';
    }
  }

  if (header.fontFamily) {
    style.fontFamily = header.fontFamily;
  }

  if (header.fontSize) {
    style.fontSize = `${header.fontSize}px`;
  }

  if (header.fontWeight) {
    style.fontWeight = header.fontWeight;
  }

  // if (header.height) {
  //   style.height = `${header.height}px`;
  // }

  if (header.color) {
    style.color = header.color;
  }

  if (header.bgColor) {
    style.backgroundColor = header.bgColor;
  }

  if (!header.show) {
    style.display = 'none';
  }

  return style;
};