import { delay } from "../utils/helper.js";
import { swap, ripple } from "../sortvisual.js";

/*
O(n) for the array traversal * n traversals of n - i for 
a total time complexity of O(n^2). 

@param {Array}  arr   Array of size N.
@param {Number} delay Time delay in milliseconds.
*/
async function selectionSort(arr, ticks){
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let min = i;
        await delay(ticks);
        arr[i].style.backgroundColor = "#FF9966";

        // inner loop starts at i + 1 fencing off the sorted portion
        // of the array (< i) from the unsorted part.
        for (let j = i + 1; j < n; j++) {
            if (parseInt(arr[j].style.height) < parseInt(arr[min].style.height)) {
                min = j;
            }
            await delay(ticks / (arr.length / 3));
        }

        arr[i].style.backgroundColor = "#E06C75";
        arr[min].style.backgroundColor = "#E06C75";
        await delay(ticks * 4)
        swap(arr, i, min);
        arr[i].style.backgroundColor = "#61AFEF";
        arr[min].style.backgroundColor = "#61AFEF";
    }
    ripple(arr, ticks / 4, "#98C379");
}

export { selectionSort }