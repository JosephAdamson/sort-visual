import { delay } from "../utils.js";
import { swap, ripple } from "../sortvisual.js";


async function quickSort(arr, ticks) {
    await quickSortUtil(arr, 0, arr.length -1, ticks);
    ripple(arr, ticks / 2, "lime");
}

async function quickSortUtil(arr, left, right, ticks){
    if (left < right) {
        const pivotIndex = await partition(arr, left, right, ticks);
        await quickSortUtil(arr, left, pivotIndex - 1, ticks);
        await quickSortUtil(arr, pivotIndex + 1, right, ticks);
    }
}

async function partition(arr, left, right, ticks){
    // pick random index between the lower and upper bounds
    // as the pivot, which is then moved to the end of the array
    // before the sort. Ensures an higher probability of O(n log n) performance
    // even in the case of a presorted array (which would otherwise by O(n^2).
    const randIndex = Math.floor(left + Math.random() * (right - left + 1) );
    arr[randIndex].style.backgroundColor = "purple";
    arr[randIndex].style.backgroundColor = "cyan";
    swap(arr, randIndex, right);
    arr[right].style.backgroundColor = "purple";
    const pivot = parseInt(arr[right].style.height);
    let i = left - 1;

    for (let j = left; j < right; j++) {
        arr[j].style.backgroundColor = "red";
        await delay(ticks / 8);
        if (parseInt(arr[j].style.height) <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, right);
    await delay(ticks);
    arr[i + 1].style.backgroundColor = "purple";
    arr[right].style.backgroundColor = "red";
    await ripple(arr, ticks / 10, "cyan");
    return i + 1;
}

export {quickSort, quickSortUtil, partition};