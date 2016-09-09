define(["boardFactory", "computerPlayerFactory"], 
	function(boardFactory, computerPlayerFactory) {

	describe("Computer Player", function () {
		computerPlayer = computerPlayerFactory({});
		
		it("can determine the value of an empty board", 
			function () {

			board = boardFactory({});
			
			var moveValues = computerPlayer.getMoveValues(board);
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
			/*
			board = boardFactory({});
			board.playPiece({row: 0, column: 0})
				.playPiece({row: 0, column: 1})
				.playPiece({row: 1, column: 1})
				.playPiece({row: 0, column: 2});
			var moveValues = computerPlayer.getMoveValues(board);
			var bestMove = computerPlayer.getBestMove(board);
			*/
		});
		xit("allows you to play a game", function () {
			var board = boardFactory({});
			var row = 0;
			var column = 0;
			var compMove = {};
			while (board.getState() === board.state.unfinished) {
				// user's turn
				row = parseInt(prompt("Enter row"));
				column = parseInt(prompt("Enter column"));
				board.playPiece({row: row, column: column});

				// computer's turn
				compMove = computerPlayer.getBestMove(board);
				board.playPiece(compMove);
				alert(board.getState() + '\n' + board.print());
			}
		})
	});

});
