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
            size: 8,
            cells: [],
            allowedLetters: [
                'A','B','C','D','E','F','G','H','I',
                'J','K','L','M','N','O','P','Q','R',
                'S','T','U','V','W','X','Y','Z'
            ],
            currentWord: '',
            words: {
                words:[],
                count: 3,
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
        player: {
            name: '',
            score: 0
        }
    },
    methods:{
        newGame: function(){
            
            /**
             * 
             * @param {type} min
             * @param {type} max
             * @returns {Number}
             */
            var getRandomInt = function(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            };
            
            var game = this.game;
            
            //reset currentWord
            game.currentWord = '';
            
            //init cells
            var cells = new Array(parseInt(game.size));
            for(var i = 0; i < game.size; i++) {
                cells[i] = new Array(parseInt(game.size));
            }
            //assign random letter value
            for(var x = 0; x < cells.length; x++) {
                for(var y = 0; y < cells[x].length; y++) {
                    var cell = game.getCellTemplate();
                    cell.x = x;
                    cell.y = y;
                    cell.letter = game.allowedLetters[getRandomInt(0, game.allowedLetters.length)];
                    cells[x][y] = cell;
                }
            }
            //save changes
            game.cells = cells;            
            
            /**
             * 
             * @param {type} count
             * @returns {Array}
             */
            var getRandomWords = function(count) {
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
            };
            
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
             * 
             * @param {type} game
             * @returns {game1Anonym$0.methods.newGame.getRandomXY.vector}
             */
            var getRandomXY = function(game) {
                var vector = {
                    x: getRandomInt(0, game.size),
                    y: getRandomInt(0, game.size)
                };
                return vector;
            };
            
            /**
             * 
             * @param {type} game
             * @returns {unresolved}
             */
            var getRandomDirection = function(game) {
                return game.allowedDirections[getRandomInt(0, game.allowedDirections.length)];
            };
            
            /**
             * 
             * @param {type} vector
             * @param {type} direction
             * @returns {undefined}
             */
            var getVectorByDirection = function(game, currPos, direction) {
                return {
                    x: currPos.x + direction.x,
                    y: currPos.y + direction.y
                };
            };
            
            /**
             * 
             * @param {type} game
             * @param {type} word
             * @returns {undefined}
             */
            var getWordVectors = function(game, word) {
                var vector = {
                    x: word.x,
                    y: word.y
                };
                var vectors = [];
                vectors.push(vector);
                var posVector = vector;
                for(var i = 1; i < word.word.length; i++) {
                    var newVector = getVectorByDirection(game, posVector, word.direction);
                    vectors.push(newVector);
                    posVector = newVector;
                }
                return vectors;
                
            };
            
            /**
             * 
             * @param {type} game
             * @param {type} startPos
             * @param {type} direction
             * @param {type} word
             * @returns {Boolean}
             */
            var doesWordFit = function(game, startPos, direction, word) {
                var newX = startPos.x;
                var newY = startPos.y;
                for(var i = 0; i < word.word.length; i++) {
                    if(!isXYInBoard(game, newX, newY)) {
                        return false;
                    }
                    newX += direction.x;
                    newY += direction.y;
                }
                return true;
                
            };
            
            /**
             * 
             * @param {type} vector
             * @param {type} vectors
             * @returns {Boolean}
             */
            var isVectorInVectors = function(vector, vectors) {
                var result = vectors.indexOf(vector);
                if (result === -1) {
                    return false;
                }
                return true;
            };
            
            /**
             * 
             * @param {type} game
             * @param {type} vector
             * @returns {string}
             */
            var getLetterByVector = function(game, vector) {
                return game.cells[vector.x][vector.y].letter;
            };
            
            /**
             * 
             * @param {type} word
             * @param {type} vectorIndex
             * @returns {undefined}
             */
            var getLetterByIndex = function(word, vectorIndex) {
                return word.word.charAt(vectorIndex);
            };
            
            /**
             * 
             * @param {type} game
             * @returns {undefined}
             */
            var isCollisionOk = function(game, startPos, direction, word) {                
                var existingWords = game.words.words;
                var badCol = 0;
                var validCol = 0;
                var allVectors = [];
                existingWords.forEach(function(word2){
                    var vectors2 = word2.vectors;
                    vectors2.forEach(function(vector2){
                        if(isXYInBoard(game, vector2.x, vector2.y)) {
                            allVectors.push(vector2);
                        }
                    }, this);
                }, this);
                
                var newWord = {
                    solved: false,
                    word: word.word,
                    x: startPos.x,
                    y: startPos.y,
                    direction: direction
                };
                
                newWord.vectors = getWordVectors(game, newWord);
                
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
                if(validCol > game.words.maxCollisionLetters) {
                    return false;
                }
                return true;
            };
            
            /**
             * 
             * @param {type} game
             * @param {type} startPos
             * @param {type} direction
             * @param {type} word
             * @returns {undefined}
             */
            var isWordOkToDraw = function(game, startPos, direction, word) {
                if(doesWordFit(game, startPos, direction, word)) {
                    if(isCollisionOk(game, startPos, direction, word)) {
                        return true;
                    }
                }
                return false;
            };
            
            /**
             * 
             * @param {type} game
             * @param {type} word
             * @returns {undefined}
             */
            var drawWord = function(game, word){
                word.vectors.forEach(function(vector, key){
                    var letter = getLetterByIndex(word, key);
                    game.cells[vector.x][vector.y].letter = letter;
                }, this);
            };
            
            
            //generate words
            game.words.words = getRandomWords(parseInt(game.words.count));
            
            //set up words in board
            game.words.words.forEach(function(word){
                //get random vector
                var rVector = getRandomXY(game);
                //get random direction
                var rDirection = getRandomDirection(game);
                
                //loop untill fit found
                var loopCounter = 0;
                var maxLoops = 500;
                while(!isWordOkToDraw(game, rVector, rDirection, word) && loopCounter < maxLoops ) {
                    //get both again
                    rVector = getRandomXY(game);
                    rDirection = getRandomDirection(game);
                    
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
                word.vectors = getWordVectors(game, word);
                
                //word is ok to draw
                drawWord(game, word);
                
            }, this);
        },
        submitWord: function() {
            //check if the word is found and change its vetors to clicked
            var game = this.game;
            game.currentWord;
            
            game.words.words.forEach(function(word){
                if(game.currentWord === word.word) {
                    word.solved = true;
                    game.currentWord = '';
                    game.currentDirection = -1;
                }
            }, this);
            
            game.cells.forEach(function(cellRow){
                cellRow.forEach(function(cell){
                    cell.canClick = true;
                },this);
            }, this);
            
        },
        showAnswers: function() {
            //loop trough all words and change vectors to clicked
            var game = this.game;
            
            game.words.words.forEach(function(word){
                word.vectors.forEach(function(vector){
                    game.cells[vector.x][vector.y].clicked = true;
                }, this);
            }, this);
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



