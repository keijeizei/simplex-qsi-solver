// var row = [1,2,3,4]

// //scalar multiplication by 2
// var scalar = row.map(x => x * 2)

// console.log(scalar)

matrix = [
    [3,2,1,0,0,0,66],
    [9,4,0,1,0,0,180],
    [2,10,0,0,1,0,200],
    [-90,-75,0,0,0,1,0]
]

//returns the index of the smallest negative number in the last row
function findPivotCol(matrix) {
    rowCount = matrix.length
    colCount = matrix[0].length

    var min = matrix[rowCount - 1][0];
    var minIndex = -1;
    for(var i = 0; i < colCount - 1; i++) {
        //smallest negative number
        if(matrix[rowCount - 1][i] < 0 && matrix[rowCount - 1][i] <= min) {
            min = matrix[rowCount - 1][i];
            minIndex = i;
        }
    }
    return(minIndex);
}

//returns the index of the smallest positive test ratio of a given column
function findPivotRow(matrix, pivotCol) {
    var min = null;
    var minIndex = -1;

    for(var i = 0; i < rowCount - 1; i++) {
        testRatio = matrix[i][colCount - 1] / matrix[i][pivotCol]
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

function solve(matrix) {
    while(1) {
        console.log(matrix)
        pivotCol = findPivotCol(matrix);
        //break if there are no negative numbers in the last row
        if(pivotCol == -1) {
            break;
        }
        pivotRow = findPivotRow(matrix, pivotCol);

        console.log("PIVOT ELEMENT: " + matrix[pivotRow][pivotCol]);

        const pivotElement = matrix[pivotRow][pivotCol];
        const normalizedRow = matrix[pivotRow].map((x) => x / pivotElement);
        console.log("NORMALIZED ROW: " + normalizedRow);
        matrix[pivotRow] = normalizedRow;

        //elimination
        for(var i = 0; i < rowCount; i++) {
            var row = [];
            if(i == pivotRow) continue;
            for(var j = 0; j < colCount; j++) {
                row.push(matrix[i][j] - (normalizedRow[j] * matrix[i][pivotCol]))
            }
            matrix[i] = row;
        }
    }
}

solve(matrix)