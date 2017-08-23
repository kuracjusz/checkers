function createBoard() {
    
    var board = document.getElementsByClassName('empty-board');

    var board;
    var emptyBoard;

    for (var i=0; i<8; i++) {{
            board[i] += '<td class="' + i + '"></td>';
        }
    }

    for (var i=0; i<8; i++) {
        emptyBoard += '<tr>' + board[i] + '</tr>';
        board[i].
    }

    emptyBoard += '<table class="empty-board">' + emptyBoard + '</table>';

    board.innerHTML = emptyBoard;

}