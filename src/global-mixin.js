export default {
  methods: {
    niceDate(d) {
      const date = d.getDate().toString();
      const dateSuffix =
        {
          1: 'st',
          2: 'nd',
          3: 'rd'
        }[date[date.length - 1]] || 'th';

      const month = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
      }[d.getMonth()];

      const year = d.getFullYear();

      return `${date}${dateSuffix} ${month} ${year}`;
    }
  }
};
