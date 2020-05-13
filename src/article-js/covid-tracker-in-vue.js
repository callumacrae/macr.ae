import Vue from 'vue';
import { gsap } from 'gsap';
import covidData from './covid-data.json';
import DayInput from './covid-tracker-day-input.vue';
import ChartBar from './covid-tracker-chart-bar.vue';

export default function init() {
  if (!navigator.userAgent.includes('HeadlessChrome')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    document.body.appendChild(script);
  }

  new Vue({
    el: '#text-position-demo',
    data: {
      baselineSelect: {
        options: [
          'auto',
          'text-bottom',
          'alphabetic',
          'middle',
          'central',
          'mathematical',
          'hanging',
          'text-top'
        ],
        value: 'alphabetic'
      },
      textAnchorSelect: {
        options: ['start', 'middle', 'end'],
        value: 'start'
      }
    }
  });

  const simpleData = {
    dates: ['1/22/20', '2/11/20', '3/27/20'],
    countryData: {
      China: [548, 44386, 81897],
      'United Kingdom': [0, 8, 14745],
      'United States': [1, 11, 101657]
    }
  };

  const simpleDatas = document.querySelectorAll('.covid-simple-data');
  simpleDatas.forEach(el => {
    new Vue({
      el,
      data: {
        day: 2,
        chartWidth: 760
      },
      computed: {
        chartData() {
          return Object.entries(simpleData.countryData)
            .map(([country, dataArray]) => {
              return {
                country,
                value: dataArray[this.day]
              };
            })
            .filter(({ value }) => value)
            .sort((a, b) => b.value - a.value);
        },
        maxValue() {
          return this.chartData.reduce(
            (max, { value }) => Math.max(value, max),
            0
          );
        }
      },
      methods: {
        barWidth(value) {
          return (this.chartWidth / this.maxValue) * value;
        }
      }
    });
  });

  const fullDatas = document.querySelectorAll('.covid-full-data');
  fullDatas.forEach(el => {
    new Vue({
      el,
      components: { ChartBar, DayInput },
      data: {
        day: 63,
        dates: covidData.dates,
        barStart: 150,
        chartWidth: 760
      },
      computed: {
        chartData() {
          const chartData = Object.entries(covidData.countryData)
            .map(([country, dataArray]) => {
              return {
                country,
                value: dataArray[this.day]
              };
            })
            .filter(({ value }) => value);

          const sortedData = chartData
            .slice()
            .sort((a, b) => b.value - a.value);

          return chartData.map(item => ({
            position: sortedData.indexOf(item),
            ...item
          }));
        },
        maxValue() {
          return this.chartData.reduce(
            (max, { value }) => Math.max(value, max),
            0
          );
        }
      },
      methods: {
        barWidth(value) {
          return (this.chartWidth / this.maxValue) * value;
        },
        barWidthSpaced(value) {
          return ((this.chartWidth - this.barStart) / this.maxValue) * value;
        }
      }
    });
  });

  new Vue({
    el: '#gsap-tweening-example',
    data: {
      number: 1000,
      tweenedNumber: 1000
    },
    methods: {
      newNumber() {
        this.number = Math.round(Math.random() * 10000);
        gsap.to(this.$data, {
          tweenedNumber: this.number
        });
      }
    }
  });
}
