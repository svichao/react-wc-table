import { isUndefined } from 'lodash-es';

/**
 * Description
 * @param {any} type
 * @param {any} item
 * @returns {any}
 */
const numberFunctionList = [
  (base) => (num) => num > base,
  (base) => (num) => num >= base,
  (base) => (num) => num < base,
  (base) => (num) => num <= base,
  (base) => (num) => num === base,
  (base) => (num) => num !== base,
];

const stringFunctionList = [
  (base) => (str) => str.indexOf(base) !== -1,
  (base) => (str) => str.indexOf(base) === -1,
  (base) => (str) => str.startsWith(base),
  (base) => (str) => str.endsWith(base),
  (base) => (str) => str === base,
  (base) => (str) => str !== base,
];

export const getCheckFunc = (type, item) => {
  if (type === 'number') {
    // 计算number
    if (item.type == 99) {
      const { left, right, leftNum, rightNum } = item.values;
      return (num) => {
        let leftSuc = left === 'l' ? num > leftNum : num >= leftNum;
        let rightSuc = right === 'l' ? num < rightNum : num <= rightNum;
        return leftSuc && rightSuc;
      };
    } else {
      return numberFunctionList[Number(item.type)](item.value);
    }
  } else {
    //
    return stringFunctionList[Number(item.type)](item.value);
  }
};

export const getStyle = (value, func) => {
  if (!func || !Array.isArray(func)) return;

  let v = typeof value === 'object' ? value?.v : value;

  for (const checkCore of func) {
    if (!isUndefined(v) && v !== null && checkCore.check(v)) {
      return checkCore.style;
    }
  }

  return null;
};

function getTargetNum(tableData, field, mode = 'colorStep') {
  const { min, max, mid } =
    mode == 'colorStep'
      ? field.condition.colorStepData.colorSetting
      : field.condition.numberBar;

  let calcMin = null;
  let calcMax = null;
  let calcMidAvg = null;
  let sum = 0;
  let count = 0;

  tableData.forEach((row) => {
    let val = row[field.fieldId].v;
    if (val === null) return;
    if (calcMin === null || val < calcMin) {
      calcMin = val;
    }
    if (calcMax === null || val > calcMax) {
      calcMax = val;
    }

    sum += val;
    count++;
  });

  calcMidAvg = sum / count;

  return {
    targetMin: min.type === 'fixed' ? min.value : calcMin,
    targetMax: max.type === 'fixed' ? max.value : calcMax,
    targetMid: mid?.type === 'fixed' ? mid.value : calcMidAvg,
  };
}

function calcColor(val, { targetMax, targetMin, targetMid }, condition) {
  const { colorList, colorSetting } = condition.colorStepData;
  const { pointNum, emptyColor: emptyType, customColor } = colorSetting;

  // 空值映射
  if (val === null || val === '-' || val === '' || val === undefined) {
    switch (emptyType) {
      case 'custom':
        return customColor;
      case 'none':
        return null;
      case 'zero':
        return colorList[0];
      default:
        return null;
    }
  }

  if (val === Number(val)) {
    if (val < targetMin) {
      // 小于最小值
      return colorList[0];
    } else if (val > targetMax) {
      // 大于最大值
      return colorList[colorList.length - 1];
    } else {
      // colorList 十六进制转换成rgb数组 colorList 变成了一个二维数组
      let colorListRGB = colorList.map((color) => {
        return color.match(/[\da-f]{2}/gi).map((val) => parseInt(val, 16));
      });

      if (pointNum === 2) {
        return insertColor(colorListRGB, val, targetMin, targetMax);
      } else {
        if (val < targetMid) {
          return insertColor(
            [colorListRGB[0], colorListRGB[1]],
            val,
            targetMin,
            targetMid,
          );
        } else if (val > targetMid) {
          return insertColor(
            [colorListRGB[1], colorListRGB[2]],
            val,
            targetMid,
            targetMax,
          );
        } else {
          return colorList[1];
        }
      }
    }
  }
}

const insertColor = (colorList, val, left, right) => {
  // 颜色插值算法算出颜色
  // 计算val 插入targetMin 和 targetMax 之间的位置
  let position = (val - left) / (right - left);
  // 计算目标RGB
  let target_R = parseInt(
    (colorList[1][0] - colorList[0][0]) * position + colorList[0][0],
  );
  let target_G = parseInt(
    (colorList[1][1] - colorList[0][1]) * position + colorList[0][1],
  );
  let target_B = parseInt(
    (colorList[1][2] - colorList[0][2]) * position + colorList[0][2],
  );
  // 转换成16进制, 自动补0
  return [target_R, target_G, target_B].reduce(
    (acc, val) => acc + val.toString(16).padStart(2, '0'),
    '#',
  );
};

const getMApping = (fields, options) => {
  let backMapping = [],
    textMapping = [],
    iconMapping = [],
    numberMapping = {};

  const { disableRowIndex = 1, tableData } = options || {};

  fields.forEach((field) => {
    // 获取到具体字段
    const { condition, fieldId } = field;

    if (!condition) return;
    // 判断type
    const { mode, numberBar } = condition;
    let checkList = [];
    if (['txb', 'icon'].includes(mode)) {
      // 这两种类型有相同的判断逻辑需要获取具体的val to style函数
      let type =
        field?.config?.dataType?.type === 'number' ? 'number' : 'string';
      let originCondition =
        mode === 'txb' ? condition.list : condition.iconConditionList;
      originCondition.forEach((item) => {
        checkList.push({
          check: getCheckFunc(type, item),
          style: item.style,
        });
      });
    }
    // 计算值的范围
    let paramsForColorStep = {};
    if (mode === 'colorStep') {
      paramsForColorStep = getTargetNum(tableData, field);
    } else if (mode === 'numberBar') {
      paramsForColorStep = getTargetNum(tableData, field, 'numberBar');
    }

    // 针对单个字段的判断
    switch (mode) {
      case 'txb': // 文本和颜色
        // 有数据但是没有打开
        if (!condition.show) return;

        backMapping.push({
          field: fieldId,
          mapping: (val, data) => {
            if (data.isLeaf) return null;
            if (data.rowIndex <= disableRowIndex) return null;
            let conditionStyle = getStyle(val, checkList);
            if (conditionStyle) {
              return {
                fill: conditionStyle?.backgroundColor,
              };
            } else {
              return null;
            }
          },
        });

        textMapping.push({
          field: fieldId,
          mapping: (val, data) => {
            if (data.isLeaf) return null;
            if (data.rowIndex <= disableRowIndex) return null;
            let conditionStyle = getStyle(val, checkList);
            if (conditionStyle) {
              return {
                fill: conditionStyle?.color,
              };
            } else {
              return null;
            }
          },
        });

        break;
      case 'icon':
        iconMapping.push({
          field: fieldId,
          position: 'left',
          mapping: (val, data) => {
            if (data.isLeaf) return null;
            if (data.rowIndex <= disableRowIndex) return {}; // TODO: 这里可以加上header的样式
            let conditionStyle = getStyle(val, checkList);
            if (conditionStyle) {
              return {
                icon: conditionStyle?.iconName,
              };
            } else {
              return {};
            }
          },
        });
        break;
      case 'colorStep':
        // 计算最大值, 最小值, 中间值
        // 判断两色渐变还是三色渐变
        // 三色渐变的话需要计算中间值
        // 将val 通过插值算法计算出对应的颜色
        backMapping.push({
          field: fieldId,
          mapping: (val, data) => {
            if (data.isLeaf) return null;
            if (data.colIndex <= disableRowIndex) return null;
            let conditionStyle = calcColor(
              val.v,
              paramsForColorStep,
              condition,
            );

            if (conditionStyle) {
              return {
                fill: conditionStyle,
              };
            } else {
              return null;
            }
          },
        });

        break;
      case 'numberBar':
        numberMapping[fieldId] = {
          mapping: (val) => {
            if (val === null || val === undefined) return null;

            let renderVal = val;
            if (renderVal === null) return null;

            const { targetMin, targetMax } = paramsForColorStep;
            if (renderVal < targetMin) renderVal = targetMin;
            if (renderVal > targetMax) renderVal = targetMax;

            // 分割线位置
            let gapLine = ((0 - targetMin) * 100) / (targetMax - targetMin);
            if (gapLine < 0) gapLine = 0;
            if (gapLine > 100) gapLine = 100;

            // 将最大值和最小值映射到0-100
            // 计算有问题
            let percent =
              ((renderVal - targetMin) / (targetMax - targetMin)) * 100;
            if (renderVal >= 0) {
              percent =
                (Math.abs(renderVal - Math.max(0, targetMin)) /
                  (targetMax - targetMin)) *
                100;
            } else {
              percent =
                (Math.abs(Math.min(0, targetMax) - renderVal) /
                  (targetMax - targetMin)) *
                100;
            }

            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            // 如果是负数 将rect右边界渲染到分割线
            // 如果是正数 将rect左边界渲染到分割线
            return {
              percent, // 数据条百分比
              color:
                renderVal > 0 ? numberBar.barColor[0] : numberBar.barColor[1], // 数据条颜色
              gapLine,
              lineColor: numberBar.lineColor, // 分割线颜色
            };
          },
        };
        // 具体内容在这里配置但是不在这里渲染
        break;
      default:
        return;
    }
  });

  return {
    backMapping,
    textMapping,
    iconMapping,
    numberMapping,
  };
};
const getBarWidth = (percent, full) => {
  return (percent * full) / 100;
};

export { getMApping, getBarWidth };
