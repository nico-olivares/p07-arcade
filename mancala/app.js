
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

//App

//Objects and variables

//Initial stones
const initialStones = 4;

//one or two player flag
let onePlayer = true;

//player turn
let playerOneTurn = true;

//game is over
let gameOver = false;

//pit array with all the pits in it, stones are contained within pits
let pitArray = [];

//grid array for all possible stone positions
const stoneGridPit = [];
const stoneGridMancala = [];

//color array for stone colors
const colors = [
	'red',
	'darkkhaki',
	'blue',
	'orange',
	'green',
	'purple',
	'white',
	'black',
];

/**
 * stone object with color, html, and position
 * @param {Number} number
 * @param {Number} pitId
 * @param {Number} positionIndex //index of the stoneGrid that holds it's position
 * @param {Coordinate} position
 */
function Stone(number, pitId, positionIndex, position) {
	this.id = number;
	this.pitId = pitId;
	this.positionIndex = positionIndex; //position index within the current pit
	this.position = position;
	this.color = colors[Math.floor(Math.random() * colors.length)];
	this.html = `<div id='stone${this.id}' class='stone'></div>`;
}

/**
 * pit object with id, coordinateCenter, number of stones,
 * owner (side player one or two), counterpart, and pit or mancala
 * @param {Number} number
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} player1
 * @param {Boolean} kind (true: pit, false: mancala)
 */
function Pit(number, x, y, player1, kind) {
	this.id = number;
	this.htmlPit = `<div class="pit" id="pit${this.id}"></div>`;
	this.nextPitOne = 0; //next pit for player one
	this.nextPitTwo = 0; //next pit for player two
	this.oppositePit = 0; //opposite pit or id# for mancala
	this.pitCenter = new Coordinate(x, y);
	this.numberOfStones = 0;
	this.stones = []; //Array of stones inside this pit
	this.player1 = player1; //player1=true or player2=false
	this.pitKind = kind; //pit=true or mancala=false
}

/**
 * Coordinate object with an x, and y positions
 * @param {Number} x
 * @param {Number} y
 */
function Coordinate(x, y) {
	//based on x and y distance from the left and top edge of .game
	this.x = x;
	this.y = y;
}

//Initial State

/**
 * task: funct initialPlacement will
 * make and place all the initial pits and stones. 12x4 = 48
 * return: none
 */
function initPitsStones() {
	//for coordinates
	let x = -70;
	let y = 90;

	let player1 = true; //to be able to assign a player to each pit
	let pitKind = false; //to be able to denominate pit as pit or not (mancala)
	let stoneCounter = 0;

	//creates pits
	for (let i = 0; i < 14; i++) {
		if (i > 6) {
			//pits 0-6 are player1, the rest player2
			player1 = false;
		}
		if (i === 0 || i === 7) {
			//pits 0 and 7 are not pits, but mancalas
			pitKind = false;
		} else {
			pitKind = true;
		}

		if (i < 8) {
			x = x + 125;
			//x for pits 0-7 (top row)
		} else {
			//x for pits 8-13 (bottom row)
			if (i === 8) {
				x = 180;
			} else {
				x = x + 125;
			}
		}
		if (i < 7) {
			y = 80;
			//y for pits 1-6 (0 will be overriden later) (bottom row)
		} else {
			y = 280;
			//y for pits 7-13 (7 will be overriden) (top row)
		}
		if (i === 0 || i === 7) {
			y = 180;
			//y for pits 0 and 7 (mancalas)
		}
		pitArray.push(new Pit(i, x, y, player1, pitKind));
		$('.game').append(pitArray[i].htmlPit);

		//makes and places the stones
		let placementIndex;
		let stoneCoordinate;
		if (i != 0 && i != 7) {
			for (let j = 0; j < initialStones; j++) {
				placementIndex = stonePlacement(i); //gets a free (non used) index from the stoneGrid

				pitArray[i].stones.push(
					new Stone(stoneCounter, pitArray[i].id, placementIndex),
				);
				pitArray[i].stones[pitArray[i].stones.length - 1].position = cartesian(
					pitArray[i].stones[pitArray[i].stones.length - 1],
				);
				pitArray[i].numberOfStones += 1;
				
				stoneCounter += 1;
			}
		}
	}
}

/**
 * Places the stones randomly within the pit
 * @param {Coordinate(x, y)} coordinate
 * @param {Boolean} pitKind
 */
function stonePlacement(pitId) {
	let notAvailable = true;
	let newIndex;
	let stoneGrid;
	pitId === 0 || pitId === 7
		? (stoneGrid = stoneGridMancala)
		: (stoneGrid = stoneGridPit);
	while (notAvailable) {
		newIndex = Math.floor(Math.random() * (stoneGrid.length - 1));
		if (pitArray[pitId].stones.length === 0) {
			notAvailable = false;
		} else {
            notAvailable = false;
			pitArray[pitId].stones.forEach(function (item) {
				if (item.positionIndex === newIndex) {
					notAvailable = true;
				}
			});
		}
	}

	return newIndex;
}


/**
 *
 * @param {Array} stoneGrid
 */
function fillStoneGrid(stoneGrid) {
	const gapX = 10;
	const gapY = 15;
	const radiusX = 30;
	let radiusY;
	stoneGrid == stoneGridPit ? (radiusY = 30) : (radiusY = 90);
	const xTicks = 7;
	let yTicks;
	stoneGrid == stoneGridPit ? (yTicks = 5) : (yTicks = 15);
	let x = radiusX * -1;
	let y = radiusY * -1;
	for (let i = 0; i < yTicks; i++) {
		for (let j = 0; j < xTicks; j++) {
			stoneGrid.push(new Coordinate(x, y));
			x = x + gapX;
		}
		y = y + gapY;
		x = radiusX * -1;
	}
}

/**
 * Render the stones onto the mat at initialization
 * return: none
 */
function renderStones() {
	//render stones
	for (let i = 0; i < pitArray.length; i++) {
		if (pitArray[i].stones.length > 0) {
			for (let j = 0; j < initialStones; j++) {
				$('.game').append(pitArray[i].stones[j].html);
				$(`#stone${pitArray[i].stones[j].id}`)
					.css('left', `${cartesian(pitArray[i].stones[j]).x}px`)
					.css('top', `${cartesian(pitArray[i].stones[j]).y}px`)
					.css('background-color', `${pitArray[i].stones[j].color}`)
					
			}
		}
	}
}

/**
 * Gives the cartesian coordinate of a given stone
 * @param {Stone} stone
 */
function cartesian(stone) {
	let stoneGrid;
	stone.pitId == 0 || stone.pitId == 7
		? (stoneGrid = stoneGridMancala)
		: (stoneGrid = stoneGridPit);
	const x =
		pitArray[stone.pitId].pitCenter.x + stoneGrid[stone.positionIndex].x;
	const y =
		pitArray[stone.pitId].pitCenter.y + stoneGrid[stone.positionIndex].y;
	return new Coordinate(x, y);
}

/**
 * task: fill the nextPit property of the pit Objects. It had to wait for
 * all the pit Objects to be created first. It also fills the opposite pit
 * return: none
 */
function nextPit() {
	for (let i = 0; i < pitArray.length; i++) {
		pitArray[i].nextPitOne = nextPitOne(i);
		pitArray[i].nextPitTwo = nextPitTwo(i);
		pitArray[i].oppositePit = opposite(i);
	}

	function nextPitOne(id) {
		if (id === 7) {
			return 7;
		}
		if (id === 0) {
			return 8;
		}
		if (id === 13) {
			return 6;
		}
		if (id > 0 && id < 7) {
			return id - 1;
		}
		if (id > 7 && id < 13) {
			return id + 1;
		}
	}

	function nextPitTwo(id) {
		if (id === 0) {
			return 0;
		}
		if (id === 13) {
			return 7;
		}
		if (id === 1) {
			return 8;
		}
		if (id > 1 && id < 8) {
			return id - 1;
		}
		if (id > 7 && id < 13) {
			return id + 1;
		}
	}

	function opposite(id) {
		if (id === 0 || id === 7) {
			return id;
		}
		if (id < 7) {
			return id + 7;
		}
		if (id > 7) {
			return id - 7;
		}
	}
}

/**
 * initialize the app
 */
function init() {
	fillStoneGrid(stoneGridPit);
	fillStoneGrid(stoneGridMancala);
	initPitsStones();
	renderStones();
	nextPit();
}

init();

/**
 * Move the stones from the clicked pit onto all the following pits
 * @param {Number} id
 * return: none
 */
function pitClick(id) {
	if (playerOneTurn && id < 7 && id != 0 && pitArray[id].stones.length > 0) {
		playerOneTurn = false;
		moveStones(id, 'nextPitOne');
	} else {
		if (!playerOneTurn && id > 7 && pitArray[id].stones.length > 0) {
			playerOneTurn = true;
			moveStones(id, 'nextPitTwo');
		}
	}
	if (playerOneTurn) {
		$('.playerOneText').css('background-color', 'gray');
		$('.playerTwoText').css('background-color', 'black');
	} else {
		$('.playerOneText').css('background-color', 'black');
		$('.playerTwoText').css('background-color', 'gray');
	}
}

/**
 * move the stones from pit to pit. It checks for next turn and end of the game.
 * @param {Number} id
 * @param {Number} nextPit
 * return: none
 */
function moveStones(id, nextPit) {
	let nextId = pitArray[id][nextPit];
	const thisStonesLength = pitArray[id].stones.length;
	let placementIndex;
	let placement;
	let stoneGrid;
	for (let i = 0; i < thisStonesLength; i++) {
		placementIndex = stonePlacement(nextId);
		nextId === 0 || nextId === 7
			? (stoneGrid = stoneGridMancala)
			: (stoneGrid = stoneGridPit);
		placement = new Coordinate(
			pitArray[nextId].pitCenter.x + stoneGrid[placementIndex].x,
			pitArray[nextId].pitCenter.y + stoneGrid[placementIndex].y,
		);
		pitArray[id].numberOfStones -= 1;
		pitArray[nextId].numberOfStones += 1;
		pitArray[id].stones[i].pitId = nextId;
		pitArray[id].stones[i].positionIndex = placementIndex;
		pitArray[nextId].stones.push(pitArray[id].stones[i]);
		animate(pitArray[id].stones[i], placement);

		

		//checks to see where the last moving stone lands. If it lands on an empty pit and
		//there's stones in the opposite pit those get sent to this player's mancala
		if (i + 1 === thisStonesLength) {
			//last index
			if (
				pitArray[nextId].numberOfStones === 1 && //equals one because the moving stone is already counted
				pitArray[id].player1 == pitArray[nextId].player1 && //checks that the landing pit belongs to the same player
				nextId != 0 && //these two check that it's a pit and not a mancala
				nextId != 7
			) {
				if (pitArray[pitArray[nextId].oppositePit].numberOfStones > 0) {
					sendAllToMancala(pitArray[nextId].oppositePit);
				}
				//if player lands in own mancala get another turn
			} else if (nextId === 0 && !playerOneTurn) {
				playerOneTurn = true;
			} else if (nextId === 7 && playerOneTurn) {
				playerOneTurn = false;
			}
		}

        nextId = pitArray[nextId][nextPit]; //change nextId to the following pit in the chain
        
	}
	
    pitArray[id].stones.splice(0, thisStonesLength);
	
	//checks for when a whole row of pits is emtpy and ends the game
	if (checkAllPitsEmpty()) {
		endGame();
	}
}

/**
 * Check if all the pits of either player are empty, thus ending the game.
 * return: none
 */
function checkAllPitsEmpty() {
	let allEmptyOne = true;
	for (let i = 1; i < 7; i++) {
		if (pitArray[i].numberOfStones > 0) {
			allEmptyOne = false;
		}
	}
	let allEmptyTwo = true;
	for (let i = 8; i < 14; i++) {
		if (pitArray[i].numberOfStones > 0) {
			allEmptyTwo = false;
		}
	}
	return allEmptyOne || allEmptyTwo;
}

/**
 * task: animate the movement of stones from one pit to their destination
 * @param {Stone} stone
 * @param {Coordinate} targetPlace
 * return: none
 */
function animate(stone, targetXY) {
	let tempX = stone.position.x;
	let tempY = stone.position.y;
	const stoneId = 'stone' + stone.id;
	const xFactor = (targetXY.x - tempX) / 100;
	const yFactor = (targetXY.y - tempY) / 100;
	let tick = setInterval(ticker, 5);
	let counter = 0;

	function ticker() {
		if (counter > 100) {
			clearInterval(tick);
			stone.position = targetXY;
			$(`#${stoneId}`)
				.css('left', targetXY.x + 'px')
				.css('top', targetXY.y + 'px');
		} else {
			tempX += xFactor;
			tempY += yFactor;
			$(`#${stoneId}`)
				.css('left', tempX + 'px')
				.css('top', tempY + 'px');
			counter += 1;
		}
	}
}

/**
 * when triggered (by stone landing on empty pit across from this one)
 * send all stones to opposite player's mancala.
 * It should be triggered after checking that there are stones present
 * @param {Number} id
 * return: none
 */
function sendAllToMancala(id) {
	if (id < 7) {
		moveToMancala(id, pitArray[id].stones, 7);
	} else {
		moveToMancala(id, pitArray[id].stones, 0);
	}
}

/**
 * task: move all the stones in a pit to the assigned mancala
 * @param {Number} id
 * @param {Array} stonesArray array with all the stones in that pit
 * @param {Number} nextId  index of the mancala for that pit
 */
function moveToMancala(id, stonesArray, nextId) {
	let placementIndex;
	let placement;
	let stoneGrid;
	for (let i = 0; i < stonesArray.length; i++) {
		placementIndex = stonePlacement(nextId);
		nextId === 0 || nextId === 7
			? (stoneGrid = stoneGridMancala)
			: (stoneGrid = stoneGridPit);
		placement = new Coordinate(
			pitArray[nextId].pitCenter.x + stoneGrid[placementIndex].x,
			pitArray[nextId].pitCenter.y + stoneGrid[placementIndex].y,
		);
		pitArray[id].numberOfStones -= 1;
		pitArray[nextId].numberOfStones += 1;
		pitArray[id].stones[i].pitId = nextId;
		pitArray[id].stones[i].positionIndex = placementIndex;
		pitArray[nextId].stones.push(pitArray[id].stones[i]);
		animate(pitArray[id].stones[i], placement);
		
	}
	pitArray[id].stones = [];
}

/**
 * task: send all the stones of the player that still has stones
 * to their mancala and post current scores
 * return: none
 */
function endGame() {
	for (let i = 1; i < 7; i++) {
		if (pitArray[i].numberOfStones > 0) {
			moveToMancala(i, pitArray[i].stones, 0);
		}
	}
	for (let i = 8; i < 14; i++) {
		if (pitArray[i].numberOfStones > 0) {
			moveToMancala(i, pitArray[i].stones, 7);
		}
	}
	$('.playerOneScore').css('display', 'block').text(pitArray[0].numberOfStones);
	$('.playerTwoScore').css('display', 'block').text(pitArray[7].numberOfStones);
	if (pitArray[0].numberOfStones > pitArray[7].numberOfStones) {
		$('.playerOne').css('background-color', 'red');
		$('.winnerOne').css('display', 'block');
	} else if (pitArray[0].numberOfStones === pitArray[7].numberOfStones) {
		$('.player').css('background-color', 'red');
		$('.tie').css('display', 'block');
	} else {
		$('.playerTwo').css('background-color', 'red');
		$('.winnerTwo').css('display', 'block');
	}
}

/**
 * Handles the computer moves when on onePlayer mode
 */

function computerMove() {
	const boardMap = [];
	let idToClick;
	let tempNumberOfStones = 0;
	let gotToMancala = false;
	let innerPause;
	clearTimeout(innerPause);
	
	pitArray.forEach(function (item) {
		boardMap.push({
			pitId: item.id,
			toMancala: item.id < 7 ? item.id : item.id === 7 ? 0 : 14 - item.id,
			oppositePit: item.oppositePit,
			stones: item.numberOfStones,
			endPoint: null,
			endPointOppositePit: null,
		});
    });
    
    
	boardMap.forEach(function (item) {
		
			
				item.endPoint = endPoint(item.pitId, item.numberOfStones, item.toMancala);
				item.endPointOppositePit = boardMap[item.endPoint].oppositePit;
			
        
        });
        
        function endPoint(id, numberStones, toMancala) {
            let endPoint = id;
            if (id < 7 && numberStones < toMancala) {
                endPoint = id - numberStones;
            } else if (id > 7 && numberStones < toMancala) {
                endPoint = id + numberStones;
            }

            if (id < 7 && numberStones > toMancala) {
                if (numberStones - toMancala < 7) {
                    endPoint = (numberStones - toMancala) + 7;
                } else { 
                    endPoint = (6 - (numberStones - (toMancala + 7)));
                }
            } else if (id > 7 && numberStones > toMancala) {
                if (numberStones - toMancala < 7) {
                    endPoint = 7 - (numberStones - toMancala);
                } else {
                    endPoint = numberStones - toMancala + 1;
                }
            }
            return endPoint;
        }

	//default one with most stones
	for (let i = 8; i < 14; i++) {
		if (boardMap[i].stones > tempNumberOfStones) {
			tempNumberOfStones = boardMap[i].stones;
			idToClick = i;
		}
	}

	//empty close to mancala
	tempNumberOfStones = 0;
	for (let i = 11; i < 14; i++) {
		if (boardMap[i].stones > tempNumberOfStones) {
			tempNumberOfStones = boardMap[i].stones;
			idToClick = i;
		}
	}

	//capture enemy
	for (let i = 8; i < 13; i++) {
		if (boardMap[i].endPoint < 14) {
			if (
				boardMap[boardMap[i].endPoint].stones === 0 &&
				boardMap[boardMap[i].endPoint].oppositePit > 0 &&
				boardMap[i].pitId != boardMap[i].endPoint
			) {
				idToClick = i;
			}
		}
	}

	//land on mancala
	for (let i = 8; i < 14; i++) {
		if (boardMap[i].toMancala === boardMap[i].stones) {
			idToClick = i;
			gotToMancala = true;
		}
	}

	pitClick(idToClick);
	//  l('counter: ' + passCounter, idToClick);
	if (!playerOneTurn) {
		innerPause = setTimeout(computerMove, 2000);
		// computerMove();
	}

}

//Event listeners *********************************************************

//on click check the number of stones, then find all those stones and move to the next pits
//one at a time. Skip opposite mancala. checkLastPit if last is at own mancala get another turn.
$('.pit').on('click', clickedPit);

/**
 * helper function to handle the pit clicks
 */
function clickedPit() {
    $('.clicking').css('display', 'none');
	const parts = $(this).attr('id').split('t');
	const id = parts[1];
	pitClick(id);

	if (onePlayer && !playerOneTurn) {
		let pause = setTimeout(computerMove, 2000);
		// computerMove();
	}
}

//on click reset the game to initial conditions
$('.resetButton').on('click', resetGame);

function resetGame() {
	pitArray = [];
	$('.pit').remove();
	$('.stone').remove();
	playerOneTurn = true;
	gameOver = false;
	$('.playerScore').css('display', 'none');
	$('.winner').css('display', 'none');
	$('.tie').css('display', 'none');
	$('.player').css('background-color', 'black');
	$('.playerTwoText').css('background-color', 'black');
    $('.playerOneText').css('background-color', 'gray');
    $('.clicking').css('display', 'block');
	initPitsStones();
	renderStones();
	nextPit();
	$('.pit').on('click', clickedPit);
}

$('#solo').on('click', radioCheck);
$('#two').on('click', radioCheck);

/**
 * Helper function to handle radio button click
 */
function radioCheck() {
	if ($(this).val() === 'one' && !onePlayer) {
		onePlayer = true;
		resetGame();
	} else if ($(this).val() === 'two' && onePlayer) {
		onePlayer = false;
		resetGame();
	}
}

