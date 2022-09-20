import { delay } from "../utils/helper.js";
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
    arr[randIndex].style.backgroundColor = "red";
    arr[right].style.bacjgroundColor = "red";
    await delay(ticks);
    swap(arr, randIndex, right);
    arr[right].style.backgroundColor = "cyan";
    arr[randIndex].style.backgroundColor = "cyan";
    const pivot = parseInt(arr[right].style.height);
    let i = left - 1;

    for (let j = left; j < right; j++) {
        await delay(ticks / 8);
        if (parseInt(arr[j].style.height) <= pivot) {
            i++;

         
            arr[j].style.backgroundColor = "red";
            arr[i].style.backgroundColor = "red";
            await delay(ticks);
            swap(arr, i, j);
            arr[j].style.backgroundColor = "cyan";
            arr[i].style.backgroundColor = "cyan";
        }
    }
    arr[i + 1].style.backgroundColor = "red";
    arr[right].style.backgroundColor = "red";
    await delay(ticks);
    swap(arr, i + 1, right);
    arr[i + 1].style.backgroundColor = "cyan";
    arr[right].style.backgroundColor = "cyan";
    await ripple(arr, ticks / 20, "cyan");
    return i + 1;
}

export {quickSort, quickSortUtil, partition};