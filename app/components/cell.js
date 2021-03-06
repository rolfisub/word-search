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
            api: {
                required: true
            }
        },
        data: function(){
            return {
                
            };
        },
        methods: {
            getFirstSelectedCell: function(){
                for(var x = 0; x < this.game.cells.length; x++) {
                    for(var y = 0; y < this.game.cells[x].length; y++) {
                        //count clicked cells
                        if(this.game.cells[x][y].clicked) {
                            return this.game.cells[x][y];
                        }
                    }
                }
                return null;
            },
            clickMe: function() {
                var api = this.api();
                if(this.cell.canClick === true) {
                    
                    //toggles selection
                    this.cell.clicked = !this.cell.clicked;
                    
                    
                    //trigger parent cellClick method
                    api.cellClick(this.cell);

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
                            api.setAllCanClick(false);
                            var onlyCell = this.getFirstSelectedCell();
                            if(onlyCell) {
                                onlyCell.canClick = true;
                                api.activateAllowedCells(onlyCell);
                            } else {
                                api.setAllCanClick(true);
                            }
                            
                        } else {
                            var direction = this.game.allowedDirections[this.game.currentDirection];
                            var cell = this.game.cells[this.cell.x - direction.x][this.cell.y - direction.y];
                            cell.canClick = true;
                            api.activateAllowedCells(cell);
                        }
                    }
                    //submit the word after each click
                    api.submitWord();
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