/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Word search game using Vue.js by Rolf Bansbach
 * @type type
 */



var ws = new Vue({
    el: '#wordSearch',
    data:{
        game: {
            getCellTemplate: function(){
                return {
                    x: -1,
                    y: -1,
                    letter: '',
                    clicked: false,
                    canClick: true
                };
            },
            size: 12,
            cells: [],
            allowedLetters: [
                'A','B','C','D','E','F','G','H','I',
                'J','K','L','M','N','O','P','Q','R',
                'S','T','U','V','W','X','Y','Z'
            ],
            currentWord: '',
            words: {
                words:[],
                count: 8,
                maxCollisionLetters: 1
            },
            allowedDirections:[
                { //down
                    x: 1,
                    y: 0
                },
                { //right
                    x: 0,
                    y: 1
                },
                {//up
                    x: -1,
                    y: 0
                },
                { //left
                    x:0,
                    y:-1
                },
                { //diagonal right down
                    x: 1,
                    y: 1
                },
                { //diagonal right up
                    x: -1,
                    y: 1
                },
                { //diagonal left down
                    x: 1,
                    y: -1
                },
                { //diagonal left up
                    x: -1,
                    y: -1
                }
            ],
            currentDirection: -1
        },
        scoring:{
            perWord: {
                points: 20
            }
        },
        player: {
            name: '',
            score: 0
        }
    },
    methods:{
        getPublicApi: function() {
            return {
                //events
                cellClick: this.cellClick,
                //helpers
                isVectorInBoard: this.isVectorInBoard,
                setAllCanClick: this.setAllCanClick,
                activateAllowedCells: this.activateAllowedCells,
                
                
            };
        },
        getRandomInt: function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        },
        createBoard: function() {
            //init cells
            var cells = new Array(parseInt(this.game.size));
            for(var i = 0; i < this.game.size; i++) {
                cells[i] = new Array(parseInt(this.game.size));
            }
            //assign random letter value
            for(var x = 0; x < cells.length; x++) {
                for(var y = 0; y < cells[x].length; y++) {
                    var cell = this.game.getCellTemplate();
                    cell.x = x;
                    cell.y = y;
                    cell.letter = this.game.allowedLetters[this.getRandomInt(0, this.game.allowedLetters.length)];
                    cells[x][y] = cell;
                }
            }
            //save changes
            this.game.cells = cells;
        },
        getRandomWords: function(count) {
            var wordsArr = new Array(count);
            var wordsStrArr = words({exactly: count});
            wordsStrArr.forEach(function(wordStr, key){
                wordsArr[key] = {
                    solved: false,
                    word: wordStr.toUpperCase(),
                    x: -1,
                    y: -1,
                    direction: -1,
                    vectors:[]
                };
            });
            return wordsArr;
        },
        isVectorInBoard: function(vector) {
            return (vector.x >= 0 && vector.x < this.game.size && vector.y >= 0 && vector.y < this.game.size);
        },
        getRandomVector: function(){
            var vector = {
                x: this.getRandomInt(0, this.game.size),
                y: this.getRandomInt(0, this.game.size)
            };
            return vector;
        },
        getRandomDirectionVector: function() {
            return this.game.allowedDirections[this.getRandomInt(0, this.game.allowedDirections.length)];
        },
        getNextVector: function(origin, direction) {
            return {
                x: origin.x + direction.x,
                y: origin.y + direction.y
            };
        },
        getWordVectors: function(word) {
            var vector = {
                x: word.x,
                y: word.y
            };
            var vectors = [];
            vectors.push(vector);
            var posVector = vector;
            for(var i = 1; i < word.word.length; i++) {
                var newVector = this.getNextVector(posVector, word.direction);
                vectors.push(newVector);
                posVector = newVector;
            }
            return vectors;
        },
        doesWordFit: function(startPos, direction, word) {
            var newX = startPos.x;
            var newY = startPos.y;
            for(var i = 0; i < word.word.length; i++) {
                if(!this.isVectorInBoard(startPos)) {
                    return false;
                }
                newX += direction.x;
                newY += direction.y;
            }
            return true;
        },
        isVectorInVectors: function(vector, vectors) {
            var result = vectors.indexOf(vector);
            if (result === -1) {
                return false;
            }
            return true;
        },
        getLetterByVector: function(vector){
            return this.game.cells[vector.x][vector.y].letter;
        },
        getLetterByIndex: function(word, vectorIndex) {
            return word.word.charAt(vectorIndex);
        },
        isCollisionOk: function (startPos, direction, word) {
            var badCol = 0;
            var validCol = 0;
            var allVectors = [];
            var existingWords = this.game.words.words;
            existingWords.forEach(function(word2){
                var vectors2 = word2.vectors;
                vectors2.forEach(function(vector2){
                    if(this.isVectorInBoard(vector2)) {
                        allVectors.push(vector2);
                    }
                }, this);
            }, this);
            var newWord = {
                solved: false,
                word: word.word,
                x: startPos.x,
                y: startPos.y,
                direction: direction,
                vectors: []
            };
            newWord.vectors = this.getWordVectors(newWord);
            newWord.vectors.forEach(function(vector){
                allVectors.forEach(function(vector2){
                    if(vector.x === vector2.x && vector.y === vector2.y) {
                        badCol++;
                    }
                }, this);
            }, this);
            if(badCol > 0) {
                return false;
            }
            if(validCol > this.game.words.maxCollisionLetters) {
                return false;
            }
            return true;
        },
        isWordOkToDraw: function(startPos, direction, word){
            if(this.doesWordFit(startPos, direction, word)) {
                if(this.isCollisionOk(startPos, direction, word)) {
                    return true;
                }
            }
            return false;
        },
        drawWord: function(word) {
            word.vectors.forEach(function(vector, key){
                var letter = this.getLetterByIndex(word, key);
                this.game.cells[vector.x][vector.y].letter = letter;
            }, this);
        },
        newGame: function(){

            var game = this.game;
            
            //reset currentWord
            game.currentWord = '';
            
            //init board
            this.createBoard();                    
            
            
            //generate words
            game.words.words = this.getRandomWords(parseInt(game.words.count));
            
            //set up words in board
            game.words.words.forEach(function(word){
                //get random vector
                var rVector = this.getRandomVector();
                //get random direction
                var rDirection = this.getRandomDirectionVector();
                
                //loop untill fit found
                var loopCounter = 0;
                var maxLoops = 500;
                while(!this.isWordOkToDraw(rVector, rDirection, word) && loopCounter < maxLoops ) {
                    //get both again
                    rVector = this.getRandomVector();
                    rDirection = this.getRandomDirectionVector();
                    
                    //avoid infinite loop
                    loopCounter++;
                }
                
                //error game is not valid
                if(loopCounter === maxLoops) {
                    //remove one word
                    game.words.count--;
                    //add one cell
                    game.size++;
                    
                    //create new game
                    this.newGame();
                    
                }
                word.x = rVector.x;
                word.y = rVector.y;
                word.direction = rDirection;
                word.vectors = this.getWordVectors(word);
                
                //word is ok to draw
                this.drawWord(word);
                
            }, this);
        },
        submitWord: function() {
            //check if the word is found and change its vetors to clicked
            var game = this.game;
            game.currentWord;
            
            var solved = false;
            
            game.words.words.forEach(function(word){
                if(game.currentWord === word.word) {
                    word.solved = true;
                    solved = true;
                    game.currentWord = '';
                    game.currentDirection = -1;
                }
            }, this);
            if(solved) {
                game.cells.forEach(function(cellRow){
                    cellRow.forEach(function(cell){
                        cell.canClick = true;
                    }, this);
                }, this);
            }
            
        },
        showAnswers: function() {
            //loop trough all words and change vectors to clicked
            var game = this.game;
            
            game.words.words.forEach(function(word){
                word.vectors.forEach(function(vector){
                    game.cells[vector.x][vector.y].clicked = true;
                }, this);
            }, this);
        },
        setAllCanClick: function(canClick){
            var countSel = 0;
            for(var x = 0; x < this.game.cells.length; x++) {
                for(var y = 0; y < this.game.cells[x].length; y++) {
                    //set all to canClick to false
                    this.game.cells[x][y].canClick = canClick;
                    //count clicked cells
                    if(this.game.cells[x][y].clicked) {
                        countSel++;
                    }
                }
            }
            return countSel;
        },
        getCurrentDirectionIndex: function(selectedCell, countCell) {
            var currentDirection = -1;         
            //direction can be determined because selections >= 2
            if(countCell >= 2) {
                for (var d = 0; d < this.game.allowedDirections.length; d++) {
                    var direction = this.game.allowedDirections[d];
                    var vector = {
                        x: selectedCell.x - direction.x,
                        y: selectedCell.y - direction.y
                    };
                    if(this.isVectorInBoard(vector)) {
                        var cell = this.game.cells[vector.x][vector.y];
                        if(cell.clicked === true) {
                            currentDirection = d;
                        }
                    }
                }
            }
            return currentDirection;
        },
        activateAllowedCells: function(selectedCell) {
            if(this.game.currentDirection === -1) {
                //canclick on all allowed directions
                for(var d = 0; d < this.game.allowedDirections.length; d++) {
                    var direction = this.game.allowedDirections[d];
                    var vector = {
                        x: selectedCell.x + direction.x,
                        y: selectedCell.y + direction.y
                    };
                    if(this.isVectorInBoard(vector)) {
                        var cell = this.game.cells[vector.x][vector.y];
                        cell.canClick = true;
                    }
                }
            } else {
                //direction set only one cell can be clicked
                var direction = this.game.allowedDirections[this.game.currentDirection];
                var vector = {
                    x: selectedCell.x + direction.x,
                    y: selectedCell.y + direction.y
                };
                if(this.isVectorInBoard(vector)) {
                    var cell = this.game.cells[vector.x][vector.y];
                    cell.canClick = true;
                }
            }
        },
        cellClick: function(cell) {
            
            //reset all can click status
            var countCell = this.setAllCanClick(false);
            
            //save current direction
            this.game.currentDirection = this.getCurrentDirectionIndex(cell, countCell);
            
            //activate allowed cells
            this.activateAllowedCells(cell);
        }
    },
    mounted: function() {
        
        /**
         * Trigger new game on load
         */
        this.newGame();
        
        
    }
    
});

//board
//cell



