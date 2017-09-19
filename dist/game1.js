/**
 * @author Rolf
 */

Vue.component(
    'board',
    {
        props: {
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
        template: '<div class="container ws-board">'
                    + '<div class="row" v-for="cellRow in game.cells">'
                        + '<cell '
                            + 'v-for="cell in cellRow" ' 
                            + 'v-bind:game="game" '
                            + 'v-bind:api="api" '
                            + 'v-bind:cell="cell" :key="cell.id"></cell>'
                    + '</div>'
                + '</div>'
    }
);
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
            clickMe: function() {
                if(this.cell.canClick === true) {
                    
                    //toggles selection
                    this.cell.clicked = !this.cell.clicked;
                    
                    //trigger parent cellClick method
                    this.api.cellClick(this.cell);

                    var getFirstSelectedCell = function(){
                        for(var x = 0; x < this.game.cells.length; x++) {
                            for(var y = 0; y < this.game.cells[x].length; y++) {
                                //count clicked cells
                                if(this.game.cells[x][y].clicked) {
                                    return this.game.cells[x][y];
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
                            setAllCanClick(false, this.game);
                            var onlyCell = getFirstSelectedCell();
                            if(onlyCell) {
                                onlyCell.canClick = true;
                                this.api.activateAllowedCells(onlyCell);
                            } else {
                                this.api.setAllCanClick(true);
                            }
                            
                        } else {
                            var direction = this.game.allowedDirections[this.game.currentDirection];
                            var cell = this.game.cells[this.cell.x - direction.x][this.cell.y - direction.y];
                            cell.canClick = true;
                            this.api.activateAllowedCells(cell);
                        }
                    }
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
/**
 * Took this list from npm install random-words library and modify for frontend use
 * @type Array
 */
var wordList = [
  // Borrowed from xkcd password generator which borrowed it from wherever
  "ability","able","aboard","about","above","accept","accident","according",
  "account","accurate","acres","across","act","action","active","activity",
  "actual","actually","add","addition","additional","adjective","adult","adventure",
  "advice","affect","afraid","after","afternoon","again","against","age",
  "ago","agree","ahead","aid","air","airplane","alike","alive",
  "all","allow","almost","alone","along","aloud","alphabet","already",
  "also","although","am","among","amount","ancient","angle","angry",
  "animal","announced","another","answer","ants","any","anybody","anyone",
  "anything","anyway","anywhere","apart","apartment","appearance","apple","applied",
  "appropriate","are","area","arm","army","around","arrange","arrangement",
  "arrive","arrow","art","article","as","aside","ask","asleep",
  "at","ate","atmosphere","atom","atomic","attached","attack","attempt",
  "attention","audience","author","automobile","available","average","avoid","aware",
  "away","baby","back","bad","badly","bag","balance","ball",
  "balloon","band","bank","bar","bare","bark","barn","base",
  "baseball","basic","basis","basket","bat","battle","be","bean",
  "bear","beat","beautiful","beauty","became","because","become","becoming",
  "bee","been","before","began","beginning","begun","behavior","behind",
  "being","believed","bell","belong","below","belt","bend","beneath",
  "bent","beside","best","bet","better","between","beyond","bicycle",
  "bigger","biggest","bill","birds","birth","birthday","bit","bite",
  "black","blank","blanket","blew","blind","block","blood","blow",
  "blue","board","boat","body","bone","book","border","born",
  "both","bottle","bottom","bound","bow","bowl","box","boy",
  "brain","branch","brass","brave","bread","break","breakfast","breath",
  "breathe","breathing","breeze","brick","bridge","brief","bright","bring",
  "broad","broke","broken","brother","brought","brown","brush","buffalo",
  "build","building","built","buried","burn","burst","bus","bush",
  "business","busy","but","butter","buy","by","cabin","cage",
  "cake","call","calm","came","camera","camp","can","canal",
  "cannot","cap","capital","captain","captured","car","carbon","card",
  "care","careful","carefully","carried","carry","case","cast","castle",
  "cat","catch","cattle","caught","cause","cave","cell","cent",
  "center","central","century","certain","certainly","chain","chair","chamber",
  "chance","change","changing","chapter","character","characteristic","charge","chart",
  "check","cheese","chemical","chest","chicken","chief","child","children",
  "choice","choose","chose","chosen","church","circle","circus","citizen",
  "city","class","classroom","claws","clay","clean","clear","clearly",
  "climate","climb","clock","close","closely","closer","cloth","clothes",
  "clothing","cloud","club","coach","coal","coast","coat","coffee",
  "cold","collect","college","colony","color","column","combination","combine",
  "come","comfortable","coming","command","common","community","company","compare",
  "compass","complete","completely","complex","composed","composition","compound","concerned",
  "condition","congress","connected","consider","consist","consonant","constantly","construction",
  "contain","continent","continued","contrast","control","conversation","cook","cookies",
  "cool","copper","copy","corn","corner","correct","correctly","cost",
  "cotton","could","count","country","couple","courage","course","court",
  "cover","cow","cowboy","crack","cream","create","creature","crew",
  "crop","cross","crowd","cry","cup","curious","current","curve",
  "customs","cut","cutting","daily","damage","dance","danger","dangerous",
  "dark","darkness","date","daughter","dawn","day","dead","deal",
  "dear","death","decide","declared","deep","deeply","deer","definition",
  "degree","depend","depth","describe","desert","design","desk","detail",
  "determine","develop","development","diagram","diameter","did","die","differ",
  "difference","different","difficult","difficulty","dig","dinner","direct","direction",
  "directly","dirt","dirty","disappear","discover","discovery","discuss","discussion",
  "disease","dish","distance","distant","divide","division","do","doctor",
  "does","dog","doing","doll","dollar","done","donkey","door",
  "dot","double","doubt","down","dozen","draw","drawn","dream",
  "dress","drew","dried","drink","drive","driven","driver","driving",
  "drop","dropped","drove","dry","duck","due","dug","dull",
  "during","dust","duty","each","eager","ear","earlier","early",
  "earn","earth","easier","easily","east","easy","eat","eaten",
  "edge","education","effect","effort","egg","eight","either","electric",
  "electricity","element","elephant","eleven","else","empty","end","enemy",
  "energy","engine","engineer","enjoy","enough","enter","entire","entirely",
  "environment","equal","equally","equator","equipment","escape","especially","essential",
  "establish","even","evening","event","eventually","ever","every","everybody",
  "everyone","everything","everywhere","evidence","exact","exactly","examine","example",
  "excellent","except","exchange","excited","excitement","exciting","exclaimed","exercise",
  "exist","expect","experience","experiment","explain","explanation","explore","express",
  "expression","extra","eye","face","facing","fact","factor","factory",
  "failed","fair","fairly","fall","fallen","familiar","family","famous",
  "far","farm","farmer","farther","fast","fastened","faster","fat",
  "father","favorite","fear","feathers","feature","fed","feed","feel",
  "feet","fell","fellow","felt","fence","few","fewer","field",
  "fierce","fifteen","fifth","fifty","fight","fighting","figure","fill",
  "film","final","finally","find","fine","finest","finger","finish",
  "fire","fireplace","firm","first","fish","five","fix","flag",
  "flame","flat","flew","flies","flight","floating","floor","flow",
  "flower","fly","fog","folks","follow","food","foot","football",
  "for","force","foreign","forest","forget","forgot","forgotten","form",
  "former","fort","forth","forty","forward","fought","found","four",
  "fourth","fox","frame","free","freedom","frequently","fresh","friend",
  "friendly","frighten","frog","from","front","frozen","fruit","fuel",
  "full","fully","fun","function","funny","fur","furniture","further",
  "future","gain","game","garage","garden","gas","gasoline","gate",
  "gather","gave","general","generally","gentle","gently","get","getting",
  "giant","gift","girl","give","given","giving","glad","glass",
  "globe","go","goes","gold","golden","gone","good","goose",
  "got","government","grabbed","grade","gradually","grain","grandfather","grandmother",
  "graph","grass","gravity","gray","great","greater","greatest","greatly",
  "green","grew","ground","group","grow","grown","growth","guard",
  "guess","guide","gulf","gun","habit","had","hair","half",
  "halfway","hall","hand","handle","handsome","hang","happen","happened",
  "happily","happy","harbor","hard","harder","hardly","has","hat",
  "have","having","hay","he","headed","heading","health","heard",
  "hearing","heart","heat","heavy","height","held","hello","help",
  "helpful","her","herd","here","herself","hidden","hide","high",
  "higher","highest","highway","hill","him","himself","his","history",
  "hit","hold","hole","hollow","home","honor","hope","horn",
  "horse","hospital","hot","hour","house","how","however","huge",
  "human","hundred","hung","hungry","hunt","hunter","hurried","hurry",
  "hurt","husband","ice","idea","identity","if","ill","image",
  "imagine","immediately","importance","important","impossible","improve","in","inch",
  "include","including","income","increase","indeed","independent","indicate","individual",
  "industrial","industry","influence","information","inside","instance","instant","instead",
  "instrument","interest","interior","into","introduced","invented","involved","iron",
  "is","island","it","its","itself","jack","jar","jet",
  "job","join","joined","journey","joy","judge","jump","jungle",
  "just","keep","kept","key","kids","kill","kind","kitchen",
  "knew","knife","know","knowledge","known","label","labor","lack",
  "lady","laid","lake","lamp","land","language","large","larger",
  "largest","last","late","later","laugh","law","lay","layers",
  "lead","leader","leaf","learn","least","leather","leave","leaving",
  "led","left","leg","length","lesson","let","letter","level",
  "library","lie","life","lift","light","like","likely","limited",
  "line","lion","lips","liquid","list","listen","little","live",
  "living","load","local","locate","location","log","lonely","long",
  "longer","look","loose","lose","loss","lost","lot","loud",
  "love","lovely","low","lower","luck","lucky","lunch","lungs",
  "lying","machine","machinery","mad","made","magic","magnet","mail",
  "main","mainly","major","make","making","man","managed","manner",
  "manufacturing","many","map","mark","market","married","mass","massage",
  "master","material","mathematics","matter","may","maybe","me","meal",
  "mean","means","meant","measure","meat","medicine","meet","melted",
  "member","memory","men","mental","merely","met","metal","method",
  "mice","middle","might","mighty","mile","military","milk","mill",
  "mind","mine","minerals","minute","mirror","missing","mission","mistake",
  "mix","mixture","model","modern","molecular","moment","money","monkey",
  "month","mood","moon","more","morning","most","mostly","mother",
  "motion","motor","mountain","mouse","mouth","move","movement","movie",
  "moving","mud","muscle","music","musical","must","my","myself",
  "mysterious","nails","name","nation","national","native","natural","naturally",
  "nature","near","nearby","nearer","nearest","nearly","necessary","neck",
  "needed","needle","needs","negative","neighbor","neighborhood","nervous","nest",
  "never","new","news","newspaper","next","nice","night","nine",
  "no","nobody","nodded","noise","none","noon","nor","north",
  "nose","not","note","noted","nothing","notice","noun","now",
  "number","numeral","nuts","object","observe","obtain","occasionally","occur",
  "ocean","of","off","offer","office","officer","official","oil",
  "old","older","oldest","on","once","one","only","onto",
  "open","operation","opinion","opportunity","opposite","or","orange","orbit",
  "order","ordinary","organization","organized","origin","original","other","ought",
  "our","ourselves","out","outer","outline","outside","over","own",
  "owner","oxygen","pack","package","page","paid","pain","paint",
  "pair","palace","pale","pan","paper","paragraph","parallel","parent",
  "park","part","particles","particular","particularly","partly","parts","party",
  "pass","passage","past","path","pattern","pay","peace","pen",
  "pencil","people","per","percent","perfect","perfectly","perhaps","period",
  "person","personal","pet","phrase","physical","piano","pick","picture",
  "pictured","pie","piece","pig","pile","pilot","pine","pink",
  "pipe","pitch","place","plain","plan","plane","planet","planned",
  "planning","plant","plastic","plate","plates","play","pleasant","please",
  "pleasure","plenty","plural","plus","pocket","poem","poet","poetry",
  "point","pole","police","policeman","political","pond","pony","pool",
  "poor","popular","population","porch","port","position","positive","possible",
  "possibly","post","pot","potatoes","pound","pour","powder","power",
  "powerful","practical","practice","prepare","present","president","press","pressure",
  "pretty","prevent","previous","price","pride","primitive","principal","principle",
  "printed","private","prize","probably","problem","process","produce","product",
  "production","program","progress","promised","proper","properly","property","protection",
  "proud","prove","provide","public","pull","pupil","pure","purple",
  "purpose","push","put","putting","quarter","queen","question","quick",
  "quickly","quiet","quietly","quite","rabbit","race","radio","railroad",
  "rain","raise","ran","ranch","range","rapidly","rate","rather",
  "raw","rays","reach","read","reader","ready","real","realize",
  "rear","reason","recall","receive","recent","recently","recognize","record",
  "red","refer","refused","region","regular","related","relationship","religious",
  "remain","remarkable","remember","remove","repeat","replace","replied","report",
  "represent","require","research","respect","rest","result","return","review",
  "rhyme","rhythm","rice","rich","ride","riding","right","ring",
  "rise","rising","river","road","roar","rock","rocket","rocky",
  "rod","roll","roof","room","root","rope","rose","rough",
  "round","route","row","rubbed","rubber","rule","ruler","run",
  "running","rush","sad","saddle","safe","safety","said","sail",
  "sale","salmon","salt","same","sand","sang","sat","satellites",
  "satisfied","save","saved","saw","say","scale","scared","scene",
  "school","science","scientific","scientist","score","screen","sea","search",
  "season","seat","second","secret","section","see","seed","seeing",
  "seems","seen","seldom","select","selection","sell","send","sense",
  "sent","sentence","separate","series","serious","serve","service","sets",
  "setting","settle","settlers","seven","several","shade","shadow","shake",
  "shaking","shall","shallow","shape","share","sharp","she","sheep",
  "sheet","shelf","shells","shelter","shine","shinning","ship","shirt",
  "shoe","shoot","shop","shore","short","shorter","shot","should",
  "shoulder","shout","show","shown","shut","sick","sides","sight",
  "sign","signal","silence","silent","silk","silly","silver","similar",
  "simple","simplest","simply","since","sing","single","sink","sister",
  "sit","sitting","situation","six","size","skill","skin","sky",
  "slabs","slave","sleep","slept","slide","slight","slightly","slip",
  "slipped","slope","slow","slowly","small","smaller","smallest","smell",
  "smile","smoke","smooth","snake","snow","so","soap","social",
  "society","soft","softly","soil","solar","sold","soldier","solid",
  "solution","solve","some","somebody","somehow","someone","something","sometime",
  "somewhere","son","song","soon","sort","sound","source","south",
  "southern","space","speak","special","species","specific","speech","speed",
  "spell","spend","spent","spider","spin","spirit","spite","split",
  "spoken","sport","spread","spring","square","stage","stairs","stand",
  "standard","star","stared","start","state","statement","station","stay",
  "steady","steam","steel","steep","stems","step","stepped","stick",
  "stiff","still","stock","stomach","stone","stood","stop","stopped",
  "store","storm","story","stove","straight","strange","stranger","straw",
  "stream","street","strength","stretch","strike","string","strip","strong",
  "stronger","struck","structure","struggle","stuck","student","studied","studying",
  "subject","substance","success","successful","such","sudden","suddenly","sugar",
  "suggest","suit","sum","summer","sun","sunlight","supper","supply",
  "support","suppose","sure","surface","surprise","surrounded","swam","sweet",
  "swept","swim","swimming","swing","swung","syllable","symbol","system",
  "table","tail","take","taken","tales","talk","tall","tank",
  "tape","task","taste","taught","tax","tea","teach","teacher",
  "team","tears","teeth","telephone","television","tell","temperature","ten",
  "tent","term","terrible","test","than","thank","that","thee",
  "them","themselves","then","theory","there","therefore","these","they",
  "thick","thin","thing","think","third","thirty","this","those",
  "thou","though","thought","thousand","thread","three","threw","throat",
  "through","throughout","throw","thrown","thumb","thus","thy","tide",
  "tie","tight","tightly","till","time","tin","tiny","tip",
  "tired","title","to","tobacco","today","together","told","tomorrow",
  "tone","tongue","tonight","too","took","tool","top","topic",
  "torn","total","touch","toward","tower","town","toy","trace",
  "track","trade","traffic","trail","train","transportation","trap","travel",
  "treated","tree","triangle","tribe","trick","tried","trip","troops",
  "tropical","trouble","truck","trunk","truth","try","tube","tune",
  "turn","twelve","twenty","twice","two","type","typical","uncle",
  "under","underline","understanding","unhappy","union","unit","universe","unknown",
  "unless","until","unusual","up","upon","upper","upward","us",
  "use","useful","using","usual","usually","valley","valuable","value",
  "vapor","variety","various","vast","vegetable","verb","vertical","very",
  "vessels","victory","view","village","visit","visitor","voice","volume",
  "vote","vowel","voyage","wagon","wait","walk","wall","want",
  "war","warm","warn","was","wash","waste","watch","water",
  "wave","way","we","weak","wealth","wear","weather","week",
  "weigh","weight","welcome","well","went","were","west","western",
  "wet","whale","what","whatever","wheat","wheel","when","whenever",
  "where","wherever","whether","which","while","whispered","whistle","white",
  "who","whole","whom","whose","why","wide","widely","wife",
  "wild","will","willing","win","wind","window","wing","winter",
  "wire","wise","wish","with","within","without","wolf","women",
  "won","wonder","wonderful","wood","wooden","wool","word","wore",
  "work","worker","world","worried","worry","worse","worth","would",
  "wrapped","write","writer","writing","written","wrong","wrote","yard",
  "year","yellow","yes","yesterday","yet","you","young","younger",
  "your","yourself","youth","zero","zoo"
];

function words(options) {
  function word() {
    return wordList[randInt(wordList.length)];
  }

  function randInt(lessThan) {
    return Math.floor(Math.random() * lessThan);
  }

  // No arguments = generate one word
  if (typeof(options) === 'undefined') {
    return word();
  }

  // Just a number = return that many words
  if (typeof(options) === 'number') {
    options = { exactly: options };
  }

  // options supported: exactly, min, max, join

  if (options.exactly) {
    options.min = options.exactly;
    options.max = options.exactly;
  }
  var total = options.min + randInt(options.max + 1 - options.min);
  var results = [];
  for (var i = 0; (i < total); i++) {
    results.push(word());
  }
  if (options.join) {
    results = results.join(options.join);
  }
  return results;
}
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



