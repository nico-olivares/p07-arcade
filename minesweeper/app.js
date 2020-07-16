/**
 * Hamburger menu
 */

/**
 * shows and hides the navigation menu when hovering over hamburger menu.
 * It shows menu for 4 seconds.
 */
$('.hamburgerMenu').on('mouseover', function () {
	$('.menu').css('display', 'block');
});

$('main').on('mouseover', function () {
	$('.menu').css('display', 'none');
});

//Debugger
function l(a, b = '') {
	console.log(a, ' <--> ', JSON.stringify(b));
}

//Global variables *****************************************
//Game array. Hold the whole game
let minesweeper;

//Count the flags
let flagCounter = 0;

//flags the end of the game
let gameIsActive = true;

<<<<<<< HEAD
//counts the number of revealed cells. When the number matches the number
//of hidden cells (original number in the object) the game is won. 
let cellsRevealed = 0;

=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
//Worker
let worker;

//first click flag
let postFirstClick = false;

//array of cells and booleans that will be used to check when 
//a zero cell is clicked to be able to open cells around it.
let zeroesToCheck = [];

//Objects **************************************************

/**
 * Game object. Holds the whole board
 * @param {Number} mines   //number of mines in the board (10-beginner, 40-intermediate, 99-advanced)
 */
function Minesweeper(mines) {
	this.numberOfMines = mines;
	this.grid = mines === 10 ? 8 : mines === 40 ? 16 : 24;
	this.numberOfCells = this.grid * this.grid;
<<<<<<< HEAD
	this.numberHidden = this.numberOfCells - mines;
=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
	this.cells = [];
	this.boardHtml = `<div class='grid${this.grid} grid'></div>`;
}

/**
 * Cell object. Holds all the information every single cell needs.
 * @param {Number} id   //unique id for each cell
 * @param {Number} grid    //width (and height) of each board. (8-beginner, 16-intermediate, 24-advanced)
 */
function Cell(id, grid) {
	this.id = id;
	this.x = Math.floor(id / grid);
	this.y = Math.floor(id % grid);
	this.contacts = 0;
	this.hasMine = false;
	this.hasFlag = false;
	this.isZero = true;
	this.isHidden = true;
	this.hasQuestion = false;
	this.cellHtml = `<div class='cell${this.id} cell' x='${this.x}' y='${this.y}' oncontextmenu='return false;' value='0' isHidden='true'></div>`;
}

/**
 * Contains the three strings to be displayed in the number displays
 * @param {String} hundreds
 * @param {String} tens
 * @param {String} ones
 */
function DisplayNumber(hundreds, tens, ones) {
	this.hundreds = hundreds;
	this.tens = tens;
	this.ones = ones;
}

/**
 * Helper object that contains a cell and a checked boolean.
 * @param {Cell} cell 
 */
function CellCheck(cell) {
	this.cell = cell;
	this.checked = false;
}


//Initialization *******************************************

<<<<<<< HEAD
//worker set up
worker = new Worker('worker.js');

	worker.addEventListener('message', function (e) {
		updateTimer(e.data);
	});

=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
/**
 * Initialize the board with everything needed to start the game, including rendering.
 * @param {Number} mines    //10, 40, or 99
 */
function initObjects(mines) {
	minesweeper = new Minesweeper(mines);
	$('.gameHeader').addClass(`gameHeader${minesweeper.grid}`);
	$('.game').append(minesweeper.boardHtml);
	$('#happy').css('display', 'block');
	$('#sad').css('display', 'none');
	updateTimer(0);
	flagCounter = 0;
	updateMineCounter();
<<<<<<< HEAD
	
=======
	worker = new Worker('worker.js');
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7

	for (let i = 0; i < minesweeper.grid; i++) {
		minesweeper.cells[i] = [];
		for (let j = 0; j < minesweeper.grid; j++) {
			minesweeper.cells[i].push(
				new Cell(i * minesweeper.grid + j, minesweeper.grid),
			);
			$('.grid').append(minesweeper.cells[i][j].cellHtml);
		}
	}

	let minesArray = [];

	//fills an array with possible mine coordinates that don't repeat (x, y).
	for (let i = 0; i < mines; i++) {
		let indexX;
		let indexY;
		let repeatedIndex = true;
		while (repeatedIndex) {
			repeatedIndex = false;
			indexX = Math.floor(Math.random() * minesweeper.grid);
			indexY = Math.floor(Math.random() * minesweeper.grid);
			if (minesArray.length != 0) {
				minesArray.forEach(function (item) {
					if (item[0] === indexX && item[1] === indexY) {
						repeatedIndex = true;
					}
				});
			}
		}
		minesArray.push([indexX, indexY]);
	}

	for (let i = 0; i < minesArray.length; i++) {
		let x = minesArray[i][0];
		let y = minesArray[i][1];
		minesweeper.cells[x][y].hasMine = true;
		minesweeper.cells[x][y].contacts = '';
	}

	vicinity();

	listeners();
	
}

/**
 * Checks to see how many bombs is each cell touching. 
 * It doesn't return a value, it assigns it to the cell and html.
 */
function vicinity() {
	let contactNumber = 0;
	for (let x = 0; x < minesweeper.grid; x++) {
		for (let y = 0; y < minesweeper.grid; y++) {
			let cell = minesweeper.cells[x][y];
			for (let xDelta = -1; xDelta < 2; xDelta++) {
				for (let yDelta = -1; yDelta < 2; yDelta++) {
					if (
						x + xDelta >= 0 &&
						y + yDelta >= 0 &&
						x + xDelta < minesweeper.grid &&
						y + yDelta < minesweeper.grid
					) {
						if (minesweeper.cells[x + xDelta][y + yDelta].hasMine == true) {
							contactNumber += 1;
						}
					}
				}
			}
			if (!cell.hasMine) {
				cell.contacts = contactNumber;
				$(`.cell${cell.id}`).attr('value', contactNumber);
				if (contactNumber > 0) {
					cell.isZero = false;
				}
			} else {
				cell.contacts = '';
				cell.isZero = false;
				$(`.cell${cell.id}`).attr('value', '');
			}
			contactNumber = 0;
		}
	}
}

//options are 10, 40, 99
initObjects(10);

/**
 * Turns a number into three and displays it onto the screen
 * @param {Number} time 
 */
function updateTimer(time) {
	if (time < 1000) {
		let display = numberDisplay(time);
		$('.hundredsSecs').text(display.hundreds);
		$('.tensSecs').text(display.tens);
		$('.onesSecs').text(display.ones);
	}
}

<<<<<<< HEAD

=======
worker.addEventListener('message', function (e) {
	updateTimer(e.data);
});
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7


/**
 * It handles the clicking of a cell. It gets said cell passed to it.
 * @param {JQuery cell} element 
 */
function clicked(element) {
	let x = element.attr('x');
	let y = element.attr('y');
	let cell = minesweeper.cells[x][y];
	let elementClass = 'cell' + cell.id;
	if (gameIsActive && !(cell.hasQuestion || cell.hasFlag)) {
		if (!postFirstClick) {
			worker.postMessage('start');
<<<<<<< HEAD
			
=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
		}
		postFirstClick = true;

		cell.isHidden = false;
<<<<<<< HEAD
		cellsRevealed += 1;
=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
		$(`.${elementClass}`)
			.text(`${cell.contacts === 0 ? '' : cell.contacts}`)
			.css('border', '0.1px solid black')
			.attr('isHidden', 'false');

		if (cell.contacts === 0) {
			vicinityOfZeros(cell);
		}
		if (cell.hasMine) {
			boom(cell);
		}
<<<<<<< HEAD
		if (cellsRevealed === minesweeper.numberHidden) {
			winner();
		}
=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
	}
}

/**
 * It handles the right click of a cell (adds flags and question marks)
 * @param {JQuery cell} element 
 */
function rightClick(element) {
	if (gameIsActive) {
		let x = element.attr('x');
		let y = element.attr('y');
		let cell = minesweeper.cells[x][y];
		let elementClass = element.attr('class').split(' ');
		elementClass = elementClass[0];

		if (!cell.hasFlag && !cell.hasQuestion) {
			element.append(
				`<img class='flag' src='jpgs/minesweeper-flag.png'></img>`,
			);
			cell.hasFlag = true;
			flagCounter += 1;
			updateMineCounter();
		} else if (cell.hasFlag) {
			$(`.${elementClass} .flag`).remove();
			cell.hasFlag = false;
			flagCounter -= 1;
			updateMineCounter();
			element.append(`<i class="fas fa-question question"></i>`);
			cell.hasQuestion = true;
		} else if (cell.hasQuestion) {
			$(`.${elementClass} .question`).remove();

			cell.hasQuestion = false;
		}
	}
}

/**
 * Updates the mine counter using the value of the flagCounter flag.
 */
function updateMineCounter() {
	let mines = minesweeper.numberOfMines - flagCounter;
	let display = numberDisplay(mines);

	$('.hundreds').text(display.hundreds);
	$('.tens').text(display.tens);
	$('.ones').text(display.ones);
}

/**
 * It turns a number into three digits (hundreds, tens, ones) 
 * for the two displays to use.
 * @param {Number} number 
 */
function numberDisplay(number) {
	let polarity = number < 0 ? -1 : 1;
	number = Math.abs(number);
	let ones = number % 10;
	let tens = ((number - ones) / 10) % 10;
	let hundreds = polarity === -1 ? '-' : (number - tens * 10 - ones) / 100;

	return new DisplayNumber(hundreds, tens, ones);
}


/**
 * When a zero cell is clicked it checks all cells around it and 
 * reveals any that isn't a mine or a flag/question mark.
 * @param {Cell} cell 
 */
function vicinityOfZeros(cell) {
	let x = cell.x;
	let y = cell.y;
	for (let xDelta = -1; xDelta < 2; xDelta++) {
		for (let yDelta = -1; yDelta < 2; yDelta++) {
			if (
				x + xDelta >= 0 &&
				y + yDelta >= 0 &&
				x + xDelta < minesweeper.grid &&
				y + yDelta < minesweeper.grid &&
				!(xDelta === 0 && yDelta === 0)
			) {
				let newX = x + xDelta;
				let newY = y + yDelta;
				let newCell = minesweeper.cells[newX][newY];
				if (newCell.isHidden && !(newCell.hasQuestion || newCell.hasFlag)) {
					newCell.isHidden = false;
<<<<<<< HEAD
					cellsRevealed += 1;
=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
					$(`.cell${newCell.id}`)
						.text(`${newCell.contacts === 0 ? '' : newCell.contacts}`)
						.css('border', '0.1px solid black')
						.attr('isHidden', 'false');
					if (newCell.contacts === 0) {
						let doIt = true;
						if (zeroesToCheck.length > 0) {
							zeroesToCheck.forEach(function (item) {
								if (item.cell == newCell) {
									doIt = false;
								}
							});
						}
						if (doIt) {
							zeroesToCheck.push(new CellCheck(newCell));
						}
					}
				}
			}
		}
	}
	zeroesToCheck.forEach(function (item) {
		if (!item.checked) {
			item.checked = true;
			vicinityOfZeros(item.cell);
		}
    });
    zeroesToCheck = [];
}

/**
 * If the cell has a mine (when clicked) it reveals all mines 
 * and stops the game.
 * @param {Cell} cell 
 */
function boom(cell) {
	$('#happy').css('display', 'none');
	$('#sad').css('display', 'block');
<<<<<<< HEAD
	worker.postMessage('stop');
=======
	worker.terminate();
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
	gameIsActive = false;
	$(`.cell${cell.id}`).css('background-color', 'red');
	revealMines();

	function revealMines() {
		for (let x = 0; x < minesweeper.cells.length; x++) {
			for (let y = 0; y < minesweeper.cells.length; y++) {
				if (minesweeper.cells[x][y].hasMine) {
					let element = $(`.cell${minesweeper.cells[x][y].id}`);
					element
						.append(`<img class='mine' src='jpgs/blackmine.png'/>`)
						.css('border', '0.1px solid black');
				}
			}
		}
	}
}

/**
 * Resets the game when reset, smiley face, or a new level is clicked.
 */
function resetGame() {
	$('.cell').remove();
	$('.grid').remove();
	$('.gameHeader').removeClass(`gameHeader${minesweeper.grid}`);
<<<<<<< HEAD
	worker.postMessage('stop');
=======
	worker.terminate();
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7

	let level = 10;
	if ($('#beginner').is(':checked')) {
		level = 10;
	}
	if ($('#intermediate').is(':checked')) {
		level = 40;
	}
	if ($('#advanced').is(':checked')) {
		level = 99;
	}
	gameIsActive = true;
<<<<<<< HEAD
	postFirstClick = false;
=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
	minesweeper = [];
	initObjects(level);
}

<<<<<<< HEAD
function winner() {
	if (confirm('You won!\nPress OK to start a new game.')) {
		resetGame();
	}
}

=======
>>>>>>> adcb3d31b472541563991abb727cc903b1ea31b7
//listeners *****************************************

function listeners() {
	//right click listener for flags, question marks, and none
	$('.cell').on('mousedown', function (e) {
		if (e.button == 2) {
			rightClick($(this));
		}
	});

	//Handles the cell clicking
	$('.cell').on('click', function (e) {
		clicked($(this));
	});

	//Listen for reset button or smiley face (reset)
	$('#reset').on('click', resetGame);
	$('.smiley').on('click', resetGame);
	$('.options').on('change', function (e) {
		if ($(this).val() != minesweeper.grid) {
			resetGame();
		}
	});
}
