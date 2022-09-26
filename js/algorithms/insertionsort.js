import { delay } from "../utils/helper.js";
import { swap, ripple } from "../sortvisual.js";

/* 
Method iterates through an array assigning each value to a key.
This value is then checked against values preceding it in
the array. Any preceding values greater than the key are
shifted up the array to so the key can be placed before them.
O(n) for the array traversal * n traversals of n - i for
a total time complexity of O(n^2).

@param {Array} arr Array of size n
@param {Number} ticks Time delay in milliseconds.
*/
async function insertionSort(arr, ticks) {
    const n = arr.length;

    // could start i = 1 but it starts at 0 for the animation
    for (let i = 0; i < n; i++) {
        arr[i].style.backgroundColor = "#FF9966";
        await delay(ticks);

        const key = parseInt(arr[i].style.height);
        let j = i - 1;

        while (j >= 0 && parseInt(arr[j].style.height) > key) {
            arr[j].style.backgroundColor = "#E06C75";
            await delay(ticks);
            arr[j].style.backgroundColor = "#61AFEF";

            arr[j + 1].style.height = arr[j].style.height;
            j--;
        }
        arr[j + 1].style.height = `${key}px`; 
    }
    ripple(arr, delay / 4, "#98C379");
}

export { insertionSort }