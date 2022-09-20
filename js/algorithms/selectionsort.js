import { delay } from "../utils/helper.js";
import { swap, ripple } from "../sortvisual.js";

/*
O(n) for the array traversal * n traversals of n - i for 
a total time complexity of O(n^2). 

@param {Array}  arr   Array of size N.
@param {Number} delay Time delay in milliseconds.
*/
async function selectionSort(arr, ticks){
    const N = arr.length;

    for (let i = 0; i < N - 1; i++) {
        let min = i;
        await delay(ticks);

        // inner loop starts at i + 1 fencing off the sorted portion
        // of the array (< i) from the unsorted part.
        for (let j = i + 1; j < N; j++) {
            arr[j].style.backgroundColor = "red";
            if (parseInt(arr[j].style.height) < parseInt(arr[min].style.height)) {
                min = j;
            }
            await delay(ticks / (arr.length / 5));
            arr[j].style.backgroundColor = "cyan";
        }

        arr[i].style.backgroundColor = "purple";
        arr[min].style.backgroundColor = "purple";
        await delay(ticks)
        swap(arr, i, min);
        arr[i].style.backgroundColor = "cyan";
        arr[min].style.backgroundColor = "cyan";
    }
    ripple(arr, ticks / 2, "lime");
}

export { selectionSort }