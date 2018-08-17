import Vue from 'vue';

Vue.filter('niceDate', (d) => {
  const date = d.getDate().toString();
  const dateSuffix =
    {
      1: 'st',
      2: 'nd',
      3: 'rd'
    }[date[date.length - 1]] || 'th';

  const month = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }[d.getMonth()];

  const year = d.getFullYear();

  return `${date}${dateSuffix} ${month} ${year}`;
});