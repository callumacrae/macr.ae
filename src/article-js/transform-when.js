import Transformer from 'transform-when';

let transform;

export default function init() {
  if (transform) {
    transform.reset();
  }

  new Transformer([
    {
      el: document.querySelector('.arrow'),
      styles: [
        ['opacity', ['y', y => Transformer.transform([0, 400], [1, 0], y)]]
      ]
    }
  ]);

  const rect = document.querySelector('.demo rect');
  rect.style.opacity = 1;

  rect.addEventListener('click', function() {
    transform.trigger('example', 2000);
  });

  document
    .querySelector('.trigger-action')
    .addEventListener('click', function(e) {
      e.preventDefault();

      transform.trigger('example', 2000);
    });

  const scenes = {
    drawCircle: getScene('draw-circle'),
    scroll: getScene('scroll'),
    time: getScene('time')
  };

  console.log(scenes);

  const pathLength = Math.ceil(rect.getAttribute('width') * Math.PI);

  transform = new Transformer([
    {
      el: rect,
      visible: [scenes.drawCircle[0], Infinity],
      styles: [
        [
          'stroke-dasharray',
          ['y', y => (y < scenes.time[0] ? pathLength : 'none')]
        ],
        [
          'stroke-dashoffset',
          [
            'y',
            function(y) {
              return Transformer.transform(
                scenes.drawCircle,
                [pathLength, 0],
                y
              );
            }
          ]
        ],
        [
          'fill-opacity',
          [
            'y',
            function(y) {
              return Transformer.transform(scenes.scroll, [0, 1], y);
            }
          ]
        ]
      ],
      scaleScale: Transformer.transformObj({
        0: 1,
        0.5: 0.05,
        1: 1
      }),
      transforms: [
        [
          'scale',
          [
            'y',
            'actions',
            function(y, actions) {
              if (actions.example) {
                return this.scaleScale(actions.example);
              }

              return Transformer.transform(scenes.scroll, [1.2, 1], y);
            }
          ]
        ],
        [
          'rotate',
          [
            'y',
            'i',
            'actions',
            function(y, i, actions) {
              var extra = 0;
              if (actions.example) {
                extra = -720 * actions.example;
              }

              return y < scenes.time[0] ? 0 : (i % 360) + extra;
            }
          ]
        ]
      ],
      rxScale: Transformer.transformObj({
        0: 0,
        0.5: 70,
        1: 0
      }),
      attrs: [
        [
          'rx',
          [
            'y',
            'actions',
            function(y, actions) {
              if (actions.example && y >= scenes.time[1]) {
                return this.rxScale(actions.example);
              }

              return Transformer.transform(scenes.time, [70, 0], y);
            }
          ]
        ],
        [
          'ry',
          [
            'y',
            'actions',
            function(y, actions) {
              if (actions.example && y >= scenes.time[1]) {
                return this.rxScale(actions.example);
              }

              return Transformer.transform(scenes.time, [70, 0], y);
            }
          ]
        ]
      ]
    }
  ]);
}

function getScene(name) {
  const transformEl = document.querySelector('[data-transform="' + name + '"]');

  const startEl = transformEl.children[0];
  const endEl = transformEl.children[transformEl.children.length - 1];

  // This is required because the article is position: relative
  const articleOffset = transformEl.parentElement.offsetTop;

  return [
    startEl.offsetTop + articleOffset - window.innerHeight / 3 + 120,
    endEl.offsetTop + articleOffset - window.innerHeight / 3 + 120
  ];
}

// @todo fix this
window.addEventListener('resize', init);
