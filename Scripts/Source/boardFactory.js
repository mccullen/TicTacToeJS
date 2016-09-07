define([], function () {
	"use strict";
	
	var boardFactory = function (spec) {
		var board = {};

		// Enum of the states. Could also do a getStates function 
		// that returns a private object
		board.state = Object.freeze({
			unfinished: "unfinished",
			xWon: "xWon",
			oWon: "oWon",
			draw: "draw"
		});

		board.piece = Object.freeze({
			x: 'X',
			o: 'O',
			none: ' '
		});
		
		// Private variables

		var mNumRows = spec.numRows || 3;
		var mNumColumns = spec.numColumns || 3;
		var mPieces = [];
		var mCurrentPlayer = board.piece.x;
		var mMoves = [];

		// Initialize board to empty
		(function () {
			var row = 0;
			var column = 0;
			for (row = 0; row < mNumRows; row += 1) {
				mPieces.push([]);
				for (column = 0; column < mNumColumns; column += 1) {
					mPieces[row].push(board.piece.none);
				}
			} 
		}());

		var mCheckWin = function (row, column, rowInc, colInc, sequenceLength) {
			var numInASequence = 0;

			// Break if any of the following are true:
			// - The current piece is different from the current player
			// - You got to the end of the sequence
			while (numInASequence < sequenceLength && 
				mPieces[row][column] === mCurrentPlayer) {

				numInASequence += 1;
				column += colInc;
				row += rowInc;
			}

			return numInASequence >= sequenceLength;
			/*
			while (numInASequence === i &&
				numInASequence < sequenceLength) {

				if (mPieces[row][column] === mCurrentPlayer) {
					numInASequence += 1;
				}
				column += colInc;
				row += rowInc;
				i += 1;
			}

			return numInASequence >= sequenceLength;
			*/
		};

		var mSetWinState = function () {
			var state;
			if (mCurrentPlayer === board.piece.x) {
				state = board.state.xWon;
			} else {
				state = board.state.oWon;
			}
			return state;
		};

		// Gets the state of the board given the last row and column
		// that was played.
		var mGetState = function (row, column) {
			var state = board.state.unfinished;
			//var lastPlayer = mPieces[row][column];

			var min = Math.min(mNumRows, mNumColumns);
			var numMoves = mMoves.length;

			// If enough moves have been played for someone to have won
			if (numMoves >= min) {

				// If horizontal or vertical win
				if (mCheckWin(row, 0, 0, 1, mNumColumns) || 
					mCheckWin(0, column, 1, 0, mNumRows)) {

					state = mSetWinState();
				
				// If board is square, check for diagnol win
				} else if (mNumColumns === mNumRows) {

					// If the last move was on the top-left to
					// bottom-right diagnol
					if (row === column) {

						if (mCheckWin(0, 0, 1, 1, mNumRows)) {
							state = mSetWinState();	
						}
					}

					// If the last move was on the top-right to 
					// bottom-left diagnol
					if (row + column === mNumRows - 1) {
						if (mCheckWin(0, mNumColumns - 1, 1, -1, mNumRows)) {
							state = mSetWinState();
						}
					}
				
				}

				if (state === board.state.unfinished &&
					numMoves === mNumRows * mNumColumns) {

					state = board.state.draw;
					
				}
			}


			return state;
		};

		
		
		
		// Public methods
		board.getState = function () {
			// A board with no moves is unfinished
			var state = board.state.unfinished;

			// Set the state from the private variable if any moves
			// have been played. 
			if (mMoves.length > 0) {
				state = mMoves[mMoves.length - 1].state;
			}

			return state;
		};
		
		/**
		 * Play a piece at the specified row and column
		 *
		 * @param {object} place An object the contains the row and column
		 * to place the current player on the board.
		 * @return {bool} true if the piece has been successfully placed 
		 * (the row and column were valid).
		 */
		board.playPiece = function (place) {

			if (typeof place.row !== "number" || 
				typeof place.column !== "number") {

				throw {
					message: "Row and column of object must be a number type"
				};
			}
			if (place.row > mNumRows || 
				place.column > mNumColumns ||
				place.row < 0 || place.column < 0) {

				throw {
					message: "Row must be in range 0 to " + mNumRows +
						" and column must be in range 0 to " + mNumColumns + "."
				};
			}

			if (mPieces[place.row][place.column] !== board.piece.none) {
				throw {
					message: "Specified place is already occupied."
				};
			}

			// Play the piece
			mPieces[place.row][place.column] = mCurrentPlayer;



			mMoves.push({
				row: place.row, 
				column: place.column,
				state: board.state.unfinished
			});

			// Determine state of board and add it to the move
			var state = mGetState(place.row, place.column);
			mMoves[mMoves.length - 1].state = state;

			// Reset current player
			if (mCurrentPlayer === board.piece.x) {
				mCurrentPlayer = board.piece.o;
			} else {
				mCurrentPlayer = board.piece.x;
			}

			return board;
		};
		
		board.getNumMoves = function () {
			return mMoves.length;
		};
		
		board.getPieces = function () {
			return mPieces.slice(0);
		};
		
		board.getCurrentPlayer = function () {
			return mCurrentPlayer;
		};

		/**
		 * Convert a board to a string. This will run through the board
		 * row by row and return the concatination of each piece in the
		 * board. EX: "XX OXOO X"
		 */
		 board.toString = function () {
			var boardString = "";
			mPieces.forEach(function (row) {
				row.forEach(function (value) {
					boardString += value;
				});
			});
			return boardString;
		 };

		 board.print = function () {
			var str = "";
			var i = 0;
			var j = 0;

			for (i = 0; i < mNumRows; i += 1) {
				for (j = 0; j < mNumColumns; j += 1) {
					if (mPieces[i][j] === board.piece.none) {
						str += '_';
					} else {
						str += mPieces[i][j];
					}
				}
				str += '\n';
			}


			return str;
		};

		board.undoLastMove = function () {
			mMoves.pop();
			mCurrentPlayer = mCurrentPlayer === board.piece.x ?
				mCurrentPlayer = board.piece.o :
				mCurrentPlayer = board.piece.x;
			return board;
		};
		
		return board;
	};
	
	return boardFactory;
});
