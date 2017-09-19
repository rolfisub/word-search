/**
 * @author Rolf
 */

Vue.component(
    'cell',
    {
        props: {
            cell:{
                type: Object,
                required: true
            },
            game:{
                type: Object,
                required: true
            },
            submitWord: {
                required: true
            }
        },
        data: function(){
            return {
                
            };
        },
        methods: {
            clickMe: function() {
                if(this.cell.canClick === true) {
                    
                    //toggles selection
                    this.cell.clicked = !this.cell.clicked;
                    
                    /**
                     * determines id a xy coordinate is inside the board
                     * @param {object} game
                     * @param {int} x
                     * @param {int} y
                     * @returns {Boolean}
                     */
                    var isXYInBoard = function(game, x, y) {
                        return (x >= 0 && x < game.size && y >= 0 && y < game.size);
                    };
                    
                    /**
                     * sets can click to boolean
                     * @param {boolean} canClick
                     * @returns {Number} count of selected cells
                     */
                    var setAllCanClick = function(canClick, game) {
                        var countSel = 0;
                        for(var x = 0; x < game.cells.length; x++) {
                            for(var y = 0; y < game.cells[x].length; y++) {
                                //set all to canClick to false
                                game.cells[x][y].canClick = canClick;
                                //count clicked cells
                                if(game.cells[x][y].clicked) {
                                    countSel++;
                                }
                            }
                        }
                        return countSel;
                    };
                    
                    //get count of selected cells and set them can click to false
                    var countCell = setAllCanClick(false, this.game);
                    
                    //get current direction
                    var getCurrentDirectionIndex = function(game, selectedCell, countCell) {
                        var currentDirection = -1;
                        
                        //direction can be determined because selections >= 2
                        if(countCell >= 2) {
                            for (var d = 0; d < game.allowedDirections.length; d++) {
                                var direction = game.allowedDirections[d];
                                var newX = selectedCell.x - direction.x;
                                var newY = selectedCell.y - direction.y;
                                if(isXYInBoard(game, newX, newY)) {
                                    var cell = game.cells[newX][newY];
                                    if(cell.clicked === true) {
                                        currentDirection = d;
                                    }
                                }
                            }
                        }
                        return currentDirection;
                    };
                    
                    
                    
                    //save calculated direction
                    this.game.currentDirection = getCurrentDirectionIndex(this.game, this.cell, countCell);

                    //activate allowed cells
                    var activateAllowedCells = function(game, selectedCell) {
                        if(game.currentDirection === -1) {
                            //canclick on all allowed directions
                            for(var d = 0; d < game.allowedDirections.length; d++) {
                                var direction = game.allowedDirections[d];
                                var newX = selectedCell.x + direction.x;
                                var newY = selectedCell.y + direction.y;
                                if(isXYInBoard(game, newX, newY)) {
                                    var cell = game.cells[newX][newY];
                                    cell.canClick = true;
                                }
                            }
                        } else {
                            //direction set only one cell can be clicked
                            var direction = game.allowedDirections[game.currentDirection];
                            var newX = selectedCell.x + direction.x;
                            var newY = selectedCell.y + direction.y;
                            if(isXYInBoard(game, newX, newY)) {
                                var cell = game.cells[newX][newY];
                                cell.canClick = true;
                            }
                        }
                    };
                    
                    //activate allowed cells
                    activateAllowedCells(this.game, this.cell);
                    
                    
                    var getFirstSelectedCell = function(game){
                        for(var x = 0; x < game.cells.length; x++) {
                            for(var y = 0; y < game.cells[x].length; y++) {
                                //count clicked cells
                                if(game.cells[x][y].clicked) {
                                    return game.cells[x][y];
                                }
                            }
                        }
                        return null;
                    };
                    
                    //if new status is clicked
                    if(this.cell.clicked) {
                        this.cell.canClick = true;
                        this.game.currentWord = this.game.currentWord + this.cell.letter;
                    } else { //if we are removing
                        
                        //remove last character
                        this.game.currentWord = this.game.currentWord.slice(0, -1);
                        
                        //if direction not determined
                        if(this.game.currentDirection === -1) {
                            //set all to can click yes
                            countCell = setAllCanClick(false, this.game);
                            var onlyCell = getFirstSelectedCell(this.game);
                            if(onlyCell) {
                                onlyCell.canClick = true;
                                activateAllowedCells(this.game, onlyCell);
                            } else {
                                setAllCanClick(true, this.game);
                            }
                            
                        } else {
                            var direction = this.game.allowedDirections[this.game.currentDirection];
                            var cell = this.game.cells[this.cell.x - direction.x][this.cell.y - direction.y];
                            cell.canClick = true;
                            activateAllowedCells(this.game, cell);
                        }
                    }
                    
                    //auto submit word
                    this.submitWord();
                }
            }
        },
        template: '<div class="ws-cell" '
                + 'v-bind:class="{\'ws-cell-clicked\': cell.clicked, \'ws-cell-can-click\': cell.canClick}" '
                +' v-on:click="clickMe">' 
                        + '{{cell.letter}}'
                + '</div>'
    }
);