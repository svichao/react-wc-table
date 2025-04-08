import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

const duration = require("dayjs/plugin/duration");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const quarterOfYear = require("dayjs/plugin/quarterOfYear");
const weekYear = require("dayjs/plugin/weekYear"); // dependent on weekOfYear plugin
const weekOfYear = require("dayjs/plugin/weekOfYear");
const isoWeek = require("dayjs/plugin/isoWeek"); // 引入 ISO 周插件

dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
export default dayjs;
