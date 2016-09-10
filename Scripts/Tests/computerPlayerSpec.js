define(["boardFactory", "computerPlayerFactory"], 
	function(boardFactory, computerPlayerFactory) {

	describe("Computer Player", function () {
		computerPlayer = computerPlayerFactory({});
		
		it("can determine the value of an empty board", 
			function () {

			board = boardFactory({numRows: 3, numColumns: 3});
			
			var moveValues = computerPlayer.getMoveValues(board);
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

				try {
				board.playPiece({row: compMove.row, column: compMove.column});
				} catch (e) {
					debugger;
				}
				alert(board.getState() + '\n' + board.print());
			}
		})
	});

});
