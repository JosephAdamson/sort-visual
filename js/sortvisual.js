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
const sliderlabels = document.querySelectorAll(".slider-label");

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
        throw new Error("Array canvas not provided");
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

@param {HTMLElement} canvas An object representing the array canvas.
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
const refreshArrayCanvas = (options) => {
    if (typeof(options) !== "object") {
        throw new Error("function argument must be an object");
    }
    const canvas = options.canvas || null;
    const n = options.n || document.querySelectorAll(`[arr-id="${canvas.id}"]`).length;

    if (!canvas) {
        throw new Error("Array canvas not provided");
    }

    //const n = document.querySelectorAll(`[arr-id="${canvas.id}"]`).length;
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
Create color change ripple effect on bars.

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
Swap the heights of two elements in a DOM element array.

@param {Array}  arr Array to be manipulated.
@param {Number} a   Index of first element to be swapped.
@param {Number} b   Index of seacond element to be swapped.
*/
const swap = (arr, a, b) => {
    const temp = arr[a].style.height;
    arr[a].style.height = arr[b].style.height;
    arr[b].style.height = temp;
}

/*
Allow multiple sort algorithms to be executed asyncronously.

@param {HTMLElement} canvas An object representing the array canvas. 
@param {String}      algo   Algorithm to be executed 
*/
const executeAlgo = async (canvas, algo) => {
    const arrOne = Array.from(document.querySelectorAll(`[arr-id="${canvas.id}"]`));
    await ALGOS[algo](arrOne, (BASE_TICKS / speedSlider.value));
}

// ======= WIRE DOM ========
window.addEventListener("DOMContentLoaded", () => {
    // add display bubbles above sliders
    renderArrayCanvas({canvas: arrayCanvasOne, n: null, arr: null});
    sliderlabels.forEach((label) => {
        label.insertAdjacentHTML("beforebegin", `<span class="bubble" style=>${label.children[0].value}</span>`);
    });
    // set up initial position of range display 'bubbles'
    setBubblePos(sizeSlider);
    setBubblePos(speedSlider);
});

window.addEventListener('resize', () => {
    alterBarDimensions(arrayCanvasOne);
    if (dualMode) {
        alterBarDimensions(arrayCanvasTwo);
    }
});

// double range bar sets the upper and lower bound for values
// displayed on the canvas
doubleRange.oninput = function() {
    refreshArrayCanvas({canvas: arrayCanvasOne, n: null});
    if (dualMode) {
        refreshArrayCanvas({canvas: arrayCanvasTwo, n: null});
    };
}

/*
Wrapper class for setbubble pos, allows us to get DOM object from
event independently.

@param {Event} Dom event object
*/
const bubbleListener = (e) => {
    setBubblePos(e.currentTarget);
}

/*
Update position and content of bubble display above a given range slider.

@param {HTMLElement} targSlider Slider element adjacent to the output bubble.
*/
const setBubblePos = (targSlider) => {
    // had to hard-code this value
    const halfThumbwidth = 27.4 / 2;
    // bubble element added last on page load
    const bubble = targSlider.parentNode.parentNode.children[0];
    const interval = parseInt(targSlider.max) - parseInt(targSlider.min);
    const percent = ((parseInt(targSlider.value) - parseInt(targSlider.min)) / interval) * 100;
    const offset = (halfThumbwidth / 2) + ((halfThumbwidth/100) * percent); 
    bubble.style.left = `calc(${percent}% - ${offset}px)`;
    bubble.textContent = targSlider.value;

}

// change the amount of elements on the canvas
sizeSlider.oninput = function(e) {
    bubbleListener(e);
    if (sizeSlider.value > sliderPrev) {
        refreshArrayCanvas({canvas: arrayCanvasOne, n: sizeSlider.value});

        if (dualMode) {
            refreshArrayCanvas({canvas: arrayCanvasTwo, n: sizeSlider.value});
        }
    }
            
    if (sizeSlider.value < sliderPrev)    {
        refreshArrayCanvas({canvas: arrayCanvasOne, n: sizeSlider.value})

        if (dualMode) {
            refreshArrayCanvas({canvas: arrayCanvasTwo, n: sizeSlider.value});
        }
    }
    sliderPrev = sizeSlider.value;
}

speedSlider.oninput = bubbleListener;

// refresh array on display
generateArrayBtn.addEventListener("click", () => {
    refreshArrayCanvas({canvas: arrayCanvasOne, n: null});
    if (dualMode) {
        refreshArrayCanvas({canvas: arrayCanvasTwo, n: null});
    }
});

// Modal overlay disables UI buttons and sliders whilst vizualization
// is taking place 
const toggleModal = () => {
    modalOverlay.classList.toggle("modal-overlay-show");
}

// execute sort animation event
playBtn.addEventListener("click",  async () => {
    toggleModal();
    document.onkeydown = () => {return false;}
    await Promise.all([
        executeAlgo(arrayCanvasOne, algoOptionsOne.value),
        executeAlgo(arrayCanvasTwo, algoOptionsTwo.value)]
        );
    document.onkeydown = () => {return true;}
    toggleModal();
});

// pick which algos you want to see animated
algoOptionsOne.addEventListener("change", () => {
    refreshArrayCanvas({canvas: arrayCanvasOne, n: null});
});

algoOptionsTwo.addEventListener("change", () => {
    if (dualMode) {
        refreshArrayCanvas({canvas: arrayCanvasTwo, n: null});
    }
})

// Pick between one or two arrays
togglebtn.addEventListener("click", () => {
    if (!dualMode) {
        togglebtnSlider.classList.add("toggle-container__slider-slide");
        const copy =  canvasToArray(arrayCanvasOne);
        renderArrayCanvas({canvas: arrayCanvasTwo, n: copy.length, arr: copy});
        dualMode = true;
    } else {
        togglebtnSlider.classList.remove("toggle-container__slider-slide");
        clearCanvas(arrayCanvasTwo)
        dualMode = false;
    }
});
//===========================

export { swap, ripple };