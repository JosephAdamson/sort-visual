import { delay } from "../utils/helper.js";
import { ripple } from "../sortvisual.js";

/*
Method takes an array of size n and recursively partitions
it util we get n singleton arrays. Each array is subsequently
merged with its neighbour. For an array of size n this happens
log n times with each merge operation costing O(n), for a total
complexity of O(1) * O(log n) (partition) + O(n) (merge) * (log n) = O(n log n). 

@param {Array}  arr     Array of size N.
@param {Number} ticks   Time delay in milliseconds.
*/
async function mergeSort(arr , ticks){
    await splitHelper(arr, 0, arr.length - 1, ticks);
    await delay(ticks);
    await ripple(arr, ticks / 2, "#98C379");
}

/*
Recursively partition initial array into singleton sub arrays, then
compare and merge. 

@param {Array}  arr     Array of size n.
@param {Number} left    Lower bound.
@param {Number} right   Upper bound.
@param {Number} ticks   Time delay in milliseconds.
*/
async function splitHelper(arr, left, right, ticks){
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        await splitHelper(arr, left, mid, ticks);
        await splitHelper(arr, mid + 1, right, ticks);
        await mergeHelper(arr, left, mid, right, ticks);
    }
}


/*
Compare and merge.

@param {Array}  arr     Array of size n.
@param {Number} left    Lower bound.
@param {Number} mid     Mid point between upper and lower bound.
@param {Number} right   Upper bound.
*/
async function mergeHelper(arr, left, mid, right, ticks) {
    
    // deep copy bar heights for comparison
    const copy = arr.map(elem => parseInt(elem.style.height));

    let i = left;
    let j = mid + 1;

    let k = left;

    ripple(arr.slice(left, right + 1), ticks, "#E06C75");
    while (i <= mid && j <= right ) {
        
        if (copy[i] <= copy[j]) {
            arr[k++].style.height = `${copy[i++]}px`;
        } else {
            arr[k++].style.height =`${copy[j++]}px`;
        }
        await delay(ticks);
    }

    while (i <= mid) {
        arr[k++].style.height = `${copy[i++]}px`;
    }
    while(j <= right) {
        arr[k++].style.height = `${copy[j++]}px`;
    }
    await delay(ticks);
    ripple(arr.slice(left, right + 1), ticks / 2, "#61AFEF");

}

export {mergeSort, splitHelper, mergeHelper}