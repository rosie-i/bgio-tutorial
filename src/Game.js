import { INVALID_MOVE } from 'boardgame.io/core';

export const TicTacToe = {
    // A setup function, which will set the initial value of the game state G
    // Note: The setup function also receives an object as its first argument like moves. This is useful if you need to customize the initial state based on some field in ctx — the number of players, for example — but we don’t need that for Tic-Tac-Toe.
    setup: () => ({ cells: Array(9).fill(null) }),

    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        // id value passed in is ID of the cell being clicked
        clickCell: ({ G, playerID }, id) => {
            // Validate a move and use a special constant to return invalid move
            if (G.cells[id] !== null) {
                return INVALID_MOVE;
            }
            G.cells[id] = playerID;
        }
    },

    // endIf takes a function that determines if the game is over. 
    // If it returns ANYTHING AT ALL (well, null/false vals seem to be fine?), the game ends and the return value is available at ctx.gameover.
    endIf: ({ G, ctx }) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
        if (IsDraw(G.cells)) {
            return { draw: true };
        }
    },

    ai: {
        // The enumerate function should return an array of possible moves, 
        // so in our case it returns a clickCell move for every empty cell.

        // We need to tell the bot what moves are allowed in the game, 
        // and it will find moves that tend to produce winning results
        // using the MCTS algorithm to explore the game tree and find good moves
        
        // Can configure the iterations setting to adjust the bot's playing strength!
        enumerate: (G, ctx) => {
            let moves = [];
            for (let i = 0; i < 9; i++) {
                if (G.cells[i] === null) {
                    moves.push({move: 'clickCell', args: [i]});
                }
            }
            return moves;
        }
    }
}


// Helper functions
// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
    // Winning lines
    const positions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    const isRowComplete = row => {
        const symbols = row.map(i => cells[i]);
        return symbols.every(i => i !== null && i === symbols[0]);
    };

    return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
    return cells.filter(c => c === null).length === 0;
}