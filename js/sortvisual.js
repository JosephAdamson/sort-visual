"use strict;"

import { generateArray, delay } from "./utils/helper.js";
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
const arrayCanvasOne = document.querySelector("#array-canvas-1");
const arrayCanvasTwo = document.querySelector("#array-canvas-2");
const algoOptionsOne = document.querySelector("#algo-options-1");
const algoOptionsTwo = document.querySelector("#algo-options-2");
const togglebtn = document.querySelector("#toggle-btn");
const togglebtnSlider = document.querySelector("#toggle-btn-slider")
const modalOverlay = document.querySelector("#modal-overlay");

// Gloabl attributes
let sliderPrev = sizeSlider.value;
let dualMode = false;
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

@param {HTMLElement} canvas An object representing the array canvas.
@param {Number}      n      The size of the array to be generated.
*/
const renderArrayCanvas = (options) => {
    if (typeof(options) !== "object") {
        throw new Error("function argument must be an object");
    }
    const start = parseInt(doubleRange.min);
    const end = parseInt(doubleRange.max);

    const canvas = options.canvas || null;
    const n = options.n || 20;
    const arr = options.arr || generateArray(n, start, end);

    if (!canvas) {
        throw new Error("Canvas not provided");
    }
    let heightMultiplier;
    let widthMultiplier;
    ({heightMultiplier, widthMultiplier} = getMultipliers(n));
    for (let i = 0; i < n; i++) {
        const bar = document.createElement("div");
        bar.id = arr[i];
        const arrID = document.createAttribute("arr-id");
        arrID.value = canvas.id;
        bar.setAttributeNode(arrID);
        bar.style.height = `${arr[i] * heightMultiplier }px`;
        bar.style.width = `${10 * widthMultiplier}px`
        bar.classList.add("bar");
        canvas.appendChild(bar);
    }
}

/*
Allows for in place dynamic resizing of bars on the canvas. 
*/
const alterBarDimensions = (canvas) => {
    if (typeof(canvas) !== "object") {
        throw new Error("function argument must be an object");
    }
    if (canvas.hasChildNodes()) {
        const bars = document.querySelectorAll(`[arr-id="${canvas.id}"]`);
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
Clear array canvas. 
@param  {HTMLElement} canvas An object representing the array canvas.
*/
const clearCanvas = (canvas) => {
    if (typeof(canvas) !== "object") {
        throw new Error("function argument must be an object");
    }
    while(canvas.hasChildNodes()) {
        canvas.removeChild(canvas.lastChild);
    }
}

/*
Extracts id (integer values) from bar HTMLElements.

@param  {HTMLElement} canvas An object representing the array canvas.
@return {Number}             An array of integers.
*/
const canvasToArray = (canvas) => {
    if (typeof(canvas) !== "object") {
        throw new Error("function argument must be an object");
    }
    const result = [];
    const bars = document.querySelectorAll(`[arr-id="${canvas.id}"]`);
    for (let bar of bars) {
        result.push(bar.id);
    }
    return result
}

/*
Refresh array canvas.

@param {HTMLElement} canvas An object representing the array canvas.
*/
const refreshArrayCanvas = (canvas) => {
    if (typeof(canvas) !== "object") {
        throw new Error("function argument must be an object");
    }
    const n = document.querySelectorAll(`[arr-id="${canvas.id}"]`).length;
    clearCanvas(canvas);
    renderArrayCanvas({canvas: canvas, n: n, arr: null});
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

/*


@param {HTMLElement} canvas An object representing the array canvas. 
@param {String}      algo   Algorithm to be executed 
*/
const executeAlgo = async (canvas, algo) => {
    const arrOne = Array.from(document.querySelectorAll(`[arr-id="${canvas.id}"]`));
    await ALGOS[algo](arrOne, (BASE_TICKS / speedSlider.value));
}

// ======= WIRE DOM ========
window.addEventListener("DOMContentLoaded", () => {
    renderArrayCanvas({canvas: arrayCanvasOne, n: null, arr: null});
});

window.addEventListener('resize', () => {
    alterBarDimensions(arrayCanvasOne);
    if (dualMode) {
        alterBarDimensions(arrayCanvasTwo);
    }
});

doubleRange.oninput = function() {
    refreshArrayCanvas(arrayCanvasOne);
    if (dualMode) {
        refreshArrayCanvas(arrayCanvasTwo);
    };
}

sizeSlider.oninput = function() {
    if (sizeSlider.value > sliderPrev) {
        clearCanvas(arrayCanvasOne);
        renderArrayCanvas({canvas: arrayCanvasOne, n: sizeSlider.value, arr: null});

        if (dualMode) {
            clearCanvas(arrayCanvasTwo);
            renderArrayCanvas({canvas: arrayCanvasTwo, n: sizeSlider.value, arr: null});
        }
    }
            
    if (sizeSlider.value < sliderPrev)    {
        clearCanvas(arrayCanvasOne);
        renderArrayCanvas({canvas: arrayCanvasOne, n: sizeSlider.value, arr: null})

        if (dualMode) {
            clearCanvas(arrayCanvasTwo);
            renderArrayCanvas({canvas: arrayCanvasTwo, n: sizeSlider.value, arr: null});
        }
    }
    sliderPrev = sizeSlider.value;
}

generateArrayBtn.addEventListener("click", () => {
    refreshArrayCanvas(arrayCanvasOne);
    if (dualMode) {
        refreshArrayCanvas(arrayCanvasTwo);
    }
});

/*
Modal overlay disables UI buttons and sliders whilst vizualization
is taking place 
*/
const toggleModal = () => {
    modalOverlay.classList.toggle("modal-overlay-show");
    console.log("OK");
}

playBtn.addEventListener("click",  async () => {
    toggleModal();
    await Promise.all([
        executeAlgo(arrayCanvasOne, algoOptionsOne.value),
        executeAlgo(arrayCanvasTwo, algoOptionsTwo.value)]
        );
    toggleModal();
});

algoOptionsOne.addEventListener("change", () => {
    refreshArrayCanvas(arrayCanvasOne);
});

algoOptionsTwo.addEventListener("change", () => {
    if (dualMode) {
        refreshArrayCanvas(arrayCanvasTwo);
    }
})

togglebtn.addEventListener("click", () => {
    if (!dualMode) {
        togglebtnSlider.classList.add("toggle-container__slider-slide");
        const copy =  canvasToArray(arrayCanvasOne);
        renderArrayCanvas({canvas: arrayCanvasTwo, n: sizeSlider.value, arr: copy});
        dualMode = true;
    } else {
        togglebtnSlider.classList.remove("toggle-container__slider-slide");
        clearCanvas(arrayCanvasTwo)
        dualMode = false;
    }
});
//===========================

export { swap, ripple };