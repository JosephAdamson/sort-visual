import { generateArray, delay } from "./utils.js";
import { selectionSort } from "./algorithms/selectionsort.js";
import { mergeSort } from "./algorithms/mergesort.js"
import { quickSort } from "./algorithms/quicksort.js"
import { gnomeSort } from "./algorithms/gnomesort.js";
import { insertionSort } from "./algorithms/insertionsort.js";
import { heapSort } from "./algorithms/heapsort.js";
import { DoubleRange } from "./components/double_range.js";

// Page elements
const playBtn = document.querySelector("#play-btn");
const generateArrayBtn = document.querySelector("#generate-array-btn");
const sizeSlider = document.querySelector("#size-slider");
const speedSlider = document.querySelector("#speed-slider");
const doubleRange = document.querySelector("#elem-range");
const arrayCanvas = document.querySelector("#array-canvas");
const algoOptions = document.querySelector("#algo-options");
const modalOverlay = document.querySelector("#modal-overlay");

// Gloabl attributes
let sliderPrev = sizeSlider.value;
const BASE_TICKS = 800;
const ALGOS = {
    "selection sort": selectionSort,
    "merge sort": mergeSort,
    "quick sort": quickSort,
    "gnome sort": gnomeSort,
    "insertion sort": insertionSort,
    "heap sort": heapSort
};

/*
Add all the values in a given array of size n as bars to the array canvas.

@param {Number} n The size of the array to be generated.
*/
const mountArray = (n = 20) => {
    const start = parseInt(doubleRange.min);
    const end = parseInt(doubleRange.max);
    const arr = generateArray(n, start, end);
    let heightMultiplier
    let widthMultiplier
    ({heightMultiplier, widthMultiplier} = getMultipliers(n));
    for (let i = 0; i < n; i++) {
        const bar = document.createElement("div");
        bar.id = arr[i];
        bar.style.height = `${arr[i] * heightMultiplier }px`;
        bar.style.width = `${10 * widthMultiplier}px`
        bar.classList.add("bar");
        arrayCanvas.appendChild(bar);
    }
}

/*
Allows for in place dynamic resizing of bars on the canvas. 
*/
const alterBarDimensions = () => {
    if (arrayCanvas.hasChildNodes()) {
        const bars = document.querySelectorAll(".bar");
        const n = bars.length;
        let heightMultiplier;
        let widthMultiplier;
        ({heightMultiplier, widthMultiplier} = getMultipliers(n));
        for (let bar of bars) {
            bar.style.height = `${bars.id * heightMultiplier }px`;
            bar.style.width = `${10 * widthMultiplier}px`
        }
    }
}

/*
Get multipliers for dynamic re-sizing of array canvas bars

@param {Number} n Number of bars on the array canvas.
*/
const getMultipliers = (n) => {
    let heightMultiplier = 3;
    let widthMultiplier = 1.5;
    if (n > 40) {
        heightMultiplier = window.visualViewport.height / 200;
        widthMultiplier =  window.visualViewport.width / window.screen.width;
    }
    return {heightMultiplier: heightMultiplier, widthMultiplier: widthMultiplier}
}

/*
Clear all bars from array canvas. 
*/
const clearAll = () => {
    while(arrayCanvas.hasChildNodes()) {
        arrayCanvas.removeChild(arrayCanvas.lastChild);
    }
}

/*
Refresh array canvas 
*/
const refreshCanvas = () => {
    const n = document.querySelectorAll(".bar").length;
    clearAll();
    mountArray(n);
}

/*
Check color is supported by the browser. 
*/
const isColor = (strColor) => {
    return CSS.supports('color', strColor);
}

/*
Create color change ripple effect on bars

@param {Array}  arr   Array to be manipulated.
@param {Number} ticks The time delay in milliseconds.
*/
const ripple = async (arr, ticks, strColor) => {
    if (isColor(strColor)) {
        for (let i = 0; i < arr.length; i++) {
            await delay(ticks);
            arr[i].style.backgroundColor = strColor;
        }
    } else {
        throw new Error("color not supported by browser");
    }
}

/*
Swap the heights of two elements in a DOM element array

@param {Array}  arr Array to be manipulated
@param {Number} a   Index of first element to be swapped
@param {Number} b   Index of seacond element to be swapped
*/
const swap = (arr, a, b) => {
    const temp = arr[a].style.height;
    arr[a].style.height = arr[b].style.height;
    arr[b].style.height = temp;
}

// ======= WIRE DOM ========
window.addEventListener("DOMContentLoaded", () => {
    mountArray();
});

window.addEventListener('resize', () => {
    alterBarDimensions();
});

sizeSlider.oninput = function() {
    if (sizeSlider.value > sliderPrev) {
        clearAll();
        mountArray(sizeSlider.value)
    }
            
    if (sizeSlider.value < sliderPrev)    {
        clearAll();
        mountArray(sizeSlider.value)
    }
    sliderPrev = sizeSlider.value;
}

generateArrayBtn.addEventListener("click", () => {
    refreshCanvas();
});

/*
Modal overlay disables UI buttons and sliders whilst vizualization
is taking place 
*/
const toggleModal = () => {
    modalOverlay.classList.toggle("modal-overlay-show");
}

playBtn.addEventListener("click",  async () => {
    const bars = Array.from(document.querySelectorAll(".bar"));
    toggleModal();
    await ALGOS[algoOptions.value](bars, (BASE_TICKS / speedSlider.value));
    toggleModal();
});

algoOptions.addEventListener("change", () => {
    refreshCanvas();
});
//===========================

export { swap, ripple }