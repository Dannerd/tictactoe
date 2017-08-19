/**
 * Created by Daniel on 10/05/2017.
 */



/**
 * Created by Dan on 5/05/2017.
 */


function TicTacToe(id, size) {


    this.board = [];
    this.turn = 0;
    this.botstyle = "quickest";
    this.botdelay = 1;
    this.gamedelay = 1000;
    this.pieces = [];
    this.pieces["blank"] = "&nbsp;";
    this.pieces[0] = "X";
    this.pieces[1] = "O";
    this.game = [];
    this.size = size;

    this.winhistory = JSON.parse(localStorage.getItem("win-history_"+this.size)) || [];
    this.currentpath = 0;
    this.dom = document.getElementById(id);
    this.dom.style.width = 100 * this.size + "px";

    this.setHistory = function(winner){
        this.winhistory.push(this.turntrack[winner]);
        localStorage.setItem("win-history_"+this.size, JSON.stringify(this.winhistory));
    };


    this.clear = function () {
        this.board = [];
        this.turntrack = {0:[], 1:[]};
        this.currentpath = 0;
        this.bindClick();
        for (var aa = 0; aa < (this.size * this.size); aa++) {
            this.board.push(-1);
        }

        this.turn = 0;
        return this.render();
    };
    this.render = function () {
        var b = this;
        var dom = this.dom;
        var winner = this.checkForWin();
        if (winner) {
            this.dom.onclick = undefined;

            this.setHistory(winner.winner);

            dom.innerHTML = "<span style='color:lime;'>Player " + (winner.winner + 1) + " wins!</span><br />";
        } else {
            dom.innerHTML = "Player " + (this.turn + 1) + "'s turn.<br />";
        }

        for (var i = 0; i < this.board.length; i++) {
            var pos = this.getPos(i);
            if (i % this.size === 0 && i !== 0) {
                dom.innerHTML += "<br />";
            }
            var val = this.board[i];
            if (val < 0) {
                val = this.pieces["blank"];
            } else {
                val = this.pieces[val];
            }
            var winnerClass = '';
            if (winner && winner.positions.indexOf(i) >= 0) {
                winnerClass = ' winner';
            }
            var cellEl = document.createElement("a");
            cellEl.innerHTML = val;


            cellEl.style.width = 'calc(100% / ' + this.size + ')';
            cellEl.style.height = 'calc((100% / ' + this.size + ') - 20px)';
            cellEl.className = "cell" + winnerClass;
            cellEl.setAttribute("data-x", pos.x);
            cellEl.setAttribute("data-y", pos.y);
            var uniqueId = btoa(i + "-" + id);
            cellEl.id = uniqueId;
            dom.appendChild(cellEl);
        }


        if (winner) {
            setTimeout(function () {
                b.clear()
            }, this.gamedelay);
        }


        if(this.getBlanks().length < 1){
            setTimeout(function()  {
                b.clear();
            }, this.gamedelay);
        }


        return this;
    };
    this.getBlanks = function () {
        var blanks = [];

        for (var i = 0; i < this.board.length; i++) {
            var space = this.board[i];
            if (space < 0) {
                blanks.push(i);
            }
        }


        return blanks;
    };
    this.randomPos = function () {
        var blanks = this.getBlanks();
        var rand = blanks[Math.floor(Math.random() * blanks.length)];


        return rand;
    };
    this.bindClick = function () {
        var p = this;
        this.dom.onclick = function (e) {
            var x = parseInt(e.target.getAttribute("data-x"));
            var y = parseInt(e.target.getAttribute("data-y"));
            p.play(x, y);
        };
    };
    this.start = function () {
        this.turn = 0;
        this.turntrack = {0:[], 1:[]};
        this.clear();
        this.render();
        this.bindClick();
    };
    this.getRows = function () {
        var rows = [];

        for (var y = 0; y < this.size; y++) {
            var row = [];
            for (var x = 0; x < this.size; x++) {
                row.push(this.getIndex(x, y));
            }

            rows.push(row);
        }

        return rows;

    };
    this.getCols = function () {
        var cols = [];

        for (var x = 0; x < this.size; x++) {
            var col = [];
            for (var y = 0; y < this.size; y++) {
                col.push(this.getIndex(x, y));
            }

            cols.push(col);
        }

        return cols;
    };
    this.getDiags = function () {
        var diagLeft = [];
        var diagRight = [];

        for (var xy = 0; xy < this.size; xy++) {
            diagLeft.push(this.getIndex(xy, xy));
        }

        for (var xy = 0; xy < this.size; xy++) {
            diagRight.push(this.getIndex((this.size - xy - 1), xy));
        }


        var diags = [diagLeft, diagRight];

        return diags;
    };
    this.allEqual = function (array) {
        return !array.some(function (value, index, array) {
            return value !== array[0];
        });
    };
    this.getCombos = function () {
        return [this.getRows(), this.getCols(), this.getDiags()];
    };
    this.checkForWin = function () {
        var poss = this.getCombos();

        var board = this.board;
        var winner = false;


        for (var i = 0; i < poss.length; i++) {
            var posList = poss[i];


            for (var j = 0; j < posList.length; j++) {
                var checkPos = posList[j];
                var checkList = [];


                for (var k = 0; k < checkPos.length; k++) {
                    var checkState = board[checkPos[k]];
                    checkList.push(checkState);
                }


                if (this.allEqual(checkList) && checkList[0] > -1) {
                    return {winner: checkList[0], positions: checkPos};
                }

            }

        }

        return winner;
    };
    this.getPos = function (i) {
        return {x: i % this.size, y: Math.floor(i / this.size)};
    };
    this.getIndex = function (x, y) {
        return x + this.size * y;
    };

    this.getQuickestPath = function(){
        var history = this.winhistory;
        var lowestHistory = 100;
        var quickest = [];


        for(var i = 0; i < history.length; i++){
            var path = history[i];

            if(path.length < lowestHistory){
                lowestHistory =  path.length;
            }
        }




        for(var j = 0; j < history.length; j++){
            var path2 = history[j];
            if(path2.length===lowestHistory){
                quickest.push(j);
            }

        }
        var quickestIndex = quickest[Math.floor(Math.random() * quickest.length)];

        return  history[quickestIndex];
    };


    this.getPlay = function (type) {
        switch (type) {
            case "random":
                return this.randomPos();
                break;
            case "quickest":
                var turnTrack = t.turntrack[1] || [];
                var turnIndex = turnTrack.length;
                if(turnIndex===0 || turnIndex > this.currentpath.length) {
                    this.currentpath = this.getQuickestPath() || [];
                }

                var returnPath = false;
                if(this.currentpath){
                    returnPath = this.currentpath[turnIndex];
                } else{
                    returnPath = this.randomPos();
                }


                if(this.board[returnPath]){
                    return returnPath;
                } else{
                    return this.randomPos();
                }

                break;
            default:
                return this.randomPos();
        }
    };
    this.botsTurn = function () {
        var p = this;

        if(!p.checkForWin()) {
            var pos = this.getPos(this.getPlay(this.botstyle));


            setTimeout(function () {
                p.play(pos.x, pos.y);
            }, this.botdelay);
        }

        return p;
    };
    this.updateTurn = function () {

        var p = this;

        if (this.turn === 0) {
            this.botsTurn();
            this.turn = 1;
        }
        else {
            this.turn = 0;
        }
    };
    this.fitnessScore = function (player) {
        var poss = this.getCombos();

        var board = this.board;
        var score = false;


        for (var i = 0; i < poss.length; i++) {
            var posList = poss[i];


            for (var j = 0; j < posList.length; j++) {
                var checkPos = posList[j];
                var checkList = [];


                for (var k = 0; k < checkPos.length; k++) {
                    var checkState = board[checkPos[k]];
                    //checkList.push(checkState);
                    console.log(checkState);

                }

            }

        }

        return score;
    };


    this.turntrack = {0:[], 1:[]};


    this.play = function (x, y) {
        var i = this.getIndex(x, y);
        var val = this.board[i];

        if (val < 0) {
            //Blank - can go here
            this.board[i] = this.turn;
            this.turntrack[this.turn].push(i);
            this.updateTurn();

        } else {
            //Taken - can't go here

        }





        this.render();
    };


    this.start();


}
