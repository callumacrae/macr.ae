# Sorting algorithms visualised
- 14th December 2016

@todo: Description of sorting algorithms

@todo: Description of article

Let's say you've got a list of unordered items that you want to put into order:

<svg class="sorting-demo" id="unordered" height="300" width="800" viewBox="0 0 800 300"></svg>

Bubble sort:

<svg class="sorting-demo" id="bubble" height="300" width="800" viewBox="0 0 800 300"></svg>

Insertion sort:

<svg class="sorting-demo" id="insertion" height="300" width="800" viewBox="0 0 800 300"></svg>

Selection sort:

<svg class="sorting-demo" id="selection" height="300" width="800" viewBox="0 0 800 300"></svg>

Merge sort:

<svg class="sorting-demo" id="merge" height="300" width="800" viewBox="0 0 800 300"></svg>

Heap sort:

<svg class="sorting-demo" id="heap" height="300" width="800" viewBox="0 0 800 300"></svg>

QuickSort:

<svg class="sorting-demo" id="quicksort" height="300" width="800" viewBox="0 0 800 300"></svg>

Shell sort:

<svg class="sorting-demo" id="shell" height="300" width="800" viewBox="0 0 800 300"></svg>

Bogosort:

<svg class="sorting-demo" id="bogosort" height="300" width="800" viewBox="0 0 800 300"></svg>



- Bubble sort: http://codepen.io/callumacrae/pen/wodVmP
- Insertion sort: http://codepen.io/callumacrae/pen/Mbvbpx
- Selection sort: http://codepen.io/callumacrae/pen/dOzKpM
- Merge sort: http://codepen.io/callumacrae/pen/QGMBEe
- Heap sort: http://codepen.io/callumacrae/pen/gLvWBP
- QuickSort: http://codepen.io/callumacrae/pen/Nbyyar
- Shell sort: http://codepen.io/callumacrae/pen/pNaQRK
- Bogosort: http://codepen.io/callumacrae/pen/LbjJOv


<form class="sort-controls">
    <p>
        <label><input type="checkbox" id="rainbow"> Rainbow mode</label><br>
        <label><input type="checkbox" id="offscreen"> Run when off screen</label>
    </p>
    <p>
        <label>Interval (ms): <input type="number" id="interval"></label>
        <button type="button">→</button>
    </p>
    <p>
        <label>Restart with: <input type="number" id="bars"></label>
        <button type="button">→</button>
    </p>
    <p id="restart-links">Restart with <a href>random</a>,<br><a href>reversed</a> or <a href>mostly ordered</a>.</p>
</form>


<script src="/assets/build/sorting-article.js"></script>