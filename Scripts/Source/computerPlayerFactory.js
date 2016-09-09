define([], function () {
	var computerPlayerFactory = function (spec) {

		var computerPlayer = {};

		// Private variables

		var mBoardToMoveValues = {};
		var mValues = Object.freeze({
			OWin: -1,
			Draw: 0,
			XWin: 1
		});

		var mMinimax = function (board, depth) {
			var iRow = 0;
			var iColumn = 0;
			var jRow = 0;
			var jColumn = 0;

			// The best move value seen so far
			var value;

			// The value of the board assuming you play a piece somewhere
			// and the other player plays optimally
			var response;

			if (board.getState() !== board.state.unfinished) {
				// we are at a terminal node (draw, xWon, or oWon)
				// so evaluate
				value = board.getState();

				
			} else if (board.getCurrentPlayer() === board.piece.x) {
				// it is maximizer's turn (x)

				value = board.state.oWon; // assume the worst
				mBoardToMoveValues[board] = mBoardToMoveValues[board] || [];

				for (iRow = 0; iRow < board.getNumRows(); iRow += 1) {
					for (iColumn = 0; iColumn < board.getNumColumns();
						iColumn += 1) {

						if (board.isEmpty({row: iRow, column: iColumn})) {

							board.playPiece({row: iRow, column: iColumn});


							if (board.getState() === board.state.xWon) {
								response = {
									value: board.state.xWon,
									depth: depth
								};
							} else {
								// Get value of terminal state for playing 
								// the piece above assuming the other player
								// and you both play optimally
								response = mMinimax(board, depth + 1);
							}


							board.undoLastMove();

							// Store it in the hash table
							mBoardToMoveValues[board].push({
								row: iRow,
								column: iColumn,
								depth: response.depth,
								value: response.value
							});


							if (response.value > value) {
								value = response.value;
							}
						}
					}
				}
			} else {
				// it is minimizer's turn (o)

				value = board.state.xWon; // assume the worst
				mBoardToMoveValues[board] = mBoardToMoveValues[board] || [];

				for (jRow = 0; jRow < board.getNumRows(); jRow += 1) {
					for (jColumn = 0; jColumn < board.getNumColumns();
						jColumn += 1) {

						if (board.isEmpty({row: jRow, column: jColumn})) {
							
							board.playPiece({row: jRow, column: jColumn});



							if (board.getState() === board.state.oWon) {
								response = {
									value: board.state.oWon,
									depth: depth
								};
							} else {
								response = mMinimax(board, depth + 1);
							}


							board.undoLastMove();

							mBoardToMoveValues[board].push({
								row: iRow,
								column: iColumn,
								depth: response.depth,
								value: response.value
							});


							if (response.value < value) {
								value = response.value;
							}
						}
					}
				}
			}
			return {value: value, depth: depth};
		};


		/**
		 * Given a board, get an array of all valid moves along
		 * with their values and the depths which lead to that value.
		 */
		computerPlayer.getMoveValues = function (board) {
			var moveValues = [];
			// If already stored, get the value and return it.
			if (mBoardToMoveValues.hasOwnProperty(board)) {
				moveValues = mBoardToMoveValues[board];
			} 
			// Otherwise, minimax
			else {
				mMinimax(board, 0);
				moveValues = mBoardToMoveValues[board];
			}

			return moveValues;
		};

		computerPlayer.getBoardToMoveValues = function () {
			return mBoardToMoveValues;
		};

		// Get best move {row: ?, column: ?} given a board
		computerPlayer.getBestMove = function (board) {
			var moveValues = computerPlayer.getMoveValues(board);
			var iMove = 1;

			var bestMove = {
				row: moveValues[0].row,
				column: moveValues[0].column,
				value: moveValues[0].value,
				depth: moveValues[0].depth
			};

			if (board.getCurrentPlayer() === board.piece.x) {
				// look for move w/ max value
				for (iMove = 1; iMove < moveValues.length; iMove += 1) {
					if (moveValues[iMove].value > bestMove.value) {
						
						var bestMove = {
							row: moveValues[iMove].row,
							column: moveValues[iMove].column,
							value: moveValues[iMove].value,
							depth: moveValues[iMove].depth
						};
					}
				}
			} else {
				// look for move w/ min value
				for (iMove = 1; iMove < moveValues.length; iMove += 1) {
					if (moveValues[iMove].value < bestMove.value) {
						
						var bestMove = {
							row: moveValues[iMove].row,
							column: moveValues[iMove].column,
							value: moveValues[iMove].value,
							depth: moveValues[iMove].depth
						};
					}
				}
			}

			return bestMove;
		};

		return computerPlayer;
	
	}

	return computerPlayerFactory;
});
