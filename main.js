var board;
var mainArray;
var nbOfElements = 50;
var range = 30;
var defaultLineColor = "#4D5061";
var noMatchLineColor = "#EF626C";
var matchLineColor = "#5C80BC";
var completeLineColor = "#688B58"
const baseSpeed = 50;
var selectedSpeed = baseSpeed;
var isComplete;
var isStarted = false;
const speedInput = document.getElementById("speed");
speedInput.addEventListener('input', updateSpeed);

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
}
function updateSpeed() {
    selectedSpeed = baseSpeed / (speedInput.value / 2);
    console.log(speedInput.value)
    console.log(selectedSpeed)

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function startPress() {
    if (isStarted) return;
    isStarted = true;
    /*
    todo:
    -different algorithms of sorting
    -include generate new array
    -one choice checklist to chose algorithm with if statements in here
    */
    await selectionSort(selectedSpeed);
    isStarted = false;
    isComplete = true;
}

async function selectionSort(speed) {

    for (let i = 0; i < mainArray.length; i++) {
        console.log(i);
        mainArray[i].element.style.backgroundColor = matchLineColor;
        let min = mainArray[i].height;
        let minIndex = i;
        for (let j = i + 1; j < mainArray.length; j++) {
            console.log(i + " vs " + j)
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
            await sleep(speed);
            await switchLines(i, minIndex);
            await sleep(speed);
        }
        mainArray[i].element.style.backgroundColor = completeLineColor;
    }
}

async function switchLines(i, j) {
    let initialHeight = mainArray[i].height;

    mainArray[i].setNewHeight(mainArray[j].height);
    mainArray[j].setNewHeight(initialHeight);
    mainArray[j].element.style.backgroundColor = defaultLineColor;

}

function createLines() {
    if (isStarted) return;

    isComplete = false;
    mainArray = [];
    board.textContent = "";

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


board = document.getElementById("hList");
createLines();

