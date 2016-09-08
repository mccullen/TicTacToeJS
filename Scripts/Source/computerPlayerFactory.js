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

							// Get value of terminal state for playing 
							// the piece above assuming the other player
							// and you both play optimally
							response = mMinimax(board, depth + 1);


							board.undoLastMove();

							// Store it in the hash table
							mBoardToMoveValues[board].push({
								row: iRow,
								column: iColumn,
								depth: depth,
								value: response
							});


							if (response > value) {
								value = response;
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


							response = mMinimax(board, depth + 1);


							board.undoLastMove();

							mBoardToMoveValues[board].push({
								row: iRow,
								column: iColumn,
								depth: depth,
								value: response
							});


							if (response < value) {
								value = response;
							}
						}
					}
				}
			}
			return value;
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

		return computerPlayer;
	
	}

	return computerPlayerFactory;
});
