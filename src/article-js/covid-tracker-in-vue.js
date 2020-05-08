import Vue from 'vue';

export default function init() {
  new Vue({
    el: '#text-position-demo',
    data: {
      baselineSelect: {
        options: [
          'baseline',
          'before-edge',
          'text-before-edge',
          'middle',
          'central',
          'after-edge',
          'text-after-edge',
          'ideographic',
          'alphabetic',
          'hanging',
          'mathematical',
          'top',
          'centre',
          'bottom'
        ],
        value: 'baseline'
      },
      textAnchorSelect: {
        options: ['start', 'middle', 'end'],
        value: 'start'
      }
    }
  });
}
