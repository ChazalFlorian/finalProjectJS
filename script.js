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
    })

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
            };
        };

        if (checkRadio == false) {
            retour = false;
            errorMsg += "Aucune ville cochée!<br>";
        }

        // traitement renvoi
        if (errorMsg.length > 0) {
            document.getElementById('Warning').style.visibility= 'visible';
            document.getElementById('Warning').innerHTML = errorMsg;
        };

        return retour;
    }

    //display units infos on hover
    $(".show-unit td img").hover(function(){
        $(this).tooltip({ items: 'img[alt]', content:function(){ return $(this).attr('alt'); }})
    })


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
                "name": "scout",
                "value":"9"
            },
            {
                "name": "general",
                "value":"10"
            },
            {
                "name": "marshall",
                "value":"11"
            },
            {
                "name": "bomb",
                "value":"12"
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
                accept: '.unit',
                drop: function(event, ui) {
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
                        div.className = "pos "+x+" "+y+" pair";
                    }else{
                        div.className = "pos "+x+" "+y+" impair";
                    }
                } else {
                    if ((y % 2) === 0) {
                        div.className = "pos "+x+" "+y+" impair";
                    }else{
                        div.className = "pos "+x+" "+y+" pair";
                    }
                }
                $(".board").append(div);
                setDropZone(div, x);
            }
        }
    }

    //géneration des pions
    function initUnit(nb, name){
        for(i = 0;i < nb; i++){
            //création des div// attribution nom de classe
            var mainDiv = document.createElement("div");
            mainDiv.className = "unit " + name + " " + i + " margin";
            $(".unitsDisplay1").append(mainDiv);
            //création des bgdiv//attribution nom de classe
            var bgDiv = document.createElement("div");
            bgDiv.className = "unitbg " + name + " " + i;
            $(mainDiv).append(bgDiv);
        }
    }

    $(".end-drag").click(function(){
        startGame();
        if($(".unitsDisplay1").is(':empty')){
            //startGame();
        }else{
            alert("You still have units to place");
        }
    });

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
        //reset drag parameter
        $(".unit").draggable({cancel: true});
        $(".pos").droppable({disabled: true});
        //get unit position
        $(".unitbg").click(function () {
            var selectedX = $(this).parent().parent().attr('class').substr(4, 1);
            var selectedY = $(this).parent().parent().attr('class').substr(6, 1);
            var unitName = $(this).parent().attr('class');
            var Vname1 = unitName.split(" ")[1];
            var test = getUnitValueByName(Vname1);
            console.log(test);
            setMoveByUnit(unitName, selectedX, selectedY);
        })
    }


    //everything up has been debugged
    function setMoveByUnit(unit, X, Y){
        X = parseInt(X);
        Y = parseInt(Y);
        console.log(X);
        console.log(Y);
        console.log(unit);
        console.log("here stop init values");
        var divname1 = ".pos."+(X - 1).toString()+"."+(Y).toString();
        var divname2 = ".pos."+(X + 1).toString()+"."+(Y).toString();
        var divname3 = ".pos."+(X).toString()+"."+(Y - 1).toString();
        var divname4 = ".pos."+(X).toString()+"."+(Y + 1).toString();
        console.log(divname1);
        //Somehow, the X and Y values are inverted
        var minusX = (X - 1).toString();
        var plusX = (X + 1).toString();
        var minusY = (Y - 1).toString();
        var plusY = (Y + 1).toString();
        console.log($(divname1).attr("class"));
        console.log($(divname2).attr("class"));
        console.log($(divname3).attr("class"));
        console.log($(divname4).attr("class"));
        $(".pos."+minusX+"."+(Y)).droppable({
            accept: unit,
            drop: function(event, ui) {
                if($(this).is(":empty")){
                    $(this).append(ui.draggable);
                    //reset placement
                    $(ui.draggable).css("top", 0);
                    $(ui.draggable).css("left", 0);
                }else{
                    meetUnit(unit, $(this).child().first().attr("class"));
                }
            }
        });
        $(".pos."+plusX+"."+(Y)).droppable({
            accept: unit,
            drop: function(event, ui) {
                if($(this).is(":empty")){
                    $(this).append(ui.draggable);
                    //reset placement
                    $(ui.draggable).css("top", 0);
                    $(ui.draggable).css("left", 0);
                }else{
                    meetUnit(unit, $(this).child().first().attr("class"));
                }
            }
        })
        $(".pos."+(X)+"."+minusY).droppable({
            accept: unit,
            drop: function(event, ui) {
                if($(this).is(":empty")){
                    $(this).append(ui.draggable);
                    //reset placement
                    $(ui.draggable).css("top", 0);
                    $(ui.draggable).css("left", 0);
                }else{
                    meetUnit(unit, $(this).child().first().attr("class"));
                }
            }
        })
        $(".pos."+(X)+"."+plusY).droppable({
            accept: unit,
            drop: function(event, ui) {
                if($(this).is(":empty")){
                    $(this).append(ui.draggable);
                    //reset placement
                    $(ui.draggable).css("top", 0);
                    $(ui.draggable).css("left", 0);
                }else{
                    meetUnit(unit, $(this).child().first().attr("class"));
                }
            }
        })
    }

    function meetUnit(name1, name2){
        //get name of unit
        var name1 = name1.split(" ")[1];
        var name2 = name2.split(" ")[1];
        console.log(name1);
        console.log(name2);
        //get value of unit
        var value1 = getUnitValueByName(name1);
        var value2 = getUnitValueByName(name2);
        //compare
        //spy always kill marshall if he initiate attack
        if(value1 == 1 && value2 == 11){
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

    }

    function endGame(){

    }
};