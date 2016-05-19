$(document).ready(function(){
    //default dimensions
    var rows = 20;
    var columns = 20;     
    var allAlive = false;
    var allDead = false;
    var wrapAround = true;
    var genMin = 3;
    var genMax = 3;
    var overMin = 3; // > 3 will die
    var lonelyMax = 2; //less than 2 will die
    var radius = 1;
    var possibleCells = (radius + (radius + 1));

    //if grid is resized, functions are unfortunately being repeated here..
    $("#gridsizing").on('submit', function(e){
        e.preventDefault(); //prevents submission from refreshing page
        
        //removes previous rows/columns
        $("tr").remove();
        $("td").remove();
        rows = parseInt($("#newrows").val(), 10);
        columns = parseInt($("#newcolumns").val(), 10);
        
        //tr at i = whatever, add an id attribute with value
        for (var i = 0; i < rows; i++) {
            $("#grid").append("<tr></tr>");
        }
        
        for (var i = 0; i < columns; i++) {
            $("tr").append("<td></td>");  
        }
        
        //gives each row an id attribute with a unique value (no use yet)
//        $("tr").each(function() {
//            $(this).attr('id', 'row'+($(this).index() + 1)); 
//        });
//        
//        $("td").each(function() {
//            $(this).attr('id', 'column'+($(this).index() + 1));
//        });
        
        //clicking
        $("td").on('click', function(e) {
            var colNum = $(this).index();      //retrieves column index (later use maybe)
            var $tr = $(this).closest('tr');    //retrieves the closest tr to this td (later use maybe)
            var rowNum = $tr.index();
            $(this).attr('class', 'livedb4 alivenow');

            if ($(this).attr('bgcolor') === '#29228e'){
                $(this).attr('bgcolor', '#9ba3ff');  
                $(this).attr('class', 'livedb4');   //dead but keeps class of livedb4

            }
            else {
                $(this).attr('bgcolor', '#29228e');
                $(this).attr('class', 'livedb4 alivenow');
            }
            
            //force alive
            if (e.shiftKey){
                $(this).attr('bgcolor', '#29228e');
                $(this).attr('class', 'livedb4 alivenow');
            }

            //force dead
            if (e.altKey){
                $(this).removeAttr('class');
                $(this).removeAttr('bgcolor');
            }
        });
    
    });
    
    //New Rules
    $("#interface input").on('change', function(e){
        $("#changeRules").prop('disabled', false);  
        $("#interface").on('submit', function(e){
            e.preventDefault(); 
            
            radius = parseInt($("#radiusinput").val(), 10);
            lonelyMax = parseInt($("#lonelyinput").val(), 10);
            overMin = parseInt($("#overinput").val(), 10);
            genMin = parseInt($("#gmininput").val(), 10);
            genMax = parseInt($("#gmaxinput").val(), 10);
            
            if (radius < 1) {
                radius = 1;
                $("#radiusinput").val(radius);
            } else if (radius > 10) {
                radius = 10;
                $("#radiusinput").val(radius);
            }
            
            if (lonelyMax < 0) {
                lonelyMax = 1;
                $("#lonelyinput").val(lonelyMax);
            } else if (lonelyMax > overMin) {
                lonelyMax = overMin;
                $("lonelyinput").val(lonelyMax);
            }
            
            if (overMin < lonelyMax){
                overMin = lonelyMax;
                $("#overinput").val(overMin);
            } else if (overMin >= (4*radius*radius + 4*radius)) {
                overMin = 7;
                $("#overinput").val(overMin);
            }
//            console.log("Radius = " +radius);
//            console.log("Lonely Max = " +lonelyMax);
//            console.log("Overpopulation Min = " + overMin);
//            console.log("Generation Min = " + genMin);
//            console.log("Generation Max = " +genMax);
        });
    });
    
    //Reset Rules
    $("#resetRules").on('click', function(e){    
        radius = 1;
        lonelyMax = 2;
        overMin = 3;
        genMin = 3;
        genMax = 3;
 //       radiusNormal = true;
        
        $("#radiusinput").val(radius);
        $("#lonelyinput").val(lonelyMax);
        $("#overinput").val(overMin);
        $("#gmininput").val(genMin);
        $("#gmaxinput").val(genMax);
        
//        console.log("Radius = " +radius);
//        console.log("Lonely Max = " +lonelyMax);
//        console.log("Overpopulation Min = " + overMin);
//        console.log("Generation Min = " + genMin);
//        console.log("Generation Max = " +genMax);     
    });
    
    
    //creates the rows
    for (var i = 1; i < rows; i++) {    //starts at 1 because I already have 1 row in the HTMl
        $("#grid").append("<tr></tr>");
    }
    //creates the columns
    for (var i = 0; i < columns; i++) {
        $("tr").append("<td></td>");
    }
    
    //All alive
    $('input:radio[name=outsidecells]:nth(1)').click(function(){   
        allAlive = true;
        allDead = false;
        wrapAround = false;
//        console.log("allAlive = true");
//        console.log("allDead = false");
//        console.log("wrapAround = false");
        
    });
    
    //All dead
    $('input:radio[name=outsidecells]:nth(0)').click(function(){
        wrapAround = false;
        allDead = true;
        allAlive = false;
//        console.log("allAlive = false");
//        console.log("allDead = true");
//        console.log("wrapAround = false");        
    });
    
    //Wrap Around
    $('input:radio[name=outsidecells]:nth(2)').click(function(){
        wrapAround = true;
        allAlive = false;
//        allDead = false;
//        console.log("allAlive = false");
//        console.log("allDead = false");
//        console.log("wrapAround = true");        
    });
    
    //gives each row an id attribute with a unique value (no use yet)
//    $("tr").each(function() {
//        $(this).attr('id', 'row'+($(this).index() + 1)); 
//    });
//    
//    $("td").each(function() {
//        $(this).attr('id', 'column'+($(this).index() + 1));
//    });
    //loop can access the td under the specific row later
    
    //clicking
    $("td").on('click', function(e) {
        var colNum = $(this).index();      //retrieves column index (later use maybe)
        var $tr = $(this).closest('tr');    //retrieves the closest tr to this td (later use maybe)
        var rowNum = $tr.index();
        $(this).attr('class', 'livedb4 alivenow');
        
        if ($(this).attr('bgcolor') === '#29228e'){
            $(this).attr('bgcolor', '#9ba3ff');  //color indicating it's lived before
            $(this).attr('class', 'livedb4');   //dead but keeps class of livedb4
        }
        else {
            $(this).attr('bgcolor', '#29228e');
            $(this).attr('class', 'livedb4 alivenow');
        }
        
        //force alive
        if (e.shiftKey){
            $(this).attr('bgcolor', '#29228e');
            $(this).attr('class', 'livedb4 alivenow');
        }
        
        //force dead
        if (e.altKey){
            $(this).removeAttr('class');
            $(this).removeAttr('bgcolor');
        }
    });
    
    //reset button
    $("#reset").on('click', function() {
        $("td").removeAttr('class');
        $("td").removeAttr('bgcolor');
    });
    
    //ON/OFF AUTOMATION
    var myVar;
    var speed = 0;
    
    //start automation
    $("#start").on('click', function() {
        myVar = setInterval(runAutomation, speed); 
        $("#start").prop('disabled', true); //disables the start button from being pressed again
        $("#step").prop('disabled', true);  //same for step
        $("#getSpeed").prop('disabled', true);

    });
    //stop automation      
    $("#stop").on('click', function() {
        clearInterval(myVar); 
        myVar = null;
        $("#start").prop('disabled', false);    //allows the start button to be pressed
        $("#step").prop('disabled', false);     //same for step
        $("#getSpeed").prop('disabled', false);
    });
    
    //Set speed of automation
    $("#getSpeed").on('click', function() {
        speed = document.getElementById("intervalSpeed").value;
        document.getElementById("printSpeed").innerHTML = speed +"ms" +"(" +speed/1000 +"sec)";
    });
    
    //step through automation
    $("#step").on('click', function() {
            runAutomation(); 
    });
    
    $("#random").on('click', function() {
        getRandom(); 
    });
    //generate random numbers
    function getRandom(){
        var randomNum;
        $("td").removeAttr('class');        //resets everything first
        $("td").removeAttr('bgcolor');
        $("td").each(function(index) {
            randomNum = Math.floor((Math.random() * 10) + 1);       //generates random number between 1 and 10
            if (randomNum > 6){         //make probability a little smaller than 50% so grid doesn't get too crowded
                $(this).attr('bgcolor', '#29228e');  
                $(this).attr('class', 'livedb4 alivenow');
            }
        });
        
    }
 
    
    function runAutomation() {  
        testNeighbors2();   
        //the background color is blue, set that to alive
        //CLASS is added after the color update so it doesnt affect other updates
        //EVERY NEIGHBOR IS TESTED BEFORE THE CLASS ATTRIBUTE IS UPDATED
        
        //loop through all td using loop instead (jQUERY)
        $("td").each(function(index) {
            if ($(this).attr('bgcolor') === '#29228e'){
                $(this).addClass('alivenow');     
            }
            else if ($(this).attr('bgcolor') === '#9ba3ff'){
                $(this).removeClass('alivenow');   
            }
        });  
        
        //Javascript version
//        var table = document.getElementById("grid");
//        var trLength = table.rows.length;
//        
//        for (var i = 0; i < trLength; i++) {
//            var cells = table.rows[i].getElementsByTagName('td');
//            for (var ia = 0, ib = cells.length; ia<ib; ia++) {
//                if (cells[ia].getAttribute('bgcolor') === '#29228e'){
//                    cells[ia].classList.add('alivenow'); 
//                } else if (cells[ia].getAttribute('bgcolor') === '#9ba3ff'){
//                    cells[ia].classList.remove('alivenow');   
//                }
//                
//            }
//            
//        }
    }
    
//  

    function testNeighbors2() {
        $("td").each(function() {
            var $this = $(this);
            var $tr = $this.parent();
            var colNum = $this.index();
            var rowNum = $tr.index();
            var totalNeighbors;
            var rightCounter = 0;
            var leftCounter = 0;
            var topCounter = 0;
            var bottomCounter = 0;
            var startSides = (rowNum - radius + 1);
            var finishSide = (rowNum + radius);
            var startTopBottom = (colNum - radius);      //TODO
            var finishTopBottom = (colNum + radius);         //TODO
            var outerRight = colNum + radius;
            var outerLeft = colNum - radius;
            var outerBottom = rowNum + radius;
            var outerTop = rowNum - radius;
            var rightDone = false;
            var leftDone = false;
            var topDone = false;
            var bottomDone = false;
//            var nextNeighbors = testrightNeighbors($this);
//            var prevNeighbors = testleftNeighbors($this);
//            var aboveNeighbors = testaboveNeighbors($this);
//            var belowNeighbors = testbelowNeighbors($this);
//            
//            
//            console.log("nextNeighbors = " +nextNeighbors);
//            console.log("prevNeighbors = " +prevNeighbors);
//            console.log("aboveNeighbors = " +aboveNeighbors);
//            console.log("belowNeighbors = " +belowNeighbors);
            
//            totalNeighbors = nextNeighbors + prevNeighbors + aboveNeighbors + belowNeighbors;
//            console.log("totalNeighbors = " +totalNeighbors);
            
            if (allDead == true){
                if (outerRight >= columns) {
                    rightCounter = 0;
                    rightDone = true;
                }
                if (outerLeft < 0){
                    leftCounter = 0; 
                    leftDone = true;
                }
                if (outerTop < 0) {
                    topCounter = 0;  
                    topDone = true;
                }
                if (outerBottom >= rows) {
                    bottomCounter = 0; 
                    bottomDone = true;
                }
            }
            else if (allAlive == true){
                if (outerRight >= columns) {
                    if (rowNum == 0 || rowNum == (rows - 1)){           //top right and bottom right
                        rightCounter = possibleCells - 1;   
                        rightDone = true;
                    }
                    rightCounter = possibleCells; //equation is right side will have radius + (radius - 1) cells 
                    rightDone = true;
                }    
                
                if (outerLeft < 0) {
                     if (rowNum == 0 || rowNum == (rows - 1)){
                        leftCounter = possibleCells - 1;   
                        leftDone = true;
                     }
                    leftCounter =  possibleCells; //equation is right side will have radius + (radius - 1) cells 
                    leftDone = true;
                 }  
                
                if (outerTop < 0) {
                    topCounter = possibleCells; //equation is right side will have radius + (radius - 1) cells
                    topDone = true;
                }  
                if (outerBottom >= rows) {
                    bottomCounter = possibleCells; //equation is right side will have radius + (radius - 1) cells 
                    bottomDone = true;
                }   
                
            } else if (wrapAround == true) {    //only affects right and bottom
                if (outerRight >= columns) {
                    outerRight = (radius - 1);     //since the colNum starts at 0
                }

                if (finishSide > (rows - 1)){
                    for (var i = 0; i < (finishSide - rows); i++){
                        if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
                            rightCounter++;
                            rightDone = true;
                        }
                    }   
                }  
                if (outerBottom >= rows) {
                    outerBottom = (radius - 1);     //since the rowNum starts at 0
                }
            
                if (finishTopBottom > (columns - 1)){
                //loop starting from the other side of the grid
                    for (var i = 0; i <= (finishTopBottom - columns); i++){
                        if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
                            bottomCounter++;
                            bottomDone = true;
                        }
                    }
                }   
            }
            
            if (rightDone != true){
                for (var i = startSides; i < finishSide; i++){
                    if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
                        rightCounter++;
                    }
                }    
            }
            if (leftDone != true){
                for (var i = startSides; i < finishSide; i++){
                    if ($("tr:eq("+i+")").children().eq(outerLeft).is('.alivenow')){
                        leftCounter++;
                    }
                } 
            }
            if (topDone != true){
                for (var i = startTopBottom; i <= finishTopBottom; i++){
                    if ($("tr:eq("+outerTop+")").children().eq(i).is('.alivenow')){
                        topCounter++;
                    }   
                } 
            }
            if (bottomDone != true){
                for (var i = startTopBottom; i <= finishTopBottom; i++){
                    if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
                        bottomCounter++;
                    }   
                }
            }
            
            //finish gathering all other counts
            totalNeighbors = rightCounter + leftCounter + topCounter + bottomCounter;
            
            
            if ($this.is('.alivenow')){
                newState1(totalNeighbors, $this);   
            } else if ($this.not('.alivenow')){
                newState2(totalNeighbors, $this);   
            }
        }); 
    }
    
//    function testrightNeighbors(thisNode) { //NOT INCLUDING CORNERS
//        var $this = thisNode;   
//        var $tr = $this.parent();
//        var colNum = $this.index();
//        var rowNum = $tr.index();
//        var outerRight = colNum + radius;
////        var possibleCells = (radius + (radius + 1));
//        var rightCounter = 0;
//        var start = (rowNum - radius + 1);
//        var finish = (rowNum + radius);
//     
//        if (allDead == true){
//            if (outerRight >= columns) {
//                return 0;   
//            }
//            
//        } else if (allAlive == true) {
//            if (outerRight >= columns) {
//                if (rowNum == 0 || rowNum == (rows - 1)){           //top right and bottom right
//                    return possibleCells - 1;   
//                }
//                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
//            }      
//   
//        } else if (wrapAround == true) {
//            if (outerRight >= columns) {
//                outerRight = (radius - 1);     //since the colNum starts at 0
//            }
//            
//            if (finish > (rows - 1)){
//                for (var i = 0; i < (finish - rows); i++){
//                    if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
//                        rightCounter++;
//                    }
//                }   
//            }
//        }
//        //normal way of counting everything else
//        for (var i = start; i < finish; i++){
//            if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
//                rightCounter++;
//            }
//        }        
//        return rightCounter;
//    }
//    
//    function testleftNeighbors(thisNode) { //DO NOT INCLUDE CORNERS
//        var $this = thisNode;   
//        var $tr = $this.parent();
//        var colNum = $this.index();
//        var rowNum = $tr.index();
//        var outerLeft = colNum - radius;
////        var possibleCells = (radius + (radius + 1));
//        var leftCounter = 0;
//        var start = (rowNum - radius + 1);
//        var finish = (rowNum + radius);
//        
//        if (allDead == true){
//            if (outerLeft < 0) {
//                return 0;   
//            }
//            
//        } else if (allAlive == true) {
//            if (outerLeft < 0) {
//                if (rowNum == 0 || rowNum == (rows - 1)){
//                    return possibleCells - 1;   
//                }
//                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
//            }      
//
//        } else if (wrapAround == true) {      
//        }
//        for (var i = start; i < finish; i++){
//            if ($("tr:eq("+i+")").children().eq(outerLeft).is('.alivenow')){
//                leftCounter++;
//            }
//        } 
//        return leftCounter;
//    }  
//    
//    
//    function testaboveNeighbors(thisNode) { //INCLUDING CORNERS
//        var $this = thisNode;   
//        var $tr = $this.parent();
//        var colNum = $this.index();
//        var rowNum = $tr.index();
//        var outerTop = rowNum - radius;
////        var possibleCells = (radius + (radius + 1));        //range changes if it includes the corners
//        var topCounter = 0;                                
//        var start = (colNum - radius);      //TODO
//        var finish = (colNum + radius);         //TODO
//        
//        if (allDead == true){
//            if (outerTop < 0) {
//                return 0;   
//            }
//            
//        } else if (allAlive == true) {
//            if (outerTop < 0) {
//                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
//            }      
//  
//        } else if (wrapAround == true) {                 
////            if (finish > (columns - 1)){
////                //loop starting from the other side of the grid
////                for (var i = 0; i <= (finish - columns); i++){
////                    if ($("tr:eq("+outerTop+")").children().eq(i).is('.alivenow')){
////                        topCounter++;
////                    }
////                }
////                
////            }
//        }
//       for (var i = start; i <= finish; i++){
//            if ($("tr:eq("+outerTop+")").children().eq(i).is('.alivenow')){
//                topCounter++;
//            }   
//        }           
//        return topCounter;
//    }  
//    
//     function testbelowNeighbors(thisNode) { //INCLUDING CORNERS
//        var $this = thisNode;   
//        var $tr = $this.parent();
//        var colNum = $this.index();
//        var rowNum = $tr.index();
//        var outerBottom = rowNum + radius;
////        var possibleCells = (radius + (radius + 1));        //range changes if it includes the corners
//        var bottomCounter = 0;                                
//        var start = (colNum - radius);      
//        var finish = (colNum + radius);         
//        
//        if (allDead == true){
//            if (outerBottom >= rows) {
//                return 0;   
//            }
//        } else if (allAlive == true) {
//            if (outerBottom >= rows) {
//                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
//            }      
//   
//        } else if (wrapAround == true) {
//            if (outerBottom >= rows) {
//                outerBottom = (radius - 1);     //since the rowNum starts at 0
//            }
//            
//            if (finish > (columns - 1)){
//                //loop starting from the other side of the grid
//                for (var i = 0; i <= (finish - columns); i++){
//                    if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
//                        bottomCounter++;
//                    }
//                }
//                
//            }            
//        }
//       for (var i = start; i <= finish; i++){
//            if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
//                bottomCounter++;
//            }   
//        }
//        
//        return bottomCounter;
//    }    
    
    //new state of previously alive cells
    function newState1(counter, aliveCell) {
        var $this = aliveCell;
        if (counter < lonelyMax || counter > overMin){
            $this.attr('bgcolor', '#9ba3ff');   //dead, update class later         
        }
        
    }
    
    //new state of previously dead cells
    function newState2(counter, deadCell) {
        var $this = deadCell;    
        if (counter >= genMin && counter <= genMax){
            if ($this.is('.livedb4')){
                $this.attr('bgcolor', '#29228e'); 
            }
            else {
                $this.attr('bgcolor', '#29228e'); 
                $this.addClass('livedb4');
            }
        }
    }
                            
});
