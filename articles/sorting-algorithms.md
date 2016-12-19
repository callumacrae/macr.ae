# Sorting algorithms visualised
- 19th December 2016

Sometimes you or a computer needs to sort a list of items—say, a list of names into alphabetical order, or a list of objects into length order. To sort this list, especially if it is a large list, you need some kind of process: for example, if you were sorting a list of names into alphabetic order, you could group all the letters by their first letter, then sort the individual groups.

Algorithms used to sort a list of items are called sorting algorithms, and this article will explain and visualise a few of the most well known sorting algorithms. Each section will contain one sorting algorithm, a description of the algorithm, and then a visualisation of the algorithm. Different length bars (seen below) will be sorted from shortest to longest, powered by [D3.js]. There are some controls to the bottom right of the screen: it might help if you adjust the speed of the visualisation a bit.

<svg class="sorting-demo" id="unordered" height="300" width="800" viewBox="0 0 800 300"></svg>

Most of the sorting algorithms in this article are comparison sorts: two items are chosen from the list and compared to each other to see which should come first.

----

## Bubble sort

Bubble sort is one of the easier sorting algorithms to understand, as it is one of the simplest. It is also one of the slowest to run (although I won't really be talking about algorithm speed or efficiency in this article).

It works by iterating through the list from the beginning, comparing the current item to the next item in the list, and moving the longest of the two up the list. When it gets to the end of the list, the current item is marked as sorted and the iteration begins again from the beginning of the list.

The orange bars are the bars being compared, and the darker blue bars are the bars that have finished sorting. Watch to the see the largest unsorted bar being grabbed and "bubbling up" the list:

<svg class="sorting-demo" id="bubble" height="300" width="800" viewBox="0 0 800 300"></svg>

----

## Selection sort

Selection sort works by iterating through the list and finding the smallest unsorted item. Once it has found it, it swaps the item with the left-most unsorted item, marks it as sorted, and starts the search again.

<svg class="sorting-demo" id="selection" height="300" width="800" viewBox="0 0 800 300"></svg>

----

## Insertion sort

Insertion sort iterates through the list, taking one unsorted element at a time, and then repeatedly swapping it with the element to the left of it until the element to the left of it is smaller than it, which means that the element is now in the correct place and it can be marked as completed. 
  
While not usually as efficient as some of the more complicated algorithms below, this algorithm is great at sorting lists which are already nearly in order: try clicking "mostly ordered" in the controls to the bottom right to see a demonstration of this (remember to click "random" afterwards when looking at the other algorithms).

<svg class="sorting-demo" id="insertion" height="300" width="800" viewBox="0 0 800 300"></svg>

----

## Merge sort

All the other algorithms in this article are *in-place* algorithms, meaning that they work within the list, swapping elements. Merge sort is not an in-place algorithm, and uses two lists.

Merge sort works by diving the list of elements into two parts, running merge sort on the two parts so that the individual parts are order, and then combining them again in order, taking the smallest element from the two parts and adding it to a new list.

Effectively, this means that the list is divided up into lists of length 1, then combined into ordered lists of length 2, then those lists are combined into ordered lists of length 4, until it's done and you have your sorted array.

Watch the visualisation below for a couple iterations—it makes more sense towards the end:

<svg class="sorting-demo" id="merge" height="300" width="800" viewBox="0 0 800 300"></svg>

An algorithm which divides the problem into smaller problems and solves them recursively is known as a divide and conquer algorithm: we'll meet another one later.

----

## Shell sort

Shell sort is a variation on insertion sort, which was explained above. It's different in that it runs through the list multiple times, and starts by comparing elements that are far apart from each other—the distance between them being known as the "gap".

We start with a gap of `n / 2`, where n is the length of the list. Then, we compare the first element in the list with the element `gap` elements along the list. If it's bigger, we swap them. Then we iterate through the list comparing every element to other elements `gap` distance away.

Once we've iterated through the list, we choose another gap: in this example, to keep it simple, we're just halving and then flooring the gap (so if it was 15, it would become 7). We iterate through the list again, swapping elements when necessary, and if they're swapped we compare them with the element `gap` distance _below_ them so see if a swap is necessary: effectively, we're running insertion sort on a subset of the list where the subset is every `gap` elements of the list.

This can be faster than just using insertion sort, as it means that elements that are far away from where they need to be don't have to be swapped down one element at a time. It does come with added complexity, though.

<svg class="sorting-demo" id="shell" height="300" width="800" viewBox="0 0 800 300"></svg>

----

## QuickSort

QuickSort is probably the most efficient algorithm in this article for most cases. Like merge sort, it is a divide and conquer algorithm, but it works differently: it chooses a "pivot" element, and then orders the list so that all the elements smaller than the pivot are below the pivot, and all the elements larger than the pivot are above the pivot (the pivot is then in the correct place). It then runs quicksort on the list below and the list above, choosing new pivots in those lists and running itself again.

The algorithm works by choosing a pivot element in the list it wants to sort—in this case, by just choosing a random element—and then setting `l` and `r` variables to the left and right points of the list to sort. Then, `l` and `r` move towards the pivot an element at a time, swapping the elements around if `l` is larger than `r` to ensure that elements on the left of the pivot are always smaller than the pivot. When `l` or `r` reaches the pivot, the pivot starts moving too, and when they are all in the same place, it means that the pivot is now in the correct position: everything to the left of it is smaller than it, and everything to the right of it is larger than it.

There are more efficient ways to choose a pivot elements than just choosing a random element—for example, given that I know this is a list of unique elements, I could just choose the midpoint—but that's beyond the scope of this article.

The dark blue elements are elements that have been marked as sorted, the green element is the pivot element, and the orange elements are the high and low elements.

<svg class="sorting-demo" id="quick" height="300" width="800" viewBox="0 0 800 300"></svg>

----

## Heap sort

Heap sort is probably the most complicated of all the algorithms explained in this article, as it relies on some other concepts from Computer Science—heaps.

The algorithm works in two stages: in the first stage, it takes unprocessed elements one at a time, and adds them to a list representation of a heap—a tree structure where the parent nodes are always bigger than the child nodes. [This video on heaps][xoax heaps] is a good watch, if you're unfamiliar with the concept.

In the second stage, once the list has become a heap, the largest element—now the first element in the list—is repeatedly swapped with the last unsorted element in the list. It is then marked as completed, and the element that was just swapped onto the top of the heap repeatedly swapped with its smallest child until the heap is valid again.

<svg class="sorting-demo" id="heap" height="300" width="800" viewBox="0 0 800 300"></svg>

----

## Bogosort

And, just for fun, here's bogosort. Bogosort works by repeatedly shuffling the list randomly until it is sorted. It can take an infinitely long amount of time to complete: in fact, if we have a list of 20 elements and we shuffle it 1,000 times a second, it will take an average of 77 billion years to complete.

<svg class="sorting-demo" id="bogo" height="300" width="800" viewBox="0 0 800 300"></svg>

----

## Codepens

I developed most of the visualisations in CodePen, so if you want to have a play, check them out. Be aware that they're not implementations of the actual algorithms, though: they've been modified to be iterative instead:

- Bubble sort: http://codepen.io/callumacrae/pen/wodVmP
- Insertion sort: http://codepen.io/callumacrae/pen/Mbvbpx
- Selection sort: http://codepen.io/callumacrae/pen/dOzKpM
- Merge sort: http://codepen.io/callumacrae/pen/QGMBEe
- Heap sort: http://codepen.io/callumacrae/pen/gLvWBP
- QuickSort: http://codepen.io/callumacrae/pen/Nbyyar
- Shell sort: http://codepen.io/callumacrae/pen/pNaQRK
- Bogosort: http://codepen.io/callumacrae/pen/LbjJOv

You can also find the source for this article on [GitHub][macr.ae github].

<small>Thanks to [Chris D Brown] for proof reading :)</small>


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

[D3.js]: https://d3js.org/
[xoax heaps]: https://www.youtube.com/watch?v=v1YUApMYXO4
[macr.ae GitHub]: https://github.com/callumacrae/macr.ae/blob/master/articles/sorting-algorithms.md
[Chris D Brown]: https://twitter.com/ChrisDeeBrown