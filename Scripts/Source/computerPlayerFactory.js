define([], function () {
	var computerPlayerFactory = function (spec) {

		var computerPlayer = {};

		// Private variables

		var mBoardToMoves = {};
		var mValues = Object.freeze({
			OWin: -1,
			Draw: 0,
			XWin: 1
		});

		var mMinimax = function (board, row, column) {

			var iRow = 0;
			var iColumn = 0;

			// The value of the board assuming you play a piece somewhere
			// and the other player plays optimally
			var bestMove = {
				// Row and column params get passed down from higher
				// up in the tree
				row: row,
				column: column,

				// These values get passed up to parent nodes in base case
				depth: undefined,// [jrm] board.getNumMoves()
				state: undefined
			};

			if (board.getState() !== board.state.unfinished) {
				// we are at a terminal node (draw, xWon, or oWon)
				// so evaluate
				bestMove.state = board.getState();
				bestMove.depth = board.getNumMoves();
				mBoardToMoves[board] = [];

				// [jrm] Don't need these in hash map but it is fun to 
				// know how many valid boards there are.
				mBoardToMoves[board].push({
					row: row,
					column: column,
					state: board.getState(),
					depth: board.getNumMoves()
				});

			} else if (board.getCurrentPlayer() === board.piece.x) {
				// it is maximizer's turn (x)

				bestMove.state = board.state.oWon; // assume the worst
				bestMove.depth = 0;
				mBoardToMoves[board] = [];

				for (iRow = 0; iRow < board.getNumRows(); iRow += 1) {
					for (iColumn = 0; iColumn < board.getNumColumns();
							iColumn += 1) {
						if (board.isEmpty({row: iRow, column: iColumn})) {

							board.playPiece({row: iRow, column: iColumn});

							// Get value of terminal state for playing 
							// the piece above assuming the other player
							// and you both play optimally
							response = mMinimax(board, iRow, iColumn);

							board.undoLastMove();

							// Store it in the hash table
							mBoardToMoves[board].push(response);

							if (response.state > bestMove.state) {
								bestMove.state = response.state;
								bestMove.depth = response.depth;
							} else if (response.state === bestMove.state) {
								if (response.state === board.state.oWon) {
									bestMove.depth = Math.max(bestMove.depth, response.depth);
								} else if (response.state === board.state.xWon){
									bestMove.depth = Math.min(bestMove.depth, response.depth);
								} else {
									bestMove.depth = response.depth;
								}
							}
						}
					}
				}
			} else {
				// it is minimizer's turn (o)

				bestMove.state = board.state.xWon; // assume the worst
				bestMove.depth = 0;
				mBoardToMoves[board] = [];

				for (iRow = 0; iRow < board.getNumRows(); iRow += 1) {
					for (iColumn = 0; iColumn < board.getNumColumns();
							iColumn += 1) {
						if (board.isEmpty({row: iRow, column: iColumn})) {
							
							board.playPiece({row: iRow, column: iColumn});

							response = mMinimax(board, iRow, iColumn);
							board.undoLastMove();

							mBoardToMoves[board].push(response);

							if (response.state < bestMove.state) {
								bestMove.state = response.state;
								bestMove.depth = response.depth;
							} else if (response.state === bestMove.state) {
								if (response.state === board.state.oWon) {
									bestMove.depth = Math.min(bestMove.depth, response.depth);
								} else if (response.state === board.state.xWon){
									bestMove.depth = Math.max(bestMove.depth, response.depth);
								} else {
									bestMove.depth = response.depth;
								}
							}
						}
					}
				}
			}
			return bestMove;
		};


		/**
		 * Given a board, get an array of all valid moves along
		 * with their values and the depths which lead to that value.
		 */
		computerPlayer.getMoveValues = function (board) {
			var moveValues = [];
			// If already stored, get the value and return it.
			if (mBoardToMoves.hasOwnProperty(board)) {
				moveValues = mBoardToMoves[board];
			} 
			// Otherwise, minimax
			else {
				mMinimax(board);
				moveValues = mBoardToMoves[board];
			}

			return moveValues;
		};

		computerPlayer.getBoardToMoves = function () {
			return mBoardToMoves;
		};

		// Get best move {row: ?, column: ?} given a board
		computerPlayer.getBestMove = function (board) {
			var moveValues = computerPlayer.getMoveValues(board);
			var iMove = 1;

			var bestMove = {
				row: moveValues[0].row,
				column: moveValues[0].column,
				state: moveValues[0].state,
				depth: moveValues[0].depth
			};

			if (board.getCurrentPlayer() === board.piece.x) {
				// look for move w/ max value
				for (iMove = 1; iMove < moveValues.length; iMove += 1) {
					if (moveValues[iMove].state > bestMove.state ||
							(moveValues[iMove].state === bestMove.state &&
							moveValues[iMove].depth < bestMove.depth)) {
						var bestMove = {
							row: moveValues[iMove].row,
							column: moveValues[iMove].column,
							state: moveValues[iMove].state,
							depth: moveValues[iMove].depth
						};
					}
				}
			} else {
				// look for move w/ min value
				for (iMove = 1; iMove < moveValues.length; iMove += 1) {
					if (moveValues[iMove].state < bestMove.state ||
							(moveValues[iMove].state === bestMove.state &&
							moveValues[iMove].depth < bestMove.depth)) {
						var bestMove = {
							row: moveValues[iMove].row,
							column: moveValues[iMove].column,
							state: moveValues[iMove].state,
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
