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

			if (board.getState() !== board.state.unfinished) {
				// we are at a terminal node (draw, xWon, or oWon)
				// so evaluate

				
			} else if (board.getCurrentPlayer() === board.piece.x) {
				// it is maximizer's turn (x)
				for (iRow = 0; iRow < board.getNumRows(); iRow += 1) {
					for (iColumn = 0; iColumn < board.getNumColumns();
						iColumn += 1) {

						board.playPiece({row: iRow, column: iColumn});
						mMinimax(board, depth + 1);
						board.undoLastMove();
					}
				}
			} else {
				// it is minimizer's turn (o)
				for (jRow = 0; jRow < board.getNumRows(); jRow += 1) {
					for (jColumn = 0; jColumn < board.getNumColumns();
						jColumn += 1) {

						board.playPiece({row: jRow, column: jColumn});
						mMinimax(board, depth + 1);
						board.undoLastMove();
					}
				}
			}
		};


		/**
		 * Given a board, get an array of all valid moves along
		 * with their values and the depths which lead to that value.
		 */
		computerPlayer.getMoveValues = function (board) {
			var moveValues = [];
			// If already stored, get the value and return it.
			if (mBoardToMoveValues.hasOwnProperty(board)) {
				moves = mBoardToMoveValues[board];

			} 
			// Otherwise, minimax
			else {
				moves = mMiniMax(board, 0);
			}


			return moveValues;
		};

		return computerPlayer;
	
	}

	return computerPlayerFactory;
});
