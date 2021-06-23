//initial counts
var rowCount = 5;                   //rows of the GUI matrix

var isMatrixVisible = false;        //show/hide the gauss-jordan step by step solution

function addRow() {
    const table = document.getElementById("table");
    const row = table.insertRow(-1);
    for(var i = 0; i < 2; i++) {
        var cell = row.insertCell(-1);
        var newCell = document.createElement('input');
        newCell.setAttribute("type", "number");
        newCell.setAttribute("value", 0);
        newCell.setAttribute("onClick", "this.select()");
        cell.appendChild(newCell);
    }
    rowCount++;
}

function deleteRow() {
    if(rowCount > 3) {
        const table = document.getElementById("table");
        table.deleteRow(-1);
        rowCount--;
    }
}

function scrapeMatrix() {
    //GET THE MATRIX
    var matrix = [];
    const table = document.getElementById("table");
    //get every cell value and push to the matrix
    for(var i = 1; i < rowCount; i++) {
        matrix.push([]);
        for(var j = 0; j < 2; j++) {
            matrix[i - 1].push(parseFloat(table.rows[i].cells[j].children[0].value));
        }
    }
    return matrix;
}

function scrapeXValue() {
    return(parseFloat(document.getElementById("xvalue").value));
}

function displayAnswer(x, y, solutions, matrix, roundingFactor) {
    const functions = document.getElementById("functions");
    const bounds = document.getElementById("bounds");
    functions.innerHTML = "";
    bounds.innerHTML = "";
    
    for(var i = 0; i < (solutions.length) / 3; i++) {
        var a = Math.round(solutions[3 * i] * roundingFactor) / roundingFactor;
        var b = Math.round(solutions[3 * i + 1] * roundingFactor) / roundingFactor;
        var c = Math.round(solutions[3 * i + 2] * roundingFactor) / roundingFactor;
        functions.innerHTML = `${functions.innerHTML}${a}x<sup>2</sup> + ${b}x + ${c}</br>`;
        //the empty <sup> is just to match the text height of the functions
        bounds.innerHTML = `${bounds.innerHTML} ${matrix[i][0]} &#x2264; x &#x2264; ${matrix[i + 1][0]} <sup></sup></br>`;
    }

    const yvalue = document.getElementById("yvalue");
    if(y === undefined) {
        yvalue.innerHTML = "The x value is not within the bounds";
    }
    else {
        yvalue.innerHTML = `The value of f(${x}) is ${y}`;
    }
}

function getY(matrix, solutions, roundingFactor, x) {
    var y;
    //find which interval x (the x value parameter) fits
    if(x < matrix[0][0] || x > matrix[rowCountMat - 1][0]) {
        y = undefined;
    }
    else {
        for(var i = rowCountMat - 1; i > -1; i--) {
            if(x == matrix[rowCountMat - 1][0]) {           //edge case where x is the upper bound
                y = matrix[rowCountMat - 1][1];
                break;
            }
            if(x >= matrix[i][0]) {
                y = Math.round((solutions[3 * i] * Math.pow(x, 2) + solutions[3 * i + 1] * x + solutions[3 * i + 2]) * roundingFactor) / roundingFactor;
                // y = (solutions[3 * i] * Math.pow(x, 2) + solutions[3 * i + 1] * x + solutions[3 * i + 2]);
                break;
            }
        }
    }
    return y;
}

//show a graph of the functions using HTML canvas
function displayGraph(matrix, solutions, roundingFactor) {
    const graph = document.createElement('canvas');
    graph.setAttribute('id', 'graph');

    const width = window.innerWidth - 100;          //width of the graph in pixels
    const height = 300;                             //height of the graph in pixels

    const step = 0.0625;                            //steps between curve points, 0.0625 is chosen to avoid floating point errors

    const xmin = matrix[0][0];                      //x axis upper bound
    const xmax = matrix[matrix.length - 1][0];      //x axis lower bound
    const xrange = xmax - xmin;

    var ymin = matrix[0][1];                        //y axis upper bound
    var ymax = matrix[matrix.length - 1][1];        //y axis lower bound

    //determine the real ymin and ymax by calculating all values
    for(var i = 0; i < (xrange + step); i += step) {
        var yTest = getY(matrix, solutions, roundingFactor, i + xmin);
        // console.log(yTest, i + xmin)
        if(yTest > ymax) ymax = yTest;
        else if(yTest < ymin) ymin = yTest;
    }
    const yrange = ymax - ymin;

    const widthFactor = width / xrange;
    const heightFactor = height / yrange;
    
    //set the canvas to the desired dimensions
    graph.width = width;
    graph.height = height;

    var ctx = graph.getContext("2d");

    //keep the lines less than 10, this works by finding the smallest step that would produce at most 10 lines
    var xLineStep;
    for(var i = 1; i < xrange; i++) {
        if(xrange / i < 10) {           //10 or less vertical lines only
            xLineStep = i;
            break;
        }
    }
    var yLineStep;
    for(var i = 1; i < yrange; i++) {
        if(yrange / i < 8) {            //8 or less horizontal lines only
            yLineStep = i;
            break;
        }
    }

    //draw the vertical lines
    //using 1-xmin%1 as the starting i ensures that all the lines will have integer values
    for(var i = (1 - (xmin % 1)); i < xrange; i += xLineStep) {
        ctx.beginPath();
        ctx.strokeStyle = "#BBBBBB";
        ctx.moveTo(i * widthFactor, 0);
        ctx.lineTo(i * widthFactor, height);
        ctx.stroke();
    }

    //draw the horizontal lines
    //using yrange+ymin%1 as the starting i ensures that all the lines will have integer values
    for(var i = yrange + (ymin % 1); i > -1; i -= yLineStep) {
        ctx.moveTo(0, i * heightFactor);
        ctx.lineTo(width, i * heightFactor);
        ctx.stroke();
        ctx.font = "10px Arial";
        ctx.fillText(Math.round((ymax - i) * roundingFactor) / roundingFactor, 10, i * heightFactor + 10);
    }

    //draw the numbers for the interval lines
    //lines should be drawn first so that they will not cover the numbers
    //x axis numbers
    for(var i = (1 - (xmin % 1)); i < xrange; i += xLineStep) {
        ctx.font = "10px Arial";
        ctx.fillText((i + xmin), i * widthFactor + 10, height - 10);
    }
    //y axis numbers
    for(var i = yrange + (ymin % 1); i > -1; i -= yLineStep) {
        ctx.font = "10px Arial";
        ctx.fillText(Math.round((ymax - i) * roundingFactor) / roundingFactor, 10, i * heightFactor + 10);
    }

    //draw the curve
    for(var i = 0; i < xrange; i += step) {
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.moveTo(i * widthFactor, height - (getY(matrix, solutions, roundingFactor, i + xmin) - ymin) * heightFactor);
        ctx.lineTo((i + step) * widthFactor, height - (getY(matrix, solutions, roundingFactor, i + xmin + step) - ymin) * heightFactor);
        ctx.stroke();
    }
    const answerContainer = document.getElementById("answerContainer");
    try {
        const oldGraph = document.getElementById("graph");
        answerContainer.removeChild(oldGraph);          //try to clear the last graph
    }
    catch {}
    answerContainer.appendChild(graph);
}

function GaussJordanElimination(matrix, roundingFactor) {
    //display initial matrix
    if(isMatrixVisible) displayMatrix(matrix, 0);

    for(var i = 0; i < colCountAugCoeff - 1; i++) {
        //get the current column
        const column = matrix.map(x => x[i]);

        //get the row number of the largest absolute value in the column
        var max = Math.abs(column[i]);
        var maxIndex = i;

        for(var k = i; k < rowCountAugCoeff; k++) {
            if(Math.abs(column[k]) > max) {
                maxIndex = k;
                max = Math.abs(column[k]);
            }
        }

        //swap current row and row with highest value
        const temp = matrix[i];
        matrix[i] = matrix[maxIndex];
        matrix[maxIndex] = temp;

        //normalize the pivot row
        matrix[i] = matrix[i].map(x => x / matrix[i][i]);

        //start elimination per row
        for(var j = 0; j < rowCountAugCoeff; j++) {
            if(i == j) continue;
            //find the temporary vector
            tempVector = matrix[i].map(x => x * matrix[j][i]);
            //elimination
            matrix[j] = matrix[j].map((x, i) => x - tempVector[i]);
        }

        //round-off every value if persistent precision is enabled
        if(document.getElementById("persistentPrecision").checked) {
            matrix = matrix.map(row => row.map(x => Math.round(x * roundingFactor) / roundingFactor));
        }

        //display matrix every iteration
        if(isMatrixVisible) displayMatrix(matrix, i + 1);
    }
    //get the right hand side column
    const solutions = matrix.map(x => x[colCountAugCoeff - 1]);
    return solutions;
}

//toggle visibility of the step by step matrix
function toggleMatrix() {
    isMatrixVisible = !isMatrixVisible;
    if(isMatrixVisible) {                                           //re-run to display the matrix
        qsi(scrapeMatrix(), scrapeXValue());
        document.getElementById("toggleMatrixButton").innerHTML = "Hide Solution Matrix";
    }
    else {                                                      //delete the solution
        document.getElementById("stepBystepSolutions").innerHTML = "";
        document.getElementById("toggleMatrixButton").innerHTML = "Show Solution Matrix";
    }
}

function displayMatrix(matrix, iterationCount) {
    const container = document.getElementById("stepBystepSolutions");

    const iterationTitle = document.createElement('h2');
    iterationTitle.setAttribute("id", "tableTitle");
    iterationTitle.innerHTML = "ITERATION " + iterationCount;
    container.appendChild(iterationTitle);

    const solutionTable = document.createElement('table');
    solutionTable.setAttribute("id", "solutionTable");
    container.appendChild(solutionTable);

    for(var i = 0; i < matrix.length; i++) {
        var row = solutionTable.insertRow(-1);
        for(var j = 0; j < matrix[0].length; j++) {
            var cell = row.insertCell(-1);
            var newCell = document.createElement('p');

            newCell.innerHTML = matrix[i][j];

            cell.appendChild(newCell);
        }
    }
}

function qsi(matrix, x) {
    //clear the previous tableau
    const container = document.getElementById("stepBystepSolutions");
    container.innerHTML = "";

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

    //the true number of rows of the matrix
    rowCountMat = rowCount - 1;


    //SORT THE MATRIX's X VALUES IN ASCENDING ORDER
    matrix = matrix.sort((a, b) => a[0] - b[0]);
    
    //dimensions of the augmented coefficient matrix (3n by 3n+1 matrix)
    rowCountAugCoeff = 3 * (rowCountMat - 1) - 1;
    colCountAugCoeff = 3 * (rowCountMat - 1);

    //----------------------------------------BUILDING THE AUGMENTED COEFFICIENT MATRIX
    //fill the matrix with zeros
    var augcoeff = [];
    for(var i = 0; i < rowCountAugCoeff; i++) {
        augcoeff[i] = Array.from(Array(colCountAugCoeff), () => 0);
    }

    //internal knots (2n - 2 equations)
    for(var i = 1; i < rowCountMat - 1; i++) {
        //first coeff
        augcoeff[2 * i - 2][3 * i - 4] = Math.pow(matrix[i][0], 2);
        augcoeff[2 * i - 1][3 * i - 1] = Math.pow(matrix[i][0], 2);

        //second coeff
        augcoeff[2 * i - 2][3 * i - 3] = matrix[i][0];
        augcoeff[2 * i - 1][3 * i] = matrix[i][0];

        //third coeff
        augcoeff[2 * i - 2][3 * i - 2] = 1;
        augcoeff[2 * i - 1][3 * i + 1] = 1;

        //right hand side
        augcoeff[2 * i - 2][colCountAugCoeff - 1] = matrix[i][1];
        augcoeff[2 * i - 1][colCountAugCoeff - 1] = matrix[i][1];
    }

    //end points (2 equations)
    augcoeff[2 * rowCountMat - 4][0] = matrix[0][0];
    augcoeff[2 * rowCountMat - 4][1] = 1
    augcoeff[2 * rowCountMat - 4][colCountAugCoeff - 1] = matrix[0][1];

    augcoeff[2 * rowCountMat - 3][colCountAugCoeff - 4] = Math.pow(matrix[rowCountMat - 1][0], 2);
    augcoeff[2 * rowCountMat - 3][colCountAugCoeff - 3] = matrix[rowCountMat - 1][0];
    augcoeff[2 * rowCountMat - 3][colCountAugCoeff - 2] = 1;
    augcoeff[2 * rowCountMat - 3][colCountAugCoeff - 1] = matrix[rowCountMat - 1][1];

    //first derivative of interior (n - 1 equations)
    for(var i = 1; i < rowCountMat - 1; i++) {
        augcoeff[2 * rowCountMat + (i - 3)][3 * i - 4] = 2 * matrix[i][0];
        augcoeff[2 * rowCountMat + (i - 3)][3 * i - 3] = 1;
        augcoeff[2 * rowCountMat + (i - 3)][3 * i - 1] = -(2 * matrix[i][0]);
        augcoeff[2 * rowCountMat + (i - 3)][3 * i - 0] = -1;
    }

    //slice every row to remove negative indexes
    for(var i = 0; i < rowCountAugCoeff; i++) {
        augcoeff[i] = augcoeff[i].slice(0,colCountAugCoeff);
    }

    //----------------------------------------SOLVING
    //solve the matrix using gauss-jordan elimination
    solutions = GaussJordanElimination(augcoeff, roundingFactor);

    //add a 0 at the start of the solution set for a_1
    solutions.splice(0,0,0);
    // console.log(solutions)

    //----------------------------------------DISPLAYING ANSWERS
    const y = getY(matrix, solutions, roundingFactor, x);
    displayAnswer(x, y, solutions, matrix, roundingFactor);

    //show the toggle matrix button
    document.getElementById("toggleMatrixButton").style.display = "block";

    displayGraph(matrix, solutions, roundingFactor);
}