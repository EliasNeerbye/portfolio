const bubbleCanvas = document.getElementById('bubbleCanvas');
const quickCanvas = document.getElementById('quickCanvas');
const mergeCanvas = document.getElementById('mergeCanvas');

const bubbleCtx = bubbleCanvas.getContext('2d');
const quickCtx = quickCanvas.getContext('2d');
const mergeCtx = mergeCanvas.getContext('2d');

bubbleCanvas.width = quickCanvas.width = mergeCanvas.width = 800;
bubbleCanvas.height = quickCanvas.height = mergeCanvas.height = 150;

let bubbleArray = [];
let quickArray = [];
let mergeArray = [];

function initializeArrays() {
    bubbleArray = Array.from({length: 100}, () => Math.floor(Math.random() * 150));
    quickArray = [...bubbleArray]; // Copy for fairness in initial conditions
    mergeArray = [...bubbleArray]; // Copy for fairness in initial conditions
}

function drawArray(context, array, highlightedIndices = {}) {
    context.clearRect(0, 0, 800, 150);
    const barWidth = 800 / array.length;
    array.forEach((value, index) => {
        context.fillStyle = highlightedIndices[index] ? highlightedIndices[index] : '#4CAF50';
        context.fillRect(index * barWidth, 150 - value, barWidth, value);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort(context, array) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                let tmp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tmp;
                drawArray(context, array, {[j]: '#FF4136', [j+1]: '#FF4136'});
                await sleep(20);
            }
        }
        drawArray(context, array, {[len - 1 - i]: '#2ECC40'});
    }
}

async function quickSort(context, array, left = 0, right = array.length - 1) {
    const partition = async (array, left, right) => {
        const pivot = array[Math.floor((right + left) / 2)];
        let i = left;
        let j = right;

        while (i <= j) {
            while (array[i] < pivot) i++;
            while (array[j] > pivot) j--;
            if (i <= j) {
                [array[i], array[j]] = [array[j], array[i]];
                drawArray(context, array, {[i]: '#FF4136', [j]: '#FF4136'});
                await sleep(100);
                i++;
                j--;
            }
        }
        return i;
    };

    if (left < right) {
        const index = await partition(array, left, right);
        await Promise.all([
            quickSort(context, array, left, index - 1),
            quickSort(context, array, index, right)
        ]);
    }
}

async function mergeSort(context, array) {
    if (array.length < 2) {
        return array;
    }

    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle, array.length);

    return await merge(context, await mergeSort(context, left), await mergeSort(context, right));
}

async function merge(context, left, right) {
    let result = [];
    let indexLeft = 0;
    let indexRight = 0;
    let resultIndex = 0;

    while (indexLeft < left.length && indexRight < right.length) {
        if (left[indexLeft] < right[indexRight]) {
            result[resultIndex] = left[indexLeft];
            indexLeft++;
        } else {
            result[resultIndex] = right[indexRight];
            indexRight++;
        }
        resultIndex++;
        drawArray(context, result.concat(left.slice(indexLeft)).concat(right.slice(indexRight)), {[resultIndex - 1]: '#FF4136'});
        await sleep(50);
    }

    return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
}

async function runSorts() {
    initializeArrays();
    drawArray(bubbleCtx, bubbleArray);
    drawArray(quickCtx, quickArray);
    drawArray(mergeCtx, mergeArray);

    await Promise.all([
        bubbleSort(bubbleCtx, bubbleArray),
        quickSort(quickCtx, quickArray),
        mergeSort(mergeCtx, mergeArray)
    ]);

    setTimeout(runSorts, 3000); // Reset and rerun after a delay
}

runSorts();
