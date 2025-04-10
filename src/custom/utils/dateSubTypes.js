import dayjs from './date.js';

const quarterNames = ['第一季度', '第二季度', '第三季度', '第四季度'];
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const loop = (n, type, format) => {
  let str = [];
  for (let index = 0; index < n; index++) {
    str.push(dayjs().subtract(index, type).format(format));
  }
  return str.join('、');
};
const transfromWeekDate = (input, isJumpYear) => {
  const [year, week] = input.split('-'); // 拆分输入字符串
  const endOfYear = dayjs(`${year}-12-31`, 'YYYY-MM-DD');

  // 获取该周的开始日期和结束日期
  const startOfWeek = dayjs().isoWeek(week).year(year).startOf('isoWeek');
  let endOfWeek = dayjs().isoWeek(week).year(year).endOf('isoWeek');
  // 如果结束日期跨年，则将结束日期调整为该年的最后一天
  if (!isJumpYear && endOfWeek.isAfter(endOfYear)) {
    endOfWeek = endOfYear;
  }
  return {
    startOfWeek,
    endOfWeek,
    year,
    week,
  };
};
const yearWeekDateDisplayFormat = (isJumpYear = true) => {
  return [
    {
      label: '2001-11周',
      value: 'YYYY-WW-week',
      formatter: (input) => `${input}周`,
    },
    {
      label: '2001-11周(03/12~03/18)',
      value: 'YYYY-WW-week-interval',
      formatter: (input) => {
        const { startOfWeek, endOfWeek, year, week } = transfromWeekDate(
          input,
          isJumpYear,
        );
        return `${year}-${week}周(${startOfWeek.format(
          'MM-DD',
        )}~${endOfWeek.format('MM-DD')})`;
      },
    },
    {
      label: '2001(03/12~03/18)',
      value: 'YYYY-week~interval',
      formatter: (input) => {
        const { startOfWeek, endOfWeek, year } = transfromWeekDate(
          input,
          isJumpYear,
        );
        return `${year}(${startOfWeek.format('MM/DD')}~${endOfWeek.format(
          'MM/DD',
        )})`;
      },
    },
    {
      label: '2001-03-12~2001-03-18',
      value: 'YYYY-MM-DD~YYYY-MM-DD',
      formatter: (input) => {
        const { startOfWeek, endOfWeek } = transfromWeekDate(input, isJumpYear);
        return `${startOfWeek.format('YYYY-MM-DD')}~${endOfWeek.format(
          'YYYY-MM-DD',
        )}`;
      },
    },
    {
      label: '2001/03/12~2001/03/18',
      value: 'YYYY/MM/DD~YYYY/MM/DD',
      formatter: (input) => {
        const { startOfWeek, endOfWeek } = transfromWeekDate(input, isJumpYear);
        return `${startOfWeek.format('YYYY/MM/DD')}~${endOfWeek.format(
          'YYYY/MM/DD',
        )}`;
      },
    },
    {
      label: '03/12~03/18',
      value: 'MM/DD~MM/DD',
      formatter: (input) => {
        const { startOfWeek, endOfWeek } = transfromWeekDate(input, isJumpYear);
        return `${startOfWeek.format('MM/DD')}~${endOfWeek.format('MM/DD')}`;
      },
    },
    {
      label: '03-12~03-18',
      value: 'MM-DD~MM-DD',
      formatter: (input) => {
        const { startOfWeek, endOfWeek } = transfromWeekDate(input, isJumpYear);
        return `${startOfWeek.format('MM-DD')}~${endOfWeek.format('MM-DD')}`;
      },
    },
  ];
};
const getYearWeekRange = (index) => {
  return [
    dayjs()
      .subtract(index * 7, 'day')
      .format('YYYY'),
    dayjs()
      .subtract(index * 7, 'day')
      .format('YYYY-MM-DD'),
  ];
};
export const YEAR = {
  value: 'year',
  label: '年',
  formatter: (n = 0) => {
    return loop(n, 'year', 'YYYY');
  },
  dateDisplayFormat: [
    {
      label: '2001',
      value: `YYYY`,
      formatter: (val) => `${val}`,
    },
    {
      label: '2001年',
      value: `YYYY-year`,
      formatter: (val) => `${val}年`,
    },
    {
      label: '01年',
      value: `YY-year`,
      formatter: (val) => dayjs(val).format('YY年'),
    },
    {
      label: '01',
      value: `YY`,
      formatter: (val) => dayjs(val).format('YY'),
    },
  ],
};
export const YEAR_QUARTER = {
  label: '年-季度',
  value: 'quarter',
  // disabled: true,
  formatter: (n = 0) => {
    let str = [`${dayjs().year()}-${dayjs().quarter()}`];
    for (let index = 1; index < n; index++) {
      let curYear = dayjs()
        .subtract(index * 3, 'month')
        .format('YYYY');
      let preQuarterMonth = dayjs()
        .subtract(index * 3, 'month')
        .format('YYYY-MM');
      str.push(`${curYear}-${dayjs(preQuarterMonth).quarter()}`);
    }
    return str.join('、');
  },
  dateDisplayFormat: [
    {
      label: '2001-Q1',
      value: `YYYY-quarter`,
      formatter: (input) => {
        const [year, quarter] = input.split('-'); // 解析出年份和季度
        return `${year}-Q${quarter}`;
      },
    },
    {
      label: '2001年第一季度',
      value: `YYYY-year-quarter`,
      formatter: (input) => {
        const [year, quarter] = input.split('-'); // 解析出年份和季度
        return `${year}年${quarterNames[quarter - 1]}`;
      },
    },
  ],
};
export const YEAR_MONTH = {
  label: '年-月',
  value: 'month',
  formatter: (n = 0) => {
    return loop(n, 'month', 'YYYY-MM');
  },
  dateDisplayFormat: [
    {
      label: '2001-03',
      value: 'YYYY-MM',
      formatter: (input) => dayjs(input).format('YYYY-MM'),
    },
    {
      label: '2001/03',
      value: `YYYY/MM`,
      formatter: (input) => dayjs(input).format('YYYY/MM'),
    },
    {
      label: '03-2001',
      value: 'MM-YYYY',
      formatter: (input) => dayjs(input).format('MM-YYYY'),
    },
    {
      label: '03/2001',
      value: 'MM/YYYY',
      formatter: (input) => dayjs(input).format('MM/YYYY'),
    },
    {
      label: '2001年3月',
      value: 'YYYY-year-M-month',
      formatter: (input) => dayjs(input).format('YYYY年M月'),
    },
  ],
};

export const YEAR_WEEK = {
  label: '年-周(跨年)',
  value: 'week',
  // disabled: true,
  formatter: (n = 0) => {
    let str = [];
    for (let index = 0; index < n; index++) {
      const [curYear, preWeek] = getYearWeekRange(index);
      str.push(`${curYear}-${dayjs(preWeek).week()}`);
    }
    return str.join('、');
  },
  dateDisplayFormat: yearWeekDateDisplayFormat(true),
};
export const WEEK_NO_YEAR = {
  label: '年-周(不跨年)',
  value: 'weekNoYear',
  // disabled: true,
  formatter: (n = 0) => {
    let str = [];
    for (let index = 0; index < n; index++) {
      const [curYear, preWeek] = getYearWeekRange(index);
      str.push(`${curYear}-${dayjs(preWeek).week()}`);
    }
    return str.join('、');
  },
  dateDisplayFormat: yearWeekDateDisplayFormat(false),
};
export const YEAR_MONTH_DAY = {
  label: '年-月-日',
  value: 'day',
  formatter: (n = 0) => {
    return loop(n, 'day', 'YYYY-MM-DD');
  },
  dateDisplayFormat: [
    {
      label: '2001-03-11',
      value: 'YYYY-MM-DD',
      formatter: (input) => dayjs(input).format('YYYY-MM-DD'),
    },
    {
      label: '2001/03/11',
      value: 'YYYY/MM/DD',
      formatter: (input) => dayjs(input).format('YYYY/MM/DD'),
    },
    {
      label: '03-14-2001',
      value: 'MM-DD-YYYY',
      formatter: (input) => dayjs(input).format('MM-DD-YYYY'),
    },
    {
      label: '2001年3月14日',
      value: 'YYYY-year-MM-month-DD-day',
      formatter: (input) => dayjs(input).format('YYYY年MM月DD日'),
    },
    {
      label: '2001年3月14日,周三',
      value: 'YYYY-year-MM-month-DD-day,week',
      formatter: (input) => {
        const date = dayjs(input);
        const weekDay = weekDays[date.day()]; // 获取对应的中文星期
        return `${date.format('YYYY年MM月DD日')},${weekDay}`;
      },
    },
    {
      label: '03-14,周三',
      value: 'MM-month-DD-day,week',
      formatter: (input) => {
        const date = dayjs(input);
        const weekDay = weekDays[date.day()]; // 获取对应的中文星期
        return `${date.format('MM-DD')},${weekDay}`;
      },
    },
    {
      label: '03-14',
      value: 'MM-DD',
      formatter: (input) => dayjs(input).format('MM-DD'),
    },
    {
      label: '3月14日',
      value: 'MM-month-DD-day',
      formatter: (input) => dayjs(input).format('MM月DD日'),
    },
  ],
};
export const YEAR_MONTH_DAY_HOUR = {
  label: '年-月-日-时',
  value: 'hour',
  // disabled: true,
  formatter: (n = 0) => {
    return loop(n, 'hour', 'YYYY-MM-DD H');
  },
  dateDisplayFormat: [
    {
      label: '2001-03-14 13',
      value: 'YYYY-MM-DD h',
      formatter: (input) => dayjs(input).format('YYYY-MM-DD H'),
    },
    {
      label: '2001/03/14 13',
      value: 'YYYY/MM/DD H',
      formatter: (input) => dayjs(input).format('YYYY/MM/DD H'),
    },
    {
      label: '13',
      value: 'h',
      formatter: (input) => dayjs(input).format('H'),
    },
    {
      label: '1 PM',
      value: 'h A',
      formatter: (input) => {
        const hour = dayjs(input).hour();
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour > 12 ? hour - 12 : hour; // 转换为12小时制
        return `${formattedHour} ${period}`;
      },
    },
    {
      label: '下午1时',
      value: 'A h时',
      formatter: (input) => dayjs(input).format('Ah时'),
    },
  ],
};
export const YEAR_MONTH_DAY_HOUR_MINUTE = {
  label: '年-月-日-时-分',
  value: 'minute',
  // disabled: true,
  formatter: (n = 0) => {
    return loop(n, 'minute', 'YYYY-MM-DD HH-MM');
  },
  dateDisplayFormat: [
    {
      label: '2001-03-14 13:14',
      value: 'YYYY-MM-DD hh:mm',
      formatter: (input) => dayjs(input).format('YYYY-MM-DD HH:MM'),
    },
    {
      label: '2001/03/14 13:14',
      value: 'YYYY/MM/DD hh:mm',
      formatter: (input) => dayjs(input).format('YYYY/MM/DD HH:MM'),
    },
    {
      label: '13:14',
      value: 'hh:mm',
      formatter: (input) => dayjs(input).format('HH:MM'),
    },
    {
      label: '13时14分',
      value: 'hh时mm分',
      formatter: (input) => dayjs(input).format('HH时MM分'),
    },
    {
      label: '01:14 PM',
      value: 'hh:mm PM',
      formatter: (input) => {
        const date = dayjs(input);
        const period = date.hour() >= 12 ? 'PM' : 'AM';
        return `${date.format('hh:mm')} ${period}`;
      },
    },
    {
      label: '下午1时14分',
      value: 'A hh mm',
      formatter: (input) => dayjs(input).format('Ah时mm分'),
    },
  ],
};
export const YEAR_MONTH_DAY_HOUR_MINUTE_SECOND = {
  label: '年-月-日-时-分-秒',
  value: 'second',
  // disabled: true,
  formatter: (n = 0) => {
    return loop(n, 'second', 'YYYY-MM-DD HH-MM-SS');
  },
  dateDisplayFormat: [
    {
      label: '2001-03-14 13:14:01',
      value: 'YYYY-MM-DD hh:mm:ss',
      formatter: (input) => dayjs(input).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      label: '2001/03/14 13:14:01',
      value: 'YYYY/MM/DD hh:mm:ss',
      formatter: (input) => dayjs(input).format('YYYY/MM/DD HH:mm:ss'),
    },
    {
      label: '13:14:01',
      value: 'hh:mm:ss',
      formatter: (input) => dayjs(input).format('HH:mm:ss'),
    },
    {
      label: '13时14分01秒',
      value: 'hh时mm分ss秒',
      formatter: (input) => dayjs(input).format('HH时mm分ss秒'),
    },
    {
      label: '01:14:01 PM',
      value: 'hh:mm:ss A',
      formatter: (input) => {
        const date = dayjs(input);
        const period = date.hour() >= 12 ? 'PM' : 'AM';
        return `${date.format('hh:mm:ss')} ${period}`;
      },
    },
    {
      label: '下午1时14分01秒',
      value: '下午hh:mm分ss秒',
      formatter: (input) => dayjs(input).format('AHH时mm分ss秒'),
    },
  ],
};

const list = [
  {
    ...YEAR,
  },
  {
    ...YEAR_QUARTER,
  },
  {
    ...YEAR_MONTH,
  },
  {
    ...YEAR_WEEK,
  },
  {
    ...WEEK_NO_YEAR,
  },
  {
    ...YEAR_MONTH_DAY,
  },
  {
    ...YEAR_MONTH_DAY_HOUR,
  },
  {
    ...YEAR_MONTH_DAY_HOUR_MINUTE,
  },
  {
    ...YEAR_MONTH_DAY_HOUR_MINUTE_SECOND,
  },
];
export default list;
// 获取时间粒度
// 参考如下的规则
// https://day.js.org/docs/en/display/format
export const getDateGranularity = (dateFormatter = '') => {
  if (dateFormatter.endsWith('s')) {
    return list;
  } else if (['mm', 'm'].some((item) => dateFormatter.includes(item))) {
    return list.slice(0, -1);
  } else if (
    ['h', 'hh', 'H', 'HH'].some((item) => dateFormatter.includes(item))
  ) {
    return list.slice(0, -2);
  } else if (
    ['D', 'DD', 'd', 'dd', 'ddd', 'dddd'].some((item) =>
      dateFormatter.includes(item),
    )
  ) {
    return list.slice(0, -3);
  } else if (
    ['MMMM', 'MMM', 'MM', 'M'].some((item) => dateFormatter.includes(item))
  ) {
    return list.slice(0, -6);
  } else if (['YY', 'YYYY'].some((item) => dateFormatter.includes(item))) {
    return [list[0]];
  } else {
    // 没有满足匹配规则，返回所有日期格式
    return list;
  }
};
export const reverseLookup = (value) => {
  if (!value) return { label: '', formatter: () => {} };
  return (
    list.filter((item) => item.value === value)[0] || {
      label: '',
      formatter: () => {},
    }
  );
};
export const getDstFormatData = (dstFormat) =>
  list.filter((item) => item.value === dstFormat)[0];
export const getDateDisplayFormat = (dstFormat, format) => {
  return getDstFormatData(dstFormat)?.dateDisplayFormat.filter(
    (item) => item.value === format,
  )[0];
};
