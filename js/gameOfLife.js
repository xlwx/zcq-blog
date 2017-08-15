
var row = 30;
var	col = 30;
var	lifeCellPercent = 0.1;
var	board = initRandom(row,col,lifeCellPercent);
var width = 500;
var height = 500;
var grid = d3.select("#grid")
	.append("svg")
	.attr("width",width)
	.attr("height",height);
var gridData = setGridData(board);
var cellWidth = Math.min(width,height) / Math.min(row,col);
var cellHeight = cellWidth;


setInterval(function() {
	updateView(gridData);
	board = changeState(board);
	gridData = setGridData(board);
}, 200);



/********************************** Controller *******************************************/


/**
 * Generate board with live cells randomly
 * @param  {integer} row             
 * @param  {integer} col             
 * @param  {float} lifeCellPercent [Define the percentage of the cells that are live]
 * @return {2-d array}                 
 */
function initRandom(row, col, lifeCellPercent) {
	var board = [];
	for(var i = 0; i < row; i++) {
		var currentRow = [];
		for (var j = 0; j < col; j++) {
			currentRow[j] = Math.random() < lifeCellPercent ? 1: 0;
		}
		board.push(currentRow);
	}
	return board;
}


/**
 * Take a board as input and return the the board after transition
 * @param  {2-d array} board [previous state]
 * @return {2-d array}       [transition state]
 */
function changeState(board) {
	if(!board || board.length == 0 || board[0].length == 0) {
		throw Error("Invalid board");
	}
	var row = board.length,
		col = board[0].length,
		newBoard = [];

	for(var i=0; i<row; i++) {
		newBoard[i] = [];
		for(var j=0; j<col; j++){
			var count = 0;
			// count live neighbors
			if(i-1 >= 0 && j-1 >= 0 && board[i-1][j-1]) {
				count++;
			}
			if(i-1 >= 0 && board[i-1][j]) {
				count++;
			}
			if(i-1 >= 0 && j+1 < col && board[i-1][j+1]) {
				count++;
			}
			if(j-1 >= 0 && board[i][j-1]) {
				count++;
			}
			if(j+1 < col && board[i][j+1]) {
				count++;
			}
			if(i+1 < row && j-1 >= 0 && board[i+1][j-1]) {
				count++;
			}
			if(i+1 < row && board[i+1][j]) {
				count++;
			}
			if(i+1 < row && j+1 < col && board[i+1][j+1]) {
				count++;
			}
			// transitions
			if(board[i][j] == 1) {
				if(count < 2 || count > 3) {	// dead if underpopulation or overpopulation
					newBoard[i].push(0);
				}else {							// lives on to the next generation
					newBoard[i].push(1);
				}
			}else {
				if(count == 3) {				// dead cell with 3 neighbors becomes live cell
					newBoard[i].push(1);
				}else {
					newBoard[i].push(0);
				}
			}
		}
	}
	return newBoard;
}


/************************************** Model ********************************************************/
function setGridData(board) {

	var data = new Array();
	var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 1;
	var width = cellWidth;
	var height = cellHeight;
	var click = 0;
	var row = board.length,
		col = board[0].length;
	
	// iterate for rows	
	for(var i = 0; i < row; i++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for(var j = 0; j < col; j++) {
			data[i].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				life: board[i][j]
			});
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += width;
		}
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += height;	
	}
	return data;
}

/************************************** View ********************************************************/

function updateView(gridData) {
	d3.select("svg").remove();
	grid = d3.select("#grid")
	.append("svg")
	.attr("width","510px")
	.attr("height","510px");

	var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");

	var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.attr("life",function(d) {return d.life; })
	.style("fill", function(d) {
		if(d.life == 1) return "#838690";
		else return "#fff";
	})
	.style("stroke", "#222");
}


