/**
 * Created by Gryzli on 05.04.2017.
 */
const westletter = 'WCS Weekly Westletter';
const woc_string = 'Wielkie Ogarnianie Charta';
/**
 *
 * @returns {boolean}
 * @param elem
 * @param filter
 */
const countDays = (elem, { valueName, until, days }) => {
  const date = elem[valueName];
  const cIn1 = new Date(date).getTime();
  return cIn1 - subtractDaysFromDate(until, days).getTime() > 0;
};

/**
 *
 * @param until {Date}
 * @param days {number}
 * @returns {Date}
 */
const subtractDaysFromDate = (until, days) => {
  const since_date = new Date(until);
  since_date.setDate(new Date(until).getDate() - days);
  return since_date;
};

const filters = [
  {
    control: { name: 'date_create_control', id: 'create' },
    input: { max: 31, name: 'create_control' },
    valueName: 'created_time',
    description: { start: 'created in last ', end: ' days' },
    type: 'countDays',
    check: countDays,
  },
  {
    control: { name: 'date_update_control', id: 'update' },
    input: { max: 31, name: 'update_control' },
    valueName: 'updated_time',
    description: { start: 'updated in last ', end: ' days' },
    type: 'countDays',
    check: countDays,
  },
  {
    control: { name: 'more_then_control', id: 'more' },
    input: { name: 'more_control' },
    description: { start: 'more then ' },
    type: 'more',
    check: ({ reactions_num }, { days }) => reactions_num > days,
  },
  {
    control: { name: 'less_then_control', id: 'less' },
    input: { name: 'less_control' },
    description: { start: 'less then ' },
    type: 'less',
    check: ({ reactions_num }, { days }) => reactions_num < days,
  },
];

const text_check = ({ message }, { text }) =>
  message !== undefined ? !message.toLowerCase().includes(text) : true;
const text_filters = [
  {
    control: { name: 'woc_text_control', id: 'woc_cb' },
    input: {
      name: 'woc_control',
    },
    text: woc_string.toLowerCase(),
    check: text_check,
  },
  {
    control: { name: 'westletter_text_control', id: 'westletter_cb' },
    input: {
      name: 'westletter_control',
    },
    text: westletter.toLowerCase(),
    check: text_check,
  },
];
const exp = {
  control: filters,
  text: text_filters,
  subtractDaysFromDate,
};
module.exports = exp;
export default exp;
