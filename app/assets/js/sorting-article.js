const d3 = require('d3');
const config = {
	bars: 30,
	count: 20,
	interval: 250,
	runOffScreen: false
};

const startData = d3.range(config.bars);

shuffleArray(startData);


const chartUpdaters = window.chartUpdaters = [];

function initChart(selector, algo) {
	let data = startData.slice();

	const svg = d3.select(selector);
	const width = svg.attr('width');
	const height = svg.attr('height');

	const xScale = d3.scaleBand()
		.domain(d3.range(data.length))
		.rangeRound([0, width])
		.paddingInner(0.5);

	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, (d) => Array.isArray(d) ? d[0] : d))
		.range([30, height]);

	const algoInstance = algo ? algo() : undefined;

	chartUpdaters.push((newData) => {
		data = newData;

		if (algo && algoInstance.reset) {
			algoInstance.reset(newData);

			if (algoInstance.data) {
				data = algoInstance.data();
			}
		}

		xScale.domain(d3.range(newData.length));
		yScale.domain(d3.extent(newData, (d) => Array.isArray(d) ? d[0] : d));

		const rects = svg.selectAll('rect')
			.data(data, (d) => d instanceof Object ? d.d : d);

		rects.transition().duration(config.interval / 2)
			.attr('x', algoInstance && algoInstance.x ? algoInstance.x(xScale, width, data) : (d, i) => xScale(i))
			.attr('y', algoInstance && algoInstance.y ? algoInstance.y(yScale, height, data) : (d) => height - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', algoInstance && algoInstance.height ? algoInstance.height(yScale) : (d) => yScale(d));

		rects.enter()
			.append('rect')
			.attr('x', algoInstance && algoInstance.x ? algoInstance.x(xScale, width, data) : (d, i) => xScale(i))
			.attr('y', algoInstance && algoInstance.y ? algoInstance.y(yScale, height, data) : (d) => height - yScale(d))
			.attr('width', xScale.bandwidth())
			.attr('height', algoInstance && algoInstance.height ? algoInstance.height(yScale) : (d) => yScale(d));

		rects.exit()
			.remove();

		if (algo && completed) {
			completed = false;
			iterate();
		}
	});

	svg.selectAll('rect')
		.data(algoInstance && algoInstance.data ? algoInstance.data() : data, (d) => d instanceof Object ? d.d : d)
		.enter()
		.append('rect')
		.attr('x', algoInstance && algoInstance.x ? algoInstance.x(xScale, width, data) : (d, i) => xScale(i))
		.attr('y', algoInstance && algoInstance.y ? algoInstance.y(yScale, height, data) : (d) => height - yScale(d))
		.attr('width', xScale.bandwidth())
		.attr('height', algoInstance && algoInstance.height ? algoInstance.height(yScale) : (d) => yScale(d));

	if (!algo) {
		return;
	}

	let completed;

	function iterate() {
		const boundingRect = svg.node().getBoundingClientRect();

		if (config.runOffScreen || (boundingRect.top > -svg.node().scrollHeight + 100 && boundingRect.top < window.innerHeight - 100)) {
			completed = algoInstance.iterate(data);

			let rects = svg.selectAll('rect')
				.data(algoInstance.data ? algoInstance.data() : data, (d) => d instanceof Object ? d.d : d)
				.attr('class', algoInstance.classes ? algoInstance.classes(data) : '');

			if (algoInstance.transition !== false) {
				rects = rects.transition().duration(config.interval / 2);
			}

			rects.attr('x', algoInstance.x ? algoInstance.x(xScale, width, data) : (d, i) => xScale(i));

			if (algoInstance.y) {
				rects.attr('y', algoInstance.y(yScale, height, data));
			}
		}

		if (!completed) {
			setTimeout(iterate, config.interval);
		}
	}

	if (document.readyState === 'complete') {
		iterate();
	} else {
		window.addEventListener('load', iterate);
	}
}



document.querySelector('#rainbow').addEventListener('change', (e) => {
	if (e.target.checked) {
		d3.selectAll('rect').style('fill', hslScale);
	} else {
		d3.selectAll('rect').style('fill', null);
	}
});

const intervalInput = document.querySelector('#interval');
intervalInput.value = config.interval;
intervalInput.addEventListener('change', () => {
	config.interval = intervalInput.value;
});

const barsInput = document.querySelector('#bars');
barsInput.value = config.bars;
barsInput.addEventListener('change', () => {
	config.bars = barsInput.value;

	const newData = d3.range(config.bars);
	shuffleArray(newData);
	chartUpdaters.forEach((updater) => updater(newData.slice()));
});

document.querySelector('#restart-links').addEventListener('click', (e) => {
	if (e.target.tagName !== 'A') {
		return;
	}

	e.preventDefault();

	const newData = ({
		random() {
			const newData = d3.range(config.bars);
			shuffleArray(newData);
			return newData;
		},
		reversed() {
			return d3.range(config.bars).reverse();
		},
		'mostly ordered'() {
			const newData = d3.range(config.bars);

			for (let i = 2; i < newData.length; i++) {
				let j = Math.floor(Math.random() * 2);
				[newData[i], newData[i - j]] = [newData[i - j], newData[i]];
			}

			return newData;
		}
	})[e.target.textContent]();

	chartUpdaters.forEach((updater) => updater(newData.slice()));
});

document.querySelector('#offscreen').addEventListener('change', (e) => {
	config.runOffScreen = e.target.checked;
});

function hslScale(d) {
	return d3.hsl((typeof d === 'object' ? d.d : d) / config.bars * 270, 1, 0.5);
}

initChart('#unordered');

initChart('#bubble', () => {
	let position = 0;
	let pass = 0;

	return ({
		iterate(data) {
			if (position === data.length - 1 - pass) {
				position = 0;
				pass++;
			}

			if (pass >= data.length - 1) {
				pass++; // To make sure classes are correct
				return true;
			}

			if (data[position] > data[position + 1]) {
				[data[position], data[position + 1]] = [data[position + 1], data[position]];
			}

			position++;
		},
		classes(data) {
			return (d, i) => {
				if (i >= data.length - pass) {
					return 'completed';
				}

				if (i === position || i + 1 === position) {
					return 'active';
				}
			};
		},
		reset() {
			position = 0;
			pass = 0
		}
	});
});

initChart('#insertion', () => {
	let testing = 1;
	let complete = 1;

	let resetTest = false;

	return ({
		iterate(data) {
			if (complete > data.length) {
				return true;
			}

			if (resetTest || testing === 0) {
				testing = complete;
				resetTest = false;
			}

			if (data[testing] < data[testing - 1]) {
				[data[testing], data[testing - 1]] = [data[testing - 1], data[testing]];
			} else {
				resetTest = true;
			}

			if (testing === complete) {
				complete++;
			}

			testing--;
		},
		classes(data) {
			return (d, i) => {
				if (complete <= data.length && (i === testing + 1 || i === testing)) {
					return 'active';
				}

				if (i < complete) {
					return 'completed';
				}
			};
		},
		reset() {
			testing = 1;
			complete = 1;
			resetTest = false;
		}
	});
});

initChart('#selection', () => {
	let sorted = 0;
	let checking = 0;
	let min = 0;
	let resetChecking = false;

	return ({
		iterate(data) {
			if (sorted === data.length) {
				return true;
			}

			if (resetChecking) {
				resetChecking = false;
				min = checking = sorted;
			}


			checking++;

			if (data[checking] < data[min]) {
				min = checking;
			}

			if (checking === data.length - 1) {
				[data[sorted], data[min]] = [data[min], data[sorted]];

				sorted++;
				resetChecking = true;
			}

			if (sorted === data.length - 1) {
				sorted++;
			}
		},
		classes(data) {
			return (d, i) => {
				if (sorted !== data.length && (i === checking || i === min)) {
					return 'active';
				}

				if (i < sorted) {
					return 'completed';
				}
			};
		},
		reset() {
			sorted = 0;
			checking = 0;
			min = 0;
			resetChecking = false;
		}
	});
});

initChart('#merge', () => {
	let data = startData.slice().map((d) => [d]);
	let data2 = [];

	let pass = 0;
	let n = 0;
	let i = 0;
	let j = 0;

	return ({
		iterate() {
			if (Math.max(data.length, data2.length) === 1) {
				return true;
			}

			const from = pass % 2 === 0 ? data : data2;
			const to = pass % 2 === 0 ? data2 : data;

			if (i === 0 && j === 0) {
				to.push([]);
			}

			const bucketA = from[n * 2];
			const bucketB = from[n * 2 + 1] || [];

			if (j >= bucketB.length || bucketA[i] < bucketB[j]) {
				to[to.length - 1].push(bucketA[i]);
				bucketA[i] = null;
				i++;
			} else {
				to[to.length - 1].push(bucketB[j]);
				bucketB[j] = null;
				j++;
			}

			if (i >= bucketA.length && j >= bucketB.length) {
				n++;

				if (n >= from.length / 2) {
					from.splice(0, from.length);
					pass++;
					n = 0;
				}

				i = j = 0;
			}
		},
		data() {
			return flatten(data).map((d, i) => ({ d, i, set: 0 }))
				.concat(flatten(data2).map((d, i) => ({ d, i, set: 1 })))
				.filter(({ d }) => d !== null);
		},
		x(xScale) {
			return ({ i }) => xScale(i);
		},
		y(yScale, height) {
			return ({ d, set }) => {
				return set === 0 ? height / 2 - yScale(d) / 2 - 1 : height / 2 + 1;
			};
		},
		height(yScale) {
			return ({ d }) => yScale(d) / 2;
		},
		classes() {
			return ({ d }) => {
				if (Math.max(data.length, data2.length) === 1) {
					return 'completed';
				}

				const to = pass % 2 === 0 ? data2 : data;
				if (Math.max(data.length, data2.length) === 2 && to[0] && to[0].indexOf(d) !== -1) {
					return 'completed';
				}
			};
		},
		reset(newData) {
			data = newData.slice().map((d) => [d]);
			data2 = [];

			pass = 0;
			n = 0;
			i = 0;
			j = 0;
		}
	});
});

initChart('#heap', () => {
	let stage = 1; // 1 = adding to heap, 2 = removing from heap, 3 = done
	let heaped = 1;
	let current;
	let resetCurrent = false;

	let highlight = [];

	const parentIndex = (n) => Math.floor((n - 1) / 2);

	return ({
		iterate(data) {
			// first, add each element to heap
			if (stage === 1) {
				if (!current || resetCurrent) {
					if (heaped + 1 > data.length) {
						stage = 2;
						return this.iterate(data);
					}

					heaped++;
					current = heaped - 1;
					resetCurrent = false;
				}

				const parent = parentIndex(current);

				highlight = [current, parent];

				if (data[current] > data[parent]) {
					[data[current], data[parent]] = [data[parent], data[current]];
					current = parent;
				} else {
					resetCurrent = true;
				}
			}

			// Then, remove the top element repeatedly
			if (stage === 2) {
				if (resetCurrent) {
					[data[0], data[heaped - 1]] = [data[heaped - 1], data[0]];
					heaped--;

					if (heaped === 0) {
						stage = 3;
						highlight = [];
						return true;
					}

					current = 0;
					resetCurrent = false;
				}

				let maxChild;

				if (2 * current + 1 >= heaped) {
					resetCurrent = true;
					return this.iterate(data);
				} else if (2 * current + 2 >= heaped) {
					maxChild = 2 * current + 1;
				} else {

					if (data[2 * current + 1] > data[2 * current + 2]) {
						maxChild = 2 * current + 1;
					} else {
						maxChild = 2 * current + 2;
					}
				}

				highlight = [current, maxChild];

				if (data[current] < data[maxChild]) {
					[data[current], data[maxChild]] = [data[maxChild], data[current]];
					current = maxChild;
				} else {
					resetCurrent = true;
				}
			}
		},
		classes(data) {
			return (d, i) => {
				if (highlight.includes(i)) {
					return 'active';
				}

				if (stage === 3 ? true : i < heaped) {
					return 'completed';
				}
			};
		},
		reset() {
			stage = 1;
			heaped = 1;
			current = undefined;
			resetCurrent = false;

			highlight = [];
		}
	});
});

initChart('#quick', () => {
	let toSort = [[0, startData.length - 1]];
	let sorting;
	let pivot;

	let l, r;

	return ({
		iterate(data) {
			if (!sorting) {
				if (!toSort.length) {
					return true;
				}

				sorting = toSort.shift();
				pivot = sorting[0] + Math.floor((sorting[1] - sorting[0]) * Math.random());

				l = sorting[0];
				r = sorting[1];
			}

			if (l === r) {
				if (pivot - 1 - sorting[0] > 0) {
					toSort.push([sorting[0], pivot - 1]);
				}

				if (sorting[1] - (pivot + 1) > 0) {
					toSort.push([pivot + 1, sorting[1]]);
				}

				l = r = sorting = pivot = undefined;

				return this.iterate(data);
			}

			if (data[l] < data[pivot]) {
				l++;
				return;
			}

			if (data[r] > data[pivot]) {
				r--;
				return;
			}

			[data[l], data[r]] = [data[r], data[l]];

			if (pivot === l) {
				pivot = r;
			} else if (pivot === r) {
				pivot = l;
			}
		},
		classes(data) {
			return (d, i) => {
				if (i === pivot) {
					return 'pivot';
				}

				if (i === r || i === l) {
					return 'active';
				}

				if (isCompleted(i)) {
					return 'completed';
				}

				if (sorting && (i < sorting[0] || i > sorting[1])) {
					return 'inactive';
				}
			};
		},
		reset(data) {
			toSort = [[0, data.length - 1]];
			sorting = pivot = l = r = undefined;
		}
	});

	function isCompleted(i) {
		if (!sorting && !toSort.length) {
			return true;
		}

		return [sorting].concat(toSort).every(([l, r]) => i < l || r < i);
	}
});

initChart('#shell', () => {
	let gap = Math.floor(startData.length / 2);
	let testing = gap - 1;
	let testingDown;
	let highlight = [];

	return ({
		iterate(data) {
			if (!testingDown) {
				testing++;
			}

			if (testing >= data.length) {
				gap = Math.floor(gap / 2);

				if (gap === 0) {
					highlight = [];
					return true;
				}

				testing = gap - 1;
				return this.iterate(data);
			}

			const actualTest = testingDown || testing;

			highlight = [actualTest, actualTest - gap];

			if (data[actualTest] < data[actualTest - gap]) {
				[data[actualTest], data[actualTest - gap]] = [data[actualTest - gap], data[actualTest]];
				if (actualTest - gap - gap >= 0) {
					testingDown = actualTest - gap;
				}
			} else {
				testingDown = undefined;
			}
		},
		classes(data) {
			return (d, i) => {
				if (highlight.includes(i)) {
					return 'active';
				}

				if (highlight.length === 0) {
					return 'completed';
				}
			};
		},
		reset(data) {
			gap = Math.floor(data.length / 2);
			testing = gap - 1;
			testingDown = undefined;
			highlight = [];
		}
	});
});

initChart('#bogo', () => {
	return ({
		transition: false,
		iterate(data) {
			if (isSorted(data)) {
				return true;
			}

			shuffleArray(data);
		}
	});
});

function shuffleArray(ary) {
	for (let i = ary.length; i; i--) {
		let j = Math.floor(Math.random() * i);
		[ary[i - 1], ary[j]] = [ary[j], ary[i - 1]];
	}
}

function isSorted(ary) {
	for (let i = 1; i < ary.length; i++) {
		if (ary[i] < ary[i - 1]) {
			return false;
		}
	}
	return true;
}

function flatten(ary) {
	return ary.reduce((newAry, item) => {
		return newAry.concat(Array.isArray(item) ? flatten(item) : item);
	}, []);
}
