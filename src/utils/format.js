import { get, isNumber, isObject, isNull, isString } from "lodash-es";
import { getDateDisplayFormat } from "./dateSubTypes.js";
// import { FIELD_TYPE } from "@/views/dataModel/constants.js";
// import { fillZero } from "@/utils/index.js";
// import { METRIC_UNIT, DEFAULT_DECIMAL } from "@/views/dataModel/constants.js";
import dayjs from "./date.js";
// import { emptyDataMap } from "@/utils/index.js";
// const getCellVal = val => {
//   return emptyDataMap(isObject(val) ? val.d || val.v : val);
// };
// 通过colunmName获取对应的aliasName
export const getLinkFields = originLink => {
  return originLink.map(i => {
    return i.fieldId;
  });
};
// 添加符号
export const fillZero = (value = 0) => {
  if (value == 0) {
    return `00`;
  }
  if (value < 10) {
    return `0${value}`;
  }
  return value;
};

export const FIELD_TYPE = {
  STRING: "string",
  NUMBER: "number",
  DATETIME: "datetime",
  GEOGRAPHIC: "geographic",
};
export const DEFAULT_DECIMAL = "auto";

export const METRIC_UNIT = [
  { label: "无", value: "0", number: 1 },
  { label: "自动", value: DEFAULT_DECIMAL },
  { label: "千", value: "3", number: 1000 },
  { label: "万", value: "4", number: 10000 },
  { label: "百万", value: "6", number: 1000000 },
  { label: "千万", value: "7", number: 10000000 },
  { label: "亿", value: "8", number: 100000000 },
  { label: "万亿", value: "11", number: 1000000000000 },
  { label: "K", value: "9", number: 1000 },
  { label: "M", value: "10", number: 1000000 },
];
export const loop = input => {
  return emptyDataMap(isObject(input) ? input.d || input.v : input);
};

export const defaultFormat = value => {
  let localValue = +value;
  let label = "";
  if (localValue >= 10000 && localValue < 100000000) {
    localValue = +value / 10000;
    label = "万";
  } else if (localValue >= 100000000 && localValue < 1000000000000) {
    localValue = +value / 100000000;
    label = "亿";
  } else if (localValue >= 1000000000000) {
    localValue = value / 1000000000000;
    label = "万亿";
  }
  return [localValue, label];
};
// 空值映射
export const emptyDataMap = value => {
  if (isNull(value)) {
    return "{NULL}";
  } else if (isString(value) && value.trim() === "") {
    return "{空}";
  }
  return value;
};

const valueEum = (arr, unit) => {
  const current = arr.find(item => item.value == unit);
  if (parseInt(current.value)) {
    return current;
  } else {
    return {
      number: 1,
      label: "",
    };
  }
};
function toThousands(val) {
  if (!val) return "";
  let num = val.toString().split(".")[0],
    result = "";
  while (num.length > 3) {
    result = "," + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  val.toString().split(".")[1] && (result += `.${val.toString().split(".")[1]}`);
  return result;
}
// 转换小数
const transDecimal = (decimalNum, result) => {
  if (decimalNum === DEFAULT_DECIMAL) {
    const rounded = parseFloat(result.toFixed(2)); // 四舍五入保留两位小数
    return rounded % 1 === 0 ? Math.round(rounded) : rounded; // 如果是整数，返回整数部分，否则返回浮点数
  } else {
    return result.toFixed(Number(decimalNum));
  }
};
const transOriginValue = (unit, result) => {
  if (unit === DEFAULT_DECIMAL) {
    return defaultFormat(result);
  } else {
    const formateUnit = valueEum(METRIC_UNIT, unit, result);
    return [result / formateUnit.number, formateUnit.label];
  }
};
const transNumFormat = (value, { unit, decimalNum, suffix, prefix, money, prefixString, thousandths }) => {
  let [result, label] = transOriginValue(unit, value);
  // 小数点格式化
  result = transDecimal(decimalNum, result);

  if (thousandths) {
    result = toThousands(result);
  }
  let template = `${result}${label || ""}${suffix || ""}`,
    pre = "";
  pre = prefix == "money" ? `${money}` : prefix == "customize" ? `${prefixString} ` : "";
  template = pre + template;
  return template;
};
const transPercentFormat = (value, { decimalNum, thousandths }) => {
  let result = value * 100;
  if (decimalNum != DEFAULT_DECIMAL) {
    // 设置了小数位数
    result = result.toFixed(Number(decimalNum));
  }
  if (thousandths) {
    result = toThousands(result);
  }
  return result + "%";
};
const transTimeFormat = (value, { timetrans }) => {
  // timetrans: "1000" 毫秒转时分秒， timetrans: 1 秒转时分秒
  const time = dayjs.duration(value, timetrans === "1000" ? "milliseconds" : "seconds");
  const minutes = time.minutes();
  const seconds = time.seconds();
  return `${fillZero(parseInt(time.asHours()))}:${fillZero(minutes)}:${fillZero(seconds)}`;
};
export const FormatFn = type => {
  let fn = {};
  switch (type) {
    case "number":
      fn = transNumFormat;
      break;
    case "percent":
      fn = transPercentFormat;
      break;
    case "time":
      fn = transTimeFormat;
      break;
  }
  return fn;
};

export const getFormat = (columns = []) => {
  let res = {
    queue: {},
    get: fieldId => {
      return res.queue[fieldId] || loop;
    },
  };

  columns.forEach(element => {
    if (element) {
      if (get(element, "config.dataType.type", element.columnType) === FIELD_TYPE.NUMBER) {
        const { config = {} } = element;
        const { type, data } = config.format || {};
        const key = element.fieldId;
        if (type) {
          res.queue[key] = val => {
            const transVal = loop(val);
            if (isNumber(transVal)) {
              return FormatFn(type)(transVal, data);
            } else {
              return transVal;
            }
          };
        } else {
          res.queue[key] = loop;
        }
      } else if (get(element, "config.dataType.type", element.columnType) === FIELD_TYPE.DATETIME) {
        const { dateDisplayFormat, dstFormat } = element.config;
        if (dateDisplayFormat) {
          res.queue[element.fieldId] =
            (val => {
              const transVal = loop(val);
              if (dayjs(transVal).isValid()) {
                return getDateDisplayFormat(dstFormat, dateDisplayFormat)?.formatter(transVal);
              } else {
                return transVal;
              }
            }) || (val => loop(val));
        } else {
          res.queue[element.fieldId] = loop;
        }
      } else {
        res.queue[element.fieldId] = loop;
      }
    }
  });
  return res;
};
