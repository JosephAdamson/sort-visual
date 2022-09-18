import { delay } from "../utils.js";
import { swap, ripple } from "../sortvisual.js";

/*
Creates a binary max heap from an array, then performs n
successive 'delete' operations re-heapifying the sub array each
time (O(log n)) for a total complexity of O(n * log g).

@param {Array} arr An array of size N.
*/
async function heapSort(arr, ticks) {
    const N = arr.length;

    // create initial max heap
    for (let i = Math.floor(N / 2) - 1; i >= 0; i--) {
        await heapify(arr, N, i, ticks);
    }

    await ripple(arr, ticks / 4, "orange");

    // 'remove' highest element at the top of the heap (arr[0]) by swapping
    // it with the deepest element lowest element (ith) in the heap
    // can miss the final interation @ index 0
    for (let i = N - 1; i > 0; i--) {
        await delay(ticks * 2);
        swap(arr, i, 0);
        arr[i].style.backgroundColor = "cyan";
        await heapify(arr, i, 0, ticks);
    }
    await ripple(arr, ticks / 2, "lime");
}

/*
Create a binary max heap from a given array, the invariant being
each parent value is > its children.

@param {Array}  arr An array of size N.
@param {Number} N   The size of the parameter array.  
*/
async function heapify(arr, N, i, ticks) {
    
    let largest = i;
    const leftChild = 2 * i + 1;
    const rightChild = 2 * i + 2;

    if (leftChild < N && 
        parseInt(arr[leftChild].style.height) > parseInt(arr[largest].style.height)) {
        largest = leftChild;
    }

    if (rightChild < N && 
        parseInt(arr[rightChild].style.height) > parseInt(arr[largest].style.height)) {
        largest = rightChild;
    }

    if (largest !== i) {
        swap(arr, i, largest);
        await delay(ticks);
        // re-heapify starting from the largest node.
        await heapify(arr, N, largest);
    }
}

export { heapSort, heapify }