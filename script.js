window.onload = function(){

//TODO
    //3déplacement des pions, gestion des attaques
    //4gestion du tour (fin d'event, retournenement du board)
    //5gestion 2 factions
    //6 choix VS ou solo
    //création IA LOL
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
                    $(ui.draggable).removeClass("margin");
                    $(ui.draggable).addClass("no-margin");
                    $(this).append(ui.draggable);
                    //reset placement
                    $(ui.draggable).css("top", 0);
                    $(ui.draggable).css("left", 0);
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
            $(".unitsDisplay").append(mainDiv);
            //création des bgdiv//attribution nom de classe
            var bgDiv = document.createElement("div");
            bgDiv.className = "unitbg " + name + " " + i;
            $(mainDiv).append(bgDiv);
        }
    }
}