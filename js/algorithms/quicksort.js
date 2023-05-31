import { delay } from "../utils/helper.js";
import { swap, ripple } from "../sortvisual.js";

/*
@param {Array}  arr     Array of size N.
@param {Number} ticks   Time delay in milliseconds. 
*/
async function quickSort(arr, ticks) {
    await quickSortUtil(arr, 0, arr.length -1, ticks);
    ripple(arr, ticks / 4, "#98C379");
}

/*
Recursively split array into sub arrays using our left-bound, pivot and right
bound.

@param {Array}  arr     Array of size N.
@param {Number} left    Lower bound of the sub-array.
@param {Number} right   Upper bound of the sub-array.
@param {Number} ticks   Time delay in milliseconds. 
*/
async function quickSortUtil(arr, left, right, ticks){
    if (left < right) {
        const pivotIndex = await partition(arr, left, right, ticks);
        await quickSortUtil(arr, left, pivotIndex - 1, ticks);
        await quickSortUtil(arr, pivotIndex + 1, right, ticks);
    }
}


/*
@param {Array}  arr     Array of size N.
@param {Number} left    Lower bound of the sub-array.
@param {Number} right   Upper bound of the sub-array.
@param {Number} ticks   Time delay in milliseconds.  
*/
async function partition(arr, left, right, ticks){
    // pick random index between the lower and upper bounds
    // as the pivot, which is then moved to the end of the array
    // before the sort. Ensures an higher probability of O(n log n) performance
    // even in the case of a presorted array (which would otherwise by O(n^2).
    const randIndex = Math.floor(left + Math.random() * (right - left + 1) );
    arr[randIndex].style.backgroundColor = "#E06C75";
    arr[right].style.bacjgroundColor = "#E06C75";
    await delay(ticks / 8);
    swap(arr, randIndex, right);
    arr[right].style.backgroundColor = "#61AFEF";
    arr[randIndex].style.backgroundColor = "#61AFEF";
    const pivot = parseInt(arr[right].style.height);
    let i = left - 1;

    for (let j = left; j < right; j++) {
        await delay(ticks / arr.length);
        if (parseInt(arr[j].style.height) <= pivot) {
            i++;

         
            arr[j].style.backgroundColor = "#E06C75";
            arr[i].style.backgroundColor = "#E06C75";
            await delay(ticks);
            swap(arr, i, j);
            arr[j].style.backgroundColor = "#61AFEF";
            arr[i].style.backgroundColor = "#61AFEF";
        }
    }
    arr[i + 1].style.backgroundColor = "#E06C75";
    arr[right].style.backgroundColor = "#E06C75";
    await delay(ticks);
    swap(arr, i + 1, right);
    arr[i + 1].style.backgroundColor = "#61AFEF";
    arr[right].style.backgroundColor = "#61AFEF";
    return i + 1;
}

export {quickSort, quickSortUtil, partition};