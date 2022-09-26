// Helper methods for array generation and manipulation.

/*
Genrate an array of integers in the interval: [start, end]

@param  {Number} n     Number of elements for the return array.
@param  {Number} start Lower bound of the interval.
@param  {Number} end   Upper bound of the interval.
@return {Array}        Array of size n.         
*/
const generateArray = (n, start, end) => {
    return Array.from(
        {length: n}, 
        () => Math.floor(Math.random() * (end - start + 1) + start)
        );
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

export {generateArray, delay}