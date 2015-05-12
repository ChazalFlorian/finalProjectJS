window.onload = function(){

//TODO
    //lancement du jeu
    //2 debug déplacement des pions, gestion des attaques
    //3gestion du tour (fin d'event, masquer pions ennemies)
    //4gestion 2 factions
    //5design + joli

    //set menu functions

    $(".item-menu.home").click(function(){
        $(".default").css( "display", "block");
        $(".central .rules").css( "display", "none");
        $(".central .contact").css( "display", "none");
        $(".wrapper").css( "display", "none");
    });
    $(".item-menu.rules").click(function(){
        $(".default").css( "display", "none");
        $(".central .rules").css( "display", "block");
        $(".central .contact").css( "display", "none");
        $(".wrapper").css( "display", "none");
    });
    $(".item-menu.contact").click(function(){
        $(".default").css( "display", "none");
        $(".central .rules").css( "display", "none");
        $(".central .contact").css( "display", "block");
        $(".wrapper").css( "display", "none");
    });
    $(".item-menu.game").click(function(){
        $(".default").css( "display", "none");
        $(".central .rules").css( "display", "none");
        $(".central .contact").css( "display", "none");
        $(".wrapper").css( "display", "block");
    });


    //check real-time if form'passwords matches
    $("input[name='passwordCheck']").focusout(function(){
        console.log($(this).val());
        console.log($("input[name='password']").val());
        if($(this).val() != $("input[name='password']").val()){

            $("#Warning").css("visibility", "visible");
            $("#Warning").text("Les mots de passes ne correspondent pas.");
        }else{
            $("#Warning").css("visibility", "hidden");
        }
    });

    //check contact form datas

    function checkForm(){
        var form = document.forms['form'],
            checkRadio = false,
            retour = true,
            errorMsg = "";
        //check nickname length
        if (form.elements['nickname'].value.length > 4) {

        }else{
            retour = false;
            errorMsg += "Nickname trop court! 4 caractères min.<br>";
        }

        if (form.elements['password'].value.length > 6) {

        }else{
            retour = false;
            errorMsg += "Password trop court! 6 caractères min.<br>";
        }

        if (form.elements['password'].value === form.elements['password_check'].value) {

        }else{
            retour = false;
            errorMsg += "Les Password ne matchent pas<br>";
        }

        if (form.elements['age'].value.length !== 0 && isNaN(form.elements['age'].value) === false) {

        }else{
            retour = false;
            errorMsg += "L'age rentrée n'est pas valide<br>";
        }

        for (var i = 4; i < 8; i++) {
            if (form.elements[i].checked == true) {
                checkRadio = true;
            }
        }

        if (checkRadio == false) {
            retour = false;
            errorMsg += "Aucune ville cochée!<br>";
        }

        // traitement renvoi
        if (errorMsg.length > 0) {
            document.getElementById('Warning').style.visibility= 'visible';
            document.getElementById('Warning').innerHTML = errorMsg;
        }

        return retour;
    }

    //display units infos on hover
    $(".show-unit td img").hover(function(){
        $(this).tooltip({ items: 'img[alt]', content:function(){ return $(this).attr('alt'); }})
    });

    //global game's variable
    var turn = 1;
    var currentPlayer = 1;
    var units = {
        "unit": [
            {
                "name":"spy",
                "value":"1"
            },
            {
                "name":"flag",
                "value":"0"
            },
            {
                "name":"scout",
                "value":"2"
            },
            {
                "name": "deminer",
                "value":"3"
            },
            {
                "name": "sergeant",
                "value":"4"
            },
            {
                "name": "lieutenant",
                "value":"5"
            },
            {
                "name": "captain",
                "value":"6"
            },
            {
                "name": "commander",
                "value":"7"
            },
            {
                "name": "colonel",
                "value":"8"
            },
            {
                "name": "general",
                "value":"9"
            },
            {
                "name": "marshall",
                "value":"10"
            },
            {
                "name": "bomb",
                "value":"11"
            }
        ]
    };

    createBoard();
    //initializing units
    initUnit(8, "scout");
    initUnit(6, "bomb");
    initUnit(5, "deminer");
    initUnit(4, "sergeant");
    initUnit(4, "lieutenant");
    initUnit(4, "captain");
    initUnit(3, "commander");
    initUnit(2, "colonel");
    initUnit(1, "general");
    initUnit(1, "marshall");
    initUnit(1, "spy");
    initUnit(1, "flag");

    //initialization Dragging
    $(".unit").draggable({
        snap: ".pos",
        revert : function(event, ui) {
            //Si l'element est draggé en zone non autorisé, retour emplacement d'origine
            //$(this).data("ui-draggable").is(":empty");
            $(this).data("ui-draggable").originalPosition = {
                top : 0,
                left : 0
            };
            return !event;
        }
    });

    //Limitation Zone Drop
    function setDropZone(div, posX){
        if(posX >= 6 && posX <= 9){
            $(div).droppable({
                accept: '.unit.P1',
                drop: function(event, ui) {
                    //event on drop
                    if($(this).is(":empty")){
                        $(ui.draggable).removeClass("margin");
                        $(ui.draggable).addClass("no-margin");
                        $(this).append(ui.draggable);
                        //reset placement
                        $(ui.draggable).css("top", 0);
                        $(ui.draggable).css("left", 0);
                    }else{
                        $(ui.draggable).draggable({
                           revert: true
                        });
                    }
                }
            });
        }else if(posX >= 0 && posX <= 3){
            $(div).droppable({
                accept: '.unit.P2',
                drop: function(event, ui) {
                    //event on drop
                    if($(this).is(":empty")){
                        $(ui.draggable).removeClass("margin");
                        $(ui.draggable).addClass("no-margin");
                        $(this).append(ui.draggable);
                        //reset placement
                        $(ui.draggable).css("top", 0);
                        $(ui.draggable).css("left", 0);
                    }else{
                        $(ui.draggable).draggable({
                            revert: true
                        });
                    }
                }
            });
        }
    }

    // création du plateau
    function createBoard(){
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                var div = document.createElement("div");
                if ((x % 2) === 0) {
                    if ((y % 2) === 0) {
                        div.className = "pos x"+x+" y"+y;
                    }else{
                        div.className = "pos x"+x+" y"+y;
                    }
                } else {
                    if ((y % 2) === 0) {
                        div.className = "pos x"+x+" y"+y;
                    }else{
                        div.className = "pos x"+x+" y"+y;
                    }
                }
                $(".board").append(div);
                setDropZone(div, x);
            }
        }
    }

    //géneration des pions
    function initUnit(nb, name){
        for(j = 1; j<= 2; j++){
            for(i = 0;i < nb; i++){
                //création des div// attribution nom de classe
                var mainDiv = document.createElement("div");
                mainDiv.className = "unit P" + j + " " + name + " " + i + " margin";
                $(".unitsDisplay"+j).append(mainDiv);
                //création des bgdiv//attribution nom de classe
                var bgDiv = document.createElement("div");
                bgDiv.className = "unitbg " + name + " " + i;
                $(mainDiv).append(bgDiv);
            }
        }

    }

    //button will only work on 2 first rounds
    $(".change-turn").click(function(){

        if(turn == 1 && currentPlayer == 1){
            if($(".unitsDisplay1").is(':empty')){
                //startGame();

                changeTurn();
            }else{
                alert("Il vous reste des unités à placer");
            }
        }else if(turn == 2 && currentPlayer == 2){
            if($(".unitsDisplay2").is(':empty')){
                startGame();
                changeTurn();
                $(".change-turn").css("display", "none");
            }else{
                alert("Il vous reste des unités à placer");
            }
        }else {
            changeTurn();
        }

    });

    function changeTurn(){
        if(currentPlayer == 1){
            currentPlayer = 2;
            //hide opponent units
            $(".unit.P1 .unitbg").css("visibility", "hidden");
            $(".unit.P2 .unitbg").css("visibility", "visible");
            //forbid P1 to move P2's units
            $(".unit.P1").draggable("disable");
            $(".unit.P2").draggable("enable");
            $(".turn").empty();
            $(".turn").text("tour du joueur 2");
        }else{
            currentPlayer = 1;
            //hide opponent units
            $(".unit.P2 .unitbg").css("visibility", "hidden");
            $(".unit.P1 .unitbg").css("visibility", "visible");
            ////forbid P2 to move P1's units
            $(".unit.P2").draggable("disable");
            $(".unit.P1").draggable("enable");
            $(".turn").empty();
            $(".turn").text("tour du joueur 1");
        }
        turn += 1;
    }

    function getUnitValueByName(mName) {
        var test;
        $.each(units.unit, function(i, v) {
            if (v.name == mName) {
                test = v.value;
            }
        });
        return test;
    }

    function startGame(){
        //set all cases to act as droppable
        $(".pos").droppable({
            accept: '.unit',
            drop: function(event, ui) {
                if($(this).is(":empty")){
                    $(this).append(ui.draggable);
                    //reset placement
                    $(ui.draggable).css("top", 0);
                    $(ui.draggable).css("left", 0);
                }else{
                    $(ui.draggable).draggable({
                        revert: true
                    });
                }
                changeTurn();
            }
        });
        //reset drag parameter
        $(".unit").draggable({cancel: true});
        $(".pos").droppable({disabled: true});
        //get unit position
        $(".unitbg").click(function () {
            var selectedX = $(this).parent().parent().attr('class').substr(4, 2);
            var selectedY = $(this).parent().parent().attr('class').substr(7, 2);
            var unitName = $(this).parent().attr('class');
            console.log(selectedX);
            console.log(selectedY);
            console.log(unitName);
            setMoveByUnit(unitName, selectedX, selectedY);
        })
    }

    function setMoveByUnit(unit, X, Y){
        //these var are used to set unit's possible movement
        var minusX = X.substr(0, 1) + ( (X.substr(1, 1)) - 1).toString();
        var plusX = X.substr(0, 1) + ( parseInt(X.substr(1, 1)) + 1).toString();
        var minusY = Y.substr(0, 1) + ( (Y.substr(1, 1)) - 1).toString();
        var plusY = Y.substr(0, 1) + ( parseInt(Y.substr(1, 1)) + 1).toString();
        //if statements checks if there is a unit on adjacent cases
        //if so, if it's an ennemy unit, do the meet/fight action on move
        //if flag or bomb, the unit cannot move
        if(unit.split(" ")[2] != "bomb" && unit.split(" ")[2] != "flag"){
            if($(".pos."+minusX+"."+Y).children().length == 0){
                $(".pos."+minusX+"."+Y).droppable({
                    disabled: false
                });
            }else if($(".pos."+minusX+"."+Y).children().attr("class").substr(6, 1) != currentPlayer){
                $(".pos."+minusX+"."+Y).droppable({
                    disabled: false,
                    drop: function (event, ui){
                        meetUnit($(ui.draggable), $(this).children());
                        $(ui.draggable).draggable({
                            revert: true
                        });
                        changeTurn();
                    }
                });
            }

            if($(".pos."+plusX+"."+Y).children().length == 0){
                $(".pos."+plusX+"."+Y).droppable({
                    disabled: false
                });
            }else if($(".pos."+plusX+"."+Y).children().attr("class").substr(6, 1) != currentPlayer){
                $(".pos."+plusX+"."+Y).droppable({
                    disabled: false,
                    drop: function (event, ui){
                        meetUnit($(ui.draggable), $(this).children());
                        $(ui.draggable).draggable({
                            revert: true
                        });
                        changeTurn();
                    }
                });
            }

            if($(".pos."+X+"."+minusY).children().length == 0){
                $(".pos."+X+"."+minusY).droppable({
                    disabled: false
                });
            }else if($(".pos."+X+"."+minusY).children().attr("class").substr(6, 1) != currentPlayer){
                $(".pos."+X+"."+minusY).droppable({
                    disabled: false,
                    drop: function (event, ui){
                        meetUnit($(ui.draggable), $(this).children());
                        $(ui.draggable).draggable({
                            revert: true
                        });
                        changeTurn();
                    }
                });
            }

            if($(".pos."+X+"."+plusY).children().length == 0){
                $(".pos."+X+"."+plusY).droppable({
                    disabled: false
                });
            }else if($(".pos."+X+"."+plusY).children().attr("class").substr(6, 1) != currentPlayer){
                $(".pos."+X+"."+plusY).droppable({
                    disabled: false,
                    drop: function (event, ui){
                        meetUnit($(ui.draggable), $(this).children());
                        $(ui.draggable).draggable({
                            revert: true
                        });
                        changeTurn();
                    }
                });
            }
        }
        //configuring non walkable terrain
        $(".pos.x4.y2").droppable("disable");
        $(".pos.x4.y3").droppable("disable");
        $(".pos.x5.y2").droppable("disable");
        $(".pos.x5.y3").droppable("disable");
        $(".pos.x4.y6").droppable("disable");
        $(".pos.x4.y7").droppable("disable");
        $(".pos.x5.y6").droppable("disable");
        $(".pos.x5.y7").droppable("disable");
    }

    function meetUnit(name1, name2){
        //get name of unit
        var nameName1 = name1.attr("class").split(" ")[2];
        var nameName2 = name2.attr("class").split(" ")[2];
        //get value of unit
        var value1 = getUnitValueByName(nameName1);
        var value2 = getUnitValueByName(nameName2);
        //compare
        //if flag is being attacked, end the Game
        if(value2 == 0){
            endGame();
            //spy always kill marshall if he initiate attack
        }else if(value1 == 1 && value2 == 11){
            destroyUnit(name2);
        //bomb kills everyone except deminer
        }else if(value2 == 12 && value1 == 3){
            destroyUnit(name2);
            //an unit kills everyone under his value
        }else if(value1 > value2){
            destroyUnit(name2);
            //same value: both gets killed
        }else if(value1 == value2){
            destroyUnit(name1);
            destroyUnit(name2);
        }else if(value1 < value2){
            destroyUnit(name1);
        }
    }

    function destroyUnit(unitClass){
        sleep(2000);
        $(unitClass).remove();
    }

    function endGame(){
        alert("Le joueur "+ currentPlayer + "a gagné");
        $('.unit').css("visibility", "visible");
        $('.unit').draggable('disable');
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
};