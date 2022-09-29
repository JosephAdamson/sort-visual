import { delay } from "../utils/helper.js";
import { swap, ripple } from "../sortvisual.js";

/*
Worst case O(n^2). 
"Here is how a garden gnome sorts a line of flower pots.
Basically, he looks at the flower pot next to him and the previous one; 
if they are in the right order he steps one pot forward, otherwise,
he swaps them and steps one pot backward." - An unnamed gnome expert.

@param {Array}  arr     Array of size n.
@param {Number} ticks   Time delay in milliseconds.
*/
async function gnomeSort(arr, ticks){
    const n = arr.length; 
    let pos = 0;

    while (pos < n) {
        if (pos == 0 || 
            parseInt(arr[pos].style.height) >= parseInt(arr[pos - 1].style.height)) {
            arr[pos].style.backgroundColor = "#E06C75";
            await delay(ticks);
            arr[pos].style.backgroundColor = "#61AFEF";
            pos++;
        } else {
            swap(arr, pos, pos - 1)
            arr[pos].style.backgroundColor = "#E06C75";
            await delay(ticks);
            arr[pos].style.backgroundColor = "#61AFEF";
            pos--;
        }
    }
    await ripple(arr, ticks / 4, "#98C379");
}

export { gnomeSort };