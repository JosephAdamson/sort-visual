// Helper methods for array generation and manipulation.

/*
Genrate an array of integers where 1 ≤ element ≤ 100

@param  {Number} n Number of elements for the return array
@return {Array}    Array of size n         
*/
const generateArray = (n, start, end) => {
    return Array.from(
        {length: n}, 
        () => Math.floor(Math.random() * (end - start + 1) + start)
        );
}


/*
Fisher yates shuffle for arrays

@param {Array} arr Array to shuffle
*/
const shuffle = (arr) => {
    const n = arr.length - 1;
    for (let i = n; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        swap(arr, i, j);
    }
}


/*
Control the animation speed of the visualizer with a time delay

@param {Number} delay The time delay in milliseconds.
*/
const delay = (ticks) => {
    return new Promise((resolve) => 
        setTimeout(() => resolve("sleeep"), ticks)
        );
}

export {generateArray, shuffle, delay}