define(["boardFactory", "computerPlayerFactory"], 
	function(boardFactory, computerPlayerFactory) {

	describe("Computer Player", function () {
		computerPlayer = computerPlayerFactory({});
		
		it("can determine the value of an empty board", 
			function () {

			/*
			board = boardFactory({});
			
			var moveValues = computerPlayer.getMoveValues(board);
			*/
			/*
			board = boardFactory({});
			board.playPiece({row: 0, column: 0})
				.playPiece({row: 0, column: 1})
				.playPiece({row: 0, column: 2})
				.playPiece({row: 1, column: 0})
				.playPiece({row: 1, column: 1})
				.playPiece({row: 1, column: 2});
			
			var moveValues = computerPlayer.getMoveValues(board);
			*/
			board = boardFactory({});
			board.playPiece({row: 0, column: 0})
				.playPiece({row: 0, column: 1})
				.playPiece({row: 1, column: 1})
				.playPiece({row: 0, column: 2});
			var moveValues = computerPlayer.getMoveValues(board);
			var bestMove = computerPlayer.getBestMove(board);


		});
	});

});
