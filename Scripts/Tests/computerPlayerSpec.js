define(["boardFactory", "computerPlayerFactory"], 
	function(boardFactory, computerPlayerFactory) {

	describe("Computer Player", function () {
		computerPlayer = computerPlayerFactory({});
		
		it("can determine the value of an empty board", 
			function () {

			board = boardFactory({});
			
			var moveValues = computerPlayer.getMoveValues(board);
		});
	});

});
