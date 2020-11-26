//initial GUI tableau dimensions
var colCount = 7;
var rowCount = 5;
var varCount = 2;
var slackCount = 3;

function addRow() {
    const table = document.getElementById("table");
    const row = table.insertRow(-1);
    for(var i = 0; i < colCount + 1; i++) {
        var cell = row.insertCell(-1);
        var newCell = null;
        //for the row number feature
        if(i == 0) {
            newCell = document.createElement('p');
            newCell.innerHTML = rowCount;
        }
        else {
            newCell = document.createElement('input');
            newCell.setAttribute("value", 0);
        }
        newCell.setAttribute("onClick", "this.select()");
        cell.appendChild(newCell);
    }
    rowCount++;
}

function addCol(type) {
    const table = document.getElementById("table");
    var colNumber;
    var colTitle;
    if(type === 'variable') {
        varCount++;
        colNumber = varCount;
        colTitle = 'X' + varCount;
    }
    else if(type === 'slack') {
        slackCount++;
        colNumber = colCount - 1;
        colTitle = 'S' + slackCount;
    }

    for(var i = 0; i < rowCount; i++) {
        const cell = table.rows[i].insertCell(colNumber);
        const newCell = document.createElement('input');
        //top rows should accept text
        if(i == 0) {
            newCell.setAttribute("id", type === 'variable' ? 'blue' : 'teal');
            newCell.setAttribute("type", "text");
            newCell.setAttribute("value", colTitle);
        }
        else {
            newCell.setAttribute("type", "number");
            newCell.setAttribute("value", 0);
        }
        newCell.setAttribute("onClick", "this.select()");
        cell.appendChild(newCell);
    }
    colCount++;
}

function deleteRow() {
    if(rowCount > 2) {
        const table = document.getElementById("table");
        table.deleteRow(-1);
        rowCount--;
    }
}

function deleteCol(type) {
    var colNumber;
    if(type === 'variable') {
        if(varCount < 2) return;
        colNumber = varCount;
        varCount--;
    }
    else if(type === 'slack') {
        if(slackCount < 1) return;
        colNumber = colCount - 2;
        slackCount--;
    }
    if(colCount > 2) {
        const table = document.getElementById("table");
        for(var i = 0; i < rowCount; i++) {
            table.rows[i].deleteCell(colNumber);
        }
        colCount--;
    }
}

//returns the index of the smallest negative number in the last row
function findPivotCol(tableau) {
    var min = tableau[rowCountTab - 1][0];
    var minIndex = -1;
    for(var i = 0; i < colCountTab - 1; i++) {
        //smallest negative number
        if((tableau[rowCountTab - 1][i] < 0) && (tableau[rowCountTab - 1][i] <= min)) {
            min = tableau[rowCountTab - 1][i];
            minIndex = i;
        }
    }
    return(minIndex);
}

//returns the index of the smallest positive test ratio of a given column
function findPivotRow(tableau, pivotCol) {
    var min = null;
    var minIndex = -1;

    for(var i = 0; i < rowCountTab - 1; i++) {
        testRatio = tableau[i][colCountTab - 1] / tableau[i][pivotCol];
        //smallest positive test ratio
        if(testRatio > -1) {
            //no min yet, just assign
            if(min == null) {
                min = testRatio;
                minIndex = i;
            }
            //smaller min is found
            else if(testRatio <= min) {
                min = testRatio;
                minIndex = i;
            }
        }
    }
    return(minIndex);
}

function displayTableau(tableau, iterationCount) {
    const container = document.getElementById("stepBystepSolutions");

    const iterationTitle = document.createElement('h2');
    iterationTitle.setAttribute("id", "tableTitle");
    iterationTitle.innerHTML = "ITERATION " + iterationCount;
    container.appendChild(iterationTitle);

    const table = document.getElementById("table");

    const solutionTable = document.createElement('table');
    solutionTable.setAttribute("id", "solutionTable");
    container.appendChild(solutionTable);

    for(var i = 0; i < rowCount; i++) {
        var row = solutionTable.insertRow(-1);
        for(var j = 0; j < colCount; j++) {
            var cell = row.insertCell(-1);
            var newCell = document.createElement('p');
            //first row, the label row
            if(i == 0) {
                newCell.innerHTML = table.rows[0].cells[j + 1].children[0].value;
            }
            //the rest of the tableau
            else {
                newCell.innerHTML = tableau[i - 1][j];
            }
            cell.appendChild(newCell);
        }
    }
}

function displayFinalSolution(tableau, isMax, roundingFactor) {
    const container = document.getElementById("stepBystepSolutions");

    const title = document.createElement('h2');
    title.setAttribute("id", "tableTitle");
    title.innerHTML = "FINAL SOLUTION";
    container.appendChild(title);

    const finalSolution = document.createElement('table');
    finalSolution.setAttribute("id", "finalSolution");
    container.appendChild(finalSolution);

    for(var i = 0; i < 2; i++) {
        var row = finalSolution.insertRow(-1);
        for(var j = 0; j < colCount - 1; j++) {     //colCount - 1 removes the Solution column
            var cell = row.insertCell(-1);
            var newCell = document.createElement('p');
            //first row, the label row
            if(i == 0) {
                newCell.innerHTML = table.rows[0].cells[j + 1].children[0].value;
            }
            //the rest of the tableau
            else {
                if(isMax) {
                    //isBasic is true if column only has 0 and 1
                    const isBasic = tableau.every((colValue) => colValue[j] == 0 || colValue[j] == 1);

                    if(isBasic) {
                        //find the row k which has the 1 value and get the corresponding value in the solution column
                        for(var k = 0; k < rowCount - 1; k++) {
                            if(tableau[k][j] === 1) {
                                newCell.innerHTML = Math.round(tableau[k][colCount - 1] * roundingFactor) / roundingFactor;
                            }
                        }
                    }
                    else{
                        //put 0 as value to the non-basic
                        newCell.innerHTML = 0;
                    }
                }
                else {
                    //Z value (last column) should get the value from the last row last column
                    if(j == colCount - 2) {
                        newCell.innerHTML = Math.round(tableau[rowCount - 2][j + 1] * roundingFactor) / roundingFactor;
                    }
                    else {
                        newCell.innerHTML = Math.round(tableau[rowCount - 2][j] * roundingFactor) / roundingFactor;
                    }
                }
            }
            cell.appendChild(newCell);
        }
    }
}

function scrapeTableau() {
    //GET THE TABLEAU
    var tableau = [];
    const table = document.getElementById("table");
    //get every cell value and push to the tableau
    for(var i = 1; i < rowCount; i++) {
        tableau.push([]);
        for(var j = 1; j < colCount + 1; j++) {
            tableau[i - 1].push(parseFloat(table.rows[i].cells[j].children[0].value));
        }
    }
    return tableau;
}

function simplex(tableau, isMax) {
    //clear the previous tableau
    document.getElementById("stepBystepSolutions").innerHTML = "";

    //rowCount and colCount for the numerical tableau
    rowCountTab = tableau.length;
    colCountTab = tableau[0].length;

    //get the number of decimal places
    var roundingFactor;
    const precision = document.getElementById("precision");
    //precision should only be within 0-20
    if(precision.value > 20) {
        precision.value = 20;
    }
    else if(precision.value < 0) {
        precision.value = 0;
    }
    roundingFactor = Math.pow(10, precision.value);

    //SOLVE
    iterationCount = 0;
    displayTableau(tableau, iterationCount);
    while(1) {
        pivotCol = findPivotCol(tableau);
        //break if there are no negative numbers in the last row
        if(pivotCol == -1) {
            break;
        }
        pivotRow = findPivotRow(tableau, pivotCol);

        const pivotElement = tableau[pivotRow][pivotCol];

        //x divide pivotElement, then round off
        const normalizedRow = tableau[pivotRow].map((x) => x / pivotElement);

        tableau[pivotRow] = normalizedRow;

        //elimination
        for(var i = 0; i < rowCountTab; i++) {
            var row = [];
            if(i == pivotRow) continue;
            for(var j = 0; j < colCountTab; j++) {
                eliminatedValue = tableau[i][j] - (normalizedRow[j] * tableau[i][pivotCol]);
                row.push(eliminatedValue);
            }
            tableau[i] = row;
        }

        //round-off every value if persistent precision is enabled
        if(document.getElementById("persistentPrecision").checked) {
            tableau = tableau.map(row => row.map(x => Math.round(x * roundingFactor) / roundingFactor));
        }

        displayTableau(tableau, ++iterationCount);
    }
    displayFinalSolution(tableau, isMax, roundingFactor);
}