$(document).ready(createObj);

var gameObj;
var col_list = ["A","B", "C", "D", "E", "F", "G" ,"H"];
var array_list = [[],[],[],[],[],[],[],[]];

function createObj(){
    generateSpots();
    gameObj = new Game();
    gameObj.init();
}
function generateSpots(){
    for (var i = 1; i < 9; i++) { //loop to create rows for board
        $("<div>").attr("id","row"+i).addClass("rows").appendTo("#back-board");
    }
    for(var k = 0; k < 8; k++){
        for(var j=0; j<8; j++){ //loop to create columns for board
            var tempDiv = $("<div>").attr("col",col_list[j]).attr("row",k).appendTo("#row"+(k+1));
            array_list[k].push(tempDiv);
        }
    }
}
function Game() {
    //player 1 is black
    //player 2 is white
    var self = this;
    this.player1 = [];
    this.player2 = [];
    this.player_list = ["player 1", "player 2"];
    this.turn = null;
    this.legal_moves_array = [];     //this is for legal moves

    //functions down here

    var goodImg = $("#jedi-on");
    var badImg = $("#sith-on");

    this.init = function () {
        //start with player 1 (sith) ready
        $(badImg).removeClass("hiddenClass");
        console.log("jedi hide");
        $(goodImg).addClass("hiddenClass");
        console.log("sith's turn");
        //positions 4,5 give them black/white discs

        this.player2.push(array_list[3][3].addClass('white-disc'));
        this.player1.push(array_list[3][4].addClass('black-disc'));
        this.player1.push(array_list[4][3].addClass('black-disc'));
        this.player2.push(array_list[4][4].addClass('white-disc'));
        this.turn = this.player_list[0];
        this.legalMoves(0);
        this.displayDiscs();
        this.symbolAppear();
        $(".rows > div").click(self.clickHandler);
        $(".reset").click(self.resetAll)
    };

    this.legalMoves = function (index) {    //legal moves function
        var colNum;
        var rowNum;
        for(var i = 0; i < this.legal_moves_array.length; i++){    //goes through list of legal moves and removes class
            this.legal_moves_array[i].removeClass("allowedSpot");  //needs to clean out the array so next moves can be made
        }
        this.legal_moves_array = [];  //resets the array
        //for player 1 - black moves
        if (index === 0) {
            for (i = 0; i < this.player2.length; i++) {    //loops through 8 spots around div for possible moves
                colNum = col_list.indexOf(this.player2[i].attr("col"));
                rowNum = parseInt(this.player2[i].attr("row"));
                for (var j = -1; j < 2; j++) {    // for rows
                    for (var k = -1; k < 2; k++) {    //for columns
                        if((rowNum + j) < 0 || (rowNum + j) > 7 || (colNum + k) < 0 || (colNum + k) > 7){
                            continue;
                        }
                        var selectDiv = array_list[rowNum + j][colNum + k];
                        if (selectDiv.hasClass("white-disc") || selectDiv.hasClass("black-disc")) {
                            continue;
                        }
                        else {
                            this.searchSpots(selectDiv, "white-disc", "black-disc");
                        }
                    }
                }
            }
        }
        else { //for player 2 - white moves
            for (var i = 0; i < this.player1.length; i++) {
                colNum = col_list.indexOf(this.player1[i].attr("col"));
                rowNum = parseInt(this.player1[i].attr("row"));
                for (var j = -1; j < 2; j++) {    // for rows
                    for (var k = -1; k < 2; k++) {    //for columns
                        if((rowNum + j) < 0 || (rowNum + j) > 7 || (colNum + k) < 0 || (colNum + k) > 7 ){
                            continue;
                        }
                        var selectDiv = array_list[rowNum + j][colNum + k];
                        if (selectDiv.hasClass("white-disc") || selectDiv.hasClass("black-disc")) {
                            continue;
                        }
                        else {
                            this.searchSpots(selectDiv, "black-disc", "white-disc");
                        }
                    }
                }
            }
        }
        for(var i = 0; i < self.legal_moves_array.length; i++){
            self.legal_moves_array[i].addClass("allowedSpot");
        }
        if(self.legal_moves_array.length === 0 && (self.player1.length + self.player2.length < 64)){
            if(self.turn === self.player_list[1]){
                self.turn = self.player_list[0];
                self.legalMoves(0);
            }
            else{
                self.turn = self.player_list[1];
                self.legalMoves(1);
            }
        }
    };

    this.searchSpots = function (selectDiv, disc_color, this_color) {   //searchSpots function
        var r = parseInt(selectDiv.attr("row"));  //string that needs to be converted to number
        var c = col_list.indexOf(selectDiv.attr("col"));
        var diag = [[0,1], [0,-1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]];  //8 possible spots; stays the same
        var temp_diag_directions = [[0,1], [0,-1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]];  //array changes to keep going until place is found
        for(var i = 0; i < diag.length; i++){
            var diag_x = diag[i][0];
            var diag_y = diag[i][1];
            var diag_yr = diag[i][1] + r;
            var diag_xc = diag[i][0] + c;
            if(diag_yr >= 0 && diag_yr < 8 && diag_xc >= 0 && diag_xc < 8){
                var check = array_list[diag[i][1] + r] [diag[i][0] + c];
                if(typeof check !== undefined && check.hasClass(disc_color)){
                    temp_diag_directions = [[0,1], [0,-1],[-1,0],[1,0],[-1,-1],[1,-1],[-1,1],[1,1]];
                    //found adjacent opposite color
                    while(check.hasClass(disc_color)){
                        temp_diag_directions[i][0] += diag_x;
                        temp_diag_directions[i][1] += diag_y;
                        var tempr = r + temp_diag_directions[i][1];
                        var tempc = c + temp_diag_directions[i][0];
                        if(tempr < 0 || tempr > 7 || tempc < 0 || tempc > 7){
                            break;
                        }
                        check = array_list[r + temp_diag_directions[i][1]] [c + temp_diag_directions[i][0]];
                        if(check.hasClass(this_color)){
                            this.legal_moves_array.push(selectDiv);
                            break;
                        }
                    }
                }
            }
        }
    };

    this.clickHandler = function () {    //click handler function for div on dom and not objects
        var bool = false;
        var x = $(this).attr("col");
        var y = parseInt($(this).attr("row"));   //when try to pull row, we got string, so we want to convert to number
        var indexofcol = col_list.indexOf(x);
        for (var i = 0; i < self.legal_moves_array.length; i++) {
            if (self.legal_moves_array[i].attr("row") == y && self.legal_moves_array[i].attr("col") == x) {
                bool = true;
            }
        }
        if (bool) {  //
            //click is working
            if (self.turn == self.player_list[0]) { // player 1's turn
                $(this).addClass("black-disc");
                self.player1.push($(this));
                self.flip($(this), "black-disc", "white-disc",indexofcol, y);
                self.turn = self.player_list[1];
                self.legalMoves(1);
            }
            else {
                $(this).addClass("white-disc");  //player 2's turn
                self.flip($(this), "white-disc", "black-disc",indexofcol, y);
                self.player2.push($(this));
                self.turn = self.player_list[0];
                self.legalMoves(0);
            }
            $(this).off("click");
        }
        self.symbolAppear();
        self.displayDiscs();
        if((self.player1.length + self.player2.length) === 64){
            self.gameOver();
        }
    };

    this.flip = function (inputDiv, color, color_to_replace,x, y) {     //flip function
        var directions = [[-1,-1], [0,-1],[1,-1], [-1,0],[1,0], [-1,1],[0,1], [1,1]];
        var temp_directions = [[-1,-1], [0,-1],[1,-1], [-1,0],[1,0], [-1,1],[0,1], [1,1]];
        var arrayOfFlips = [];
        for(var j = 0; j < directions.length; j++){
            var path = [];
            var d0 = directions[j][0];
            var d1 = directions[j][1];
            var temp_y = y + d1;
            var temp_x = x + d0;
            if(temp_y >= 0 && temp_y < 8 && temp_x >= 0 && temp_x < 8){
                var divTracker = array_list[temp_y][temp_x];
                if(divTracker.hasClass(color_to_replace)){
                    temp_directions = [[-1,-1], [0,-1],[1,-1], [-1,0],[1,0], [-1,1],[0,1], [1,1]];
                    while(divTracker.hasClass(color_to_replace)){
                        path.push(divTracker);  //being pushed because its white
                        temp_directions[j][0] += d0;
                        temp_directions[j][1] += d1;
                        if((y + temp_directions[j][1]) < 0 || (y + temp_directions[j][1]) > 7 || (x + temp_directions[j][0]) < 0 || (x + temp_directions[j][0]) > 7){
                            break;
                        }
                        divTracker = array_list[y + temp_directions[j][1]] [x + temp_directions[j][0]];
                        if(divTracker.hasClass(color)){   //if it finds a div with same color
                            arrayOfFlips = arrayOfFlips.concat(path);
                            break;
                        }
                    }
                }
            }
        }
        for (var i = 0; i < arrayOfFlips.length; i++) { //removing classes and adding
            if(color === "black-disc"){
                var indexToRemove = this.player2.indexOf(arrayOfFlips[i]);
                this.player2.splice(indexToRemove, 1);
                this.player1.push(arrayOfFlips[i]);
            }
            else{
                var indexToRemove = this.player1.indexOf(arrayOfFlips[i]);
                this.player1.splice(indexToRemove, 1);
                this.player2.push(arrayOfFlips[i]);
            }
            arrayOfFlips[i].removeClass("white-disc black-disc");
            arrayOfFlips[i].addClass(color);
        }
    };

    this.symbolAppear = function(){    //image appears under player function
        var jediImg = $("#player-imageTwo");
        var sithImg = $("#player-imageOne");
        var statsOne = $("#stats_container1");
        var statsTwo = $("#stats_container2");
        if (self.turn == self.player_list[1]){
            $(goodImg).removeClass("hiddenClass");
            $(sithImg).css("opacity", "0.7");
            $(statsTwo).css("opacity", "0.5");
            //sith step down
            $(badImg).addClass("hiddenClass");
            $(jediImg).css("opacity", "1");
            $(statsOne).css("opacity", "1");
            //jedi's turn
        } else if (self.turn == self.player_list[0]){
            $(badImg).removeClass("hiddenClass");
            $(jediImg).css("opacity", "0.7");
            $(statsOne).css("opacity", "0.5");
            //jedi step down
            $(goodImg).addClass("hiddenClass");
            $(sithImg).css("opacity", "1");
            $(statsTwo).css("opacity", "1");
            //sith's turn
        }
    };

    this.gameOver = function(){     //gameover function
        modal = $('#myModal');
        modal2 = $('#myModal2');

        if(this.player1.length > this.player2.length){
            this.turn = self.player_list[0];
            this.symbolAppear();
            $('.modal').show();
            $('.close').on("click",function(){
                $('#myModal').css("display","none");
            })
        }
        else{
            this.turn = self.player_list[1];
            this.symbolAppear();
            $('.modal2').show();
            $('.close').on("click",function(){
                $('#myModal2').css("display","none");
            })
        }
        this.resetAll();
    };

    this.displayDiscs = function(){    //display function
        $(".player1-value").html(this.player1.length);
        $(".player2-value").html(this.player2.length);
    };
    this.resetAll = function(){     //reset function
        console.log("reset is being clicked");
        self.turn = null;
        for(var i=0; i<8; i++){
            for(var j=0; j<8; j++){
                array_list[i][j].removeClass("white-disc black-disc allowedSpot");
            }
        }
        self.player1 = [];
        self.player2 = [];
        self.legal_moves_array = [];
        self.init();
    }
}