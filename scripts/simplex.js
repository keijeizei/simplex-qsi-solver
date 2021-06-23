//initial GUI tableau dimensions
var colCount = 3;
var rowCount = 4;

function addRow() {
    const table = document.getElementById("simplexBasicTable");
    const row = table.insertRow(-1);
    for(var i = 0; i < colCount + 1; i++) {
        var cell = row.insertCell(-1);
        var newCell = null;
        //for the row number feature
        if(i === 0) {
            newCell = document.createElement('p');
            newCell.innerHTML = rowCount;

            cell.appendChild(newCell);
        }
        else if(i === 1) {
            newCell = document.createElement('input');
            newCell.setAttribute("type", "number");
            newCell.setAttribute("value", 0);

            const variable = document.createElement('span');
            variable.innerHTML = " X" + i;

            newCell.setAttribute("onClick", "this.select()");
            cell.appendChild(newCell);
            cell.appendChild(variable);
        }
        else if(i === colCount) {
            const sign = document.createElement('select');
            sign.id = "inequality";
            const less = document.createElement('option');
            less.value = "less";
            less.innerHTML = "&#x2264;";
            sign.add(less);

            const greater = document.createElement('option');
            greater.value = "greater";
            greater.innerHTML = "&#x2265;";
            sign.add(greater);

            newCell = document.createElement('input');
            newCell.setAttribute("type", "number");
            newCell.setAttribute("value", 0);

            newCell.setAttribute("onClick", "this.select()");
            cell.appendChild(sign);
            cell.appendChild(newCell);
        }
        else {
            const sign = document.createElement('span');
            sign.innerHTML = "+ ";

            newCell = document.createElement('input');
            newCell.setAttribute("type", "number");
            newCell.setAttribute("value", 0);

            const variable = document.createElement('span');
            variable.innerHTML = " X" + i;

            newCell.setAttribute("onClick", "this.select()");
            cell.appendChild(sign);
            cell.appendChild(newCell);
            cell.appendChild(variable);
        }
    }
    rowCount++;
}

function addCol() {
    const table = document.getElementById("simplexBasicTable");

    for(var i = 0; i < rowCount; i++) {
        const cell = table.rows[i].insertCell(colCount);

        const sign = document.createElement('span');
        sign.innerHTML = "+ ";
        
        const newCell = document.createElement('input');
        newCell.setAttribute("type", "number");
        newCell.setAttribute("value", 0);
        newCell.setAttribute("onClick", "this.select()");

        const variable = document.createElement('span');
        variable.innerHTML = " X" + colCount;

        cell.appendChild(sign);
        cell.appendChild(newCell);
        cell.appendChild(variable);
    }
    //update variable list
    const variableList = document.getElementById('variableList');
    variableList.innerHTML = variableList.innerHTML + ", X" + colCount;
    colCount++;
}

function deleteRow() {
    if(rowCount > 2) {
        const table = document.getElementById("simplexBasicTable");
        table.deleteRow(-1);
        rowCount--;
    }
}

function deleteCol() {
    if(colCount > 2) {
        const table = document.getElementById("simplexBasicTable");
        for(var i = 0; i < rowCount; i++) {
            table.rows[i].deleteCell(colCount - 1);
        }
        //update variable list
        const variableList = document.getElementById('variableList');
        variableList.innerHTML = variableList.innerHTML.slice(0, -4);
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
    const rowCountTab = tableau.length;
    const colCountTab = tableau[0].length;
    const labelArray = createLabelArray(tableau);

    const container = document.getElementById("stepBystepSolutions");

    const iterationTitle = document.createElement('h2');
    iterationTitle.setAttribute("id", "tableTitle");
    iterationTitle.innerHTML = "ITERATION " + iterationCount;
    container.appendChild(iterationTitle);

    const solutionTable = document.createElement('table');
    solutionTable.setAttribute("id", "solutionTable");
    container.appendChild(solutionTable);

    for(var i = 0; i < rowCountTab + 1; i++) {
        var row = solutionTable.insertRow(-1);
        for(var j = 0; j < colCountTab; j++) {
            var cell = row.insertCell(-1);
            var newCell = document.createElement('p');
            //first row, the label row
            if(i === 0) {
                newCell.innerHTML = labelArray[j];
            }
            //the rest of the tableau
            else {
                newCell.innerHTML = tableau[i - 1][j];
            }
            cell.appendChild(newCell);
        }
    }
    
}

function displayFinalSolution(tableau, isMax, solutionExists, roundingFactor) {
    const container = document.getElementById("stepBystepSolutions");
    if(!solutionExists) {
        const title = document.createElement('h2');
        title.setAttribute("id", "tableTitle");
        title.innerHTML = `${isMax ? "Maximization" : "Minimization"} Unique solution does not exist.`;
        container.appendChild(title);
    }
    else {
        const rowCountTab = tableau.length;
        const colCountTab = tableau[0].length;
        const labelArray = createLabelArray(tableau);

        const title = document.createElement('h2');
        title.setAttribute("id", "tableTitle");
        title.innerHTML = "FINAL SOLUTION";
        container.appendChild(title);

        const finalSolution = document.createElement('table');
        finalSolution.setAttribute("id", "finalSolution");
        container.appendChild(finalSolution);

        for(var i = 0; i < 2; i++) {
            var row = finalSolution.insertRow(-1);
            for(var j = 0; j < colCountTab - 1; j++) {     //colCount - 1 removes the Solution column
                var cell = row.insertCell(-1);
                var newCell = document.createElement('p');
                //first row, the label row
                if(i == 0) {
                    newCell.innerHTML = labelArray[j];
                }
                //the rest of the tableau
                else {
                    if(isMax) {
                        //isBasic is true if column only has 0 and 1
                        const isBasic = tableau.every((colValue) => colValue[j] == 0 || colValue[j] == 1);

                        if(isBasic) {
                            //find the row k which has the 1 value and get the corresponding value in the solution column
                            for(var k = 0; k < rowCountTab; k++) {
                                if(tableau[k][j] === 1) {
                                    newCell.innerHTML = Math.round(tableau[k][colCountTab - 1] * roundingFactor) / roundingFactor;
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
                        if(j == colCountTab - 2) {
                            newCell.innerHTML = Math.round(tableau[rowCountTab - 1][j + 1] * roundingFactor) / roundingFactor;
                        }
                        else {
                            newCell.innerHTML = Math.round(tableau[rowCountTab - 1][j] * roundingFactor) / roundingFactor;
                        }
                    }
                }
                cell.appendChild(newCell);
            }
        }
    }
}

//create the top row labels of the tableau to simulate a tableau input
function createLabelArray(tableau) {
    const varCount = (tableau[0].length - tableau.length - 1);     //tableau.length - 1 is the slack variables and solution row
    const slackCount = tableau.length - 1;
    label = [];
    //add the variable names
    for(var i = 0; i < varCount; i++) {
        label.push("X" + (i + 1));
    }
    //add the variable names
    for(var i = 0; i < slackCount; i++) {
        label.push("S" + (i + 1));
    }
    label.push("Z", "Solution");
    return label;
}

function scrapeTableau(isMax) {
    //GET THE TABLEAU
    var tableau = [];
    const table = document.getElementById("simplexBasicTable");

    //get every cell value and push to the tableau
    for(var i = 0; i < rowCount; i++) {
        tableau.push([]);
        for(var j = 1; j < colCount + 1; j++) {
            //first column, input is at children[0]
            if(j === 1) tableau[i].push(parseFloat(table.rows[i].cells[j].children[0].value));
            //last column
            else if(j === colCount && i === 0) {
                tableau[i].push(0);                     //0 is pushed instead of 1 because last row last column of tableau is 0
            }
            else if(j === colCount) {
                tableau[i].push(parseFloat(table.rows[i].cells[j].children[1].value));
            }
            //second to second-to-the-last column, input is at children[1]
            else tableau[i].push(parseFloat(table.rows[i].cells[j].children[1].value));

        }

        //maximization uses less than or equal by default. if greater than or equal is encountered,
        //reverse the sign of every element to reverse the inequality sign
        if(isMax && table.rows[i].cells[colCount].children[0].value === "greater") {
            tableau[i] = tableau[i].map(x => -x);
        }
        //do the same for minimization problems which uses greater than or equal by default
        else if(!isMax && table.rows[i].cells[colCount].children[0].value === "less") {
            tableau[i] = tableau[i].map(x => -x);
        }
    }

    //put first row to last row
    tableau.push(tableau[0]);
    tableau.shift();
    
    //MINIMIZATION PROBLEM, TRANSPOSE FIRST
    if(!isMax) {
        //transpose the matrix
        tableau = tableau[0].map((_, i) => tableau.map(x => x[i]));    
    }

    //negate the last row
    tableau[tableau.length - 1] = tableau[tableau.length - 1].map(x => -x);

    const varCount = tableau[0].length - 1;                                //new variable count of the transposed (or not) matrix

    //add slack variables
    for(var i = 0; i < tableau.length; i++) {
        for(var j = 0; j < tableau.length; j++) {
            if(i === j) tableau[i].splice(varCount + j, 0, 1);             //push 1
            else tableau[i].splice(varCount + j, 0, 0);                    //push 0
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
    var solutionExists = true;
    // colCountTab+20 is an arbitrary upper limit to avoid infinite loop
    for(var iterationCount = 0; iterationCount < colCountTab + 20; iterationCount++) {
        displayTableau(tableau, iterationCount);
        pivotCol = findPivotCol(tableau);
        //break if there are no negative numbers in the last row
        if(pivotCol == -1) {
            break;
        }
        pivotRow = findPivotRow(tableau, pivotCol);
        
        //break if there are no positive TR left
        if(pivotRow == -1) {
            solutionExists = false;
            break;
        }

        const pivotElement = tableau[pivotRow][pivotCol];

        //x divide pivotElement, then round off
        const normalizedRow = tableau[pivotRow].map(x => x / pivotElement);

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

        //if the iteration upper limit is met, then it has no unique solutions
        if(iterationCount == colCountTab + 19) {
            solutionExists = false;
        }
    }
    displayFinalSolution(tableau, isMax, solutionExists, roundingFactor);
}