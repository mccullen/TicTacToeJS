define(["boardFactory", "underscore"], function (boardFactory, _) {
	
	describe("boardFactory", function () {
		
		it ("initializes a board with no moves", function () {
			var board = boardFactory({});
			expect(board.getNumMoves()).toBe(0);
		})
		
		it("creates an empty board by default", function () {
			var board = boardFactory({});
			
			// board should be empty
			board.getPieces().forEach(function (row) {
				row.forEach(function (value) {
					expect(value).toBe(board.piece.none);
				});
			});
		})
		
		it("creates board where first player is 'X' by default", function () {
			var board = boardFactory({});
			expect(board.getCurrentPlayer()).toBe(board.piece.x);
		})

		it("allows players to play a piece at a specified row", function () {
			var board = boardFactory({});

			// TODO: Don't hardcode the board
			expect(board.playPiece({
				row: 0,
				column: 2
			}).toString()).toBe("  X      ");

			expect(board.playPiece.bind(board, {
					row: 0,
					column: 2
				})).toThrow();

			expect(board.playPiece({row: 0, column: 0}).toString())
				.toBe("O X      ");

		})

		it("can convert a board to a string", function () {
			var dimension = 3;
			var i = 0;
			var j = 0;
			var board = boardFactory({numRows: dimension, nColumns: dimension});

			var boardString = board.toString();

			var expectedValue = "";

			for (i = 0; i < dimension; i += 1) {
				for (j = 0; j < dimension; j += 1) {
					expectedValue += board.piece.none;
				}
			}
			expect(boardString).toBe(expectedValue);
		})

		it("can determine that an unfinished board is unfinished", 
			function () {
			
			var board = boardFactory({});

			// board should be unfinished since noone has placed any piece
			expect(board.getState()).toBe(board.state.unfinished);

			// make a move and board should now be unfinished
			board.playPiece({row: 0, column: 0});
			expect(board.getState()).toBe(board.state.unfinished);
		})

		it("can determine that an xWon board means x has won", function () {
			var board = boardFactory({});

			// X won diagonally
			board.playPiece({row: 0, column: 0})
				.playPiece({row: 0, column: 2})
				.playPiece({row: 1, column: 1})
				.playPiece({row: 0, column: 1})
				.playPiece({row: 2, column: 2});
			expect(board.getState()).toBe(board.state.xWon);
		})

		it("can determine that an oWon board means o won the game", function () {
		
		})

		it("can determine a draw board", function () {
			var board = boardFactory({});

			board.playPiece({row: 2, column: 2})
				.playPiece({row: 0, column: 0})
				.playPiece({row: 2, column: 0})
				.playPiece({row: 2, column: 1})
				.playPiece({row: 1, column: 1})
				.playPiece({row: 0, column: 2})
				.playPiece({row: 0, column: 1})
				.playPiece({row: 1, column: 0})
				.playPiece({row: 1, column: 2});

			expect(board.getState()).toBe(board.state.draw);
		})

		it("can play a game of n dimensions", function () {
			var numRows = parseInt(prompt("Enter number of rows"));
			var numColumns = parseInt(prompt("Enter number of columns"));
			var board = boardFactory({
				numRows: numRows,
				numColumns: numColumns
			});

			while (board.getState() === board.state.unfinished) {
				var row = parseInt(prompt("Enter row"));
				var column = parseInt(prompt("Enter column"));
				board.playPiece({row: row, column: column});
				alert(board.getState() + '\n' + board.print());
			}
		})

	})
})

