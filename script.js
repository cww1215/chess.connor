var board = null;
var game = new Chess();
var stockfish = new Worker('https://cdn.jsdelivr.net/npm/stockfish/stockfish.js');

function onDragStart(source, piece) {
  if (game.game_over()) return false;
  if (piece.search(/^b/) !== -1) return false; // Only allow white to move
}

function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  window.setTimeout(makeAIMove, 250);
}

function makeAIMove() {
  stockfish.postMessage("position fen " + game.fen());
  stockfish.postMessage("go depth 15");

  stockfish.onmessage = function(event) {
    if (event.data.startsWith("bestmove")) {
      var bestMove = event.data.split(" ")[1];
      game.move({
        from: bestMove.substring(0,2),
        to: bestMove.substring(2,4),
        promotion: 'q'
      });
      board.position(game.fen());
    }
  };
}

board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop
});
