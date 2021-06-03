var board;
var mainArray;
var nbOfElements = 100;
var range = 30;
const defaultLineColor = "#4D5061";
const noMatchLineColor = "#EF626C";
const matchLineColor = "#5C80BC";
const completeLineColor = "#688B58";
const touchedColor = "#8E7DBE";

const baseSpeed = 25;
var selectedSpeed = baseSpeed;
var isComplete;
var isStarted = false;
const speedInput = document.getElementById("speed");
speedInput.addEventListener('input', updateSpeed);
const sortingTypes = [[algoName = "Merge", functionName = mergerSort],[algoName = "Selection", functionName = selectionSort], [algoName = "Insertion", functionName = insertionSort]
    , [algoName = "Bubble", functionName = bubbleSort]];
const sortingDOM = document.getElementById("algorithmPick");
const nDOM = document.getElementById("n");
var selectedSorting = selectionSort;

function createSortingInputs(sortingTypes, sortingDOM) {
    sortingTypes.forEach(e => {
        const [name, func] = e;
        let inputDOM = document.createElement("input");
        inputDOM.type = "radio";
        inputDOM.name = "algorithm";
        inputDOM.id = name;
        inputDOM.value = name;
        if (func === selectedSorting) inputDOM.checked = "checked";
        inputDOM.addEventListener("change", function () {
            if (selectedSorting !== func) {
                selectedSorting = func;
            }
        });


        let labelDOM = document.createElement("label");
        labelDOM.for = name;
        labelDOM.textContent = name + " Sort";

        sortingDOM.appendChild(inputDOM);
        sortingDOM.appendChild(labelDOM);
    }
    );
}

/*
possible solutions to visualization Promise.all
*/

class LineObject {
    constructor(element, height) {
        this.element = element;
        this.height = height;
    }
    setNewHeight(height) {
        this.height = height;
        this.element.style.height = height * 10 + "px";
    }
    setColor(color) {
        this.element.style.backgroundColor = color;
    }
}
function updateSpeed() {
    selectedSpeed = baseSpeed / (speedInput.value / 2);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function colorAllGreen() {
    mainArray.forEach(element => {
        element.style.backgroundColor = completeLineColor;
    });
}
async function startPress() {
    if (isStarted || isComplete) return;
    isStarted = true;
    /*
    todo:
    -different algorithms of sorting
    -include generate new array
    -one choice checklist to chose algorithm with if statements in here
    */
    // it's a switch statement for now, but you could find a way to store a function in each radios
    
    if (selectedSorting === mergerSort){
        await mergerSort(0,mainArray.length-1,selectedSpeed);
    }
    else{
    await selectedSorting(selectedSpeed);
    }
    for (const line of mainArray) {
        line.element.style.backgroundColor = completeLineColor;
        await sleep(15);
    }
    
    
    isStarted = false;
    isComplete = true;
}
// s for start e for end
async function mergerSort(s, e, speed){
    console.log(s + " " + e)
    if (s>=e){
        return;
    }
    // middle
    let m = s + Math.floor((e-s)/2);
    await mergerSort(s,m,speed);
    await mergerSort(m+1,e,speed);
    await merge(s,m,e,speed)

}

async function merge(s, m, e, speed){
    let lenL = m - s + 1;
    let lenR = e - m;

    let left = new Array(lenL);
    let right = new Array(lenR);

    for (let i = 0; i < lenL; i++){
        left[i] = mainArray[s + i].height;
    }
    for (let i = 0; i < lenR; i++){
        right[i] = mainArray[m + i + 1].height;
    }

    // initial indexes of the temp arrays
    let l = 0;
    let r = 0;
    // initial index of main array
    let i = s;

    while (l < lenL && r < lenR){
        if (left[l] <= right[r]){
            mainArray[i].setNewHeight(left[l]);
            await sleep(speed);
            l++;
        }
        else {
            mainArray[i].setNewHeight(right[r]);
            await sleep(speed);
            r++;
        }
        i++;
    }

    while (l<lenL){
        mainArray[i].setNewHeight(left[l]);
        await sleep(speed);
        l++;
        i++;
    }

    while (r<lenR){
        mainArray[i].setNewHeight(right[r]);
        await sleep(speed);
        r++;
        i++;
    }
}

// slightly optimized bubble sort
async function bubbleSort(speed) {
    let n = mainArray.length - 1;
    let isSwap;
    do {
        isSwap = false;
        for (let i = 0; i < n; i++) {
            mainArray[i].element.style.backgroundColor = matchLineColor;

            if (mainArray[i].height > mainArray[i + 1].height) {
                mainArray[i + 1].setColor(matchLineColor);
                await sleep(speed);
                switchLines(i, i + 1);
                mainArray[i + 1].element.style.backgroundColor = defaultLineColor;
                await sleep(speed);
                isSwap = true;
            }
            else {
                mainArray[i + 1].element.style.backgroundColor = noMatchLineColor;
                await sleep(speed);
            }
            mainArray[i].element.style.backgroundColor = defaultLineColor;
        }
        mainArray[n].element.style.backgroundColor = completeLineColor;
        n--;

    } while (isSwap)

}

async function selectionSort(speed) {
    for (let i = 0; i < mainArray.length; i++) {
        
        mainArray[i].element.style.backgroundColor = matchLineColor;
        let min = mainArray[i].height;
        let minIndex = i;
        for (let j = i + 1; j < mainArray.length; j++) {
            if (min > mainArray[j].height) {
                min = mainArray[j].height;
                if (minIndex != i) mainArray[minIndex].element.style.backgroundColor = defaultLineColor;
                minIndex = j;
                mainArray[j].element.style.backgroundColor = matchLineColor;
                await sleep(speed);
            } else {
                mainArray[j].element.style.backgroundColor = noMatchLineColor;
                await sleep(speed);
                mainArray[j].element.style.backgroundColor = defaultLineColor;
            }

        }
        if (minIndex !== i) {
            await sleepSwitchLines(i, minIndex, speed);
            mainArray[minIndex].element.style.backgroundColor = defaultLineColor;
        }
        mainArray[i].element.style.backgroundColor = completeLineColor;
    }
}
// finish
async function insertionSort(speed) {
    // for [x][y][z]
    for (let i = 1; i < mainArray.length; i++) {
        // let currentHeight = [z]

        let currentHeight = mainArray[i].height;
        // [z] < [y] ?
        if (currentHeight < mainArray[i - 1].height) {
            // [z] [y]
            mainArray[i - 1].element.style.backgroundColor = matchLineColor;
            mainArray[i].element.style.backgroundColor = matchLineColor;
            await sleepSwitchLines(i - 1, i, speed);
            mainArray[i].element.style.backgroundColor = touchedColor;
            // [x]
            let j = i - 2;
            // [z] < [x]
            while (j >= 0) {
                if (currentHeight < mainArray[j].height) {
                    mainArray[j].element.style.backgroundColor = matchLineColor;
                    await sleepSwitchLines(j, j + 1, speed);
                    mainArray[j + 1].element.style.backgroundColor = touchedColor;
                    j--;
                }
                else {
                    mainArray[j].element.style.backgroundColor = noMatchLineColor;
                    await sleep(speed);
                    mainArray[j].element.style.backgroundColor = touchedColor;
                    mainArray[j + 1].element.style.backgroundColor = touchedColor;
                    break;
                }
            }
            mainArray[0].element.style.backgroundColor = touchedColor;

        } else {
            mainArray[i - 1].element.style.backgroundColor = noMatchLineColor;
            await sleep(speed);
            mainArray[i - 1].element.style.backgroundColor = touchedColor;
        }
    }

}

async function sleepSwitchLines(i, j, speed) {
    await sleep(speed);
    switchLines(i, j);
    await sleep(speed);
}
async function switchLines(i, j) {
    let initialHeight = mainArray[i].height;

    mainArray[i].setNewHeight(mainArray[j].height);
    mainArray[j].setNewHeight(initialHeight);


}

function createLines() {
    if (isStarted) return;

    isComplete = false;
    mainArray = [];
    board.textContent = "";
    nDOM.innerText = nbOfElements;

    for (let i = 0; i < nbOfElements; i++) {
        let lineDOM = document.createElement("li");
        let randomHeight = Math.ceil(Math.random() * range);
        lineDOM.style.height = randomHeight * 10 + "px";
        lineDOM.className = "line";
        let line = new LineObject(lineDOM, randomHeight);

        board.appendChild(lineDOM);
        mainArray.push(line);

    }

}

createSortingInputs(sortingTypes, sortingDOM);
board = document.getElementById("hList");
createLines();

