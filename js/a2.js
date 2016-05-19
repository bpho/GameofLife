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
    //if grid is resized, functions are unfortunately being repeated here..
//    $("#gridsizing").on('submit', function(e){
//        e.preventDefault(); //prevents submission from refreshing page
//        
//        //removes previous rows/columns
//        $("tr").remove();
//        $("td").remove();
//        rows = parseInt($("#newrows").val(), 10);
//        columns = parseInt($("#newcolumns").val(), 10);
//        
//        //tr at i = whatever, add an id attribute with value
//        for (var i = 0; i < rows; i++) {
//            $("#grid").append("<tr></tr>");
//        }
//        
//        for (var i = 0; i < columns; i++) {
//            $("tr").append("<td></td>");  
//        }
//        
//        //gives each row an id attribute with a unique value (no use yet)
//        $("tr").each(function() {
//            $(this).attr('id', 'row'+($(this).index() + 1)); 
//        });
//        
//        $("td").each(function() {
//            $(this).attr('id', 'column'+($(this).index() + 1));
//        });
//        
//        //clicking
//        $("td").on('click', function(e) {
//            var colNum = $(this).index();      //retrieves column index (later use maybe)
//            var $tr = $(this).closest('tr');    //retrieves the closest tr to this td (later use maybe)
//            var rowNum = $tr.index();
//            $(this).attr('class', 'livedb4 alivenow');
//
//            if ($(this).attr('bgcolor') === '#29228e'){
//                $(this).attr('bgcolor', '#9ba3ff');  
//                $(this).attr('class', 'livedb4');   //dead but keeps class of livedb4
//
//            }
//            else {
//                $(this).attr('bgcolor', '#29228e');
//                $(this).attr('class', 'livedb4 alivenow');
//            }
//            
//            //force alive
//            if (e.shiftKey){
//                $(this).attr('bgcolor', '#29228e');
//                $(this).attr('class', 'livedb4 alivenow');
//            }
//
//            //force dead
//            if (e.altKey){
//                $(this).removeAttr('class');
//                $(this).removeAttr('bgcolor');
//            }
//        });
//    
//    });
    
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

//            if (radius > 1) {
//                raidusNormal = false;   
//            }
            console.log("Radius = " +radius);
            console.log("Lonely Max = " +lonelyMax);
            console.log("Overpopulation Min = " + overMin);
            console.log("Generation Min = " + genMin);
            console.log("Generation Max = " +genMax);
//            console.log("Radius Status = " +raidusNormal);

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
        
        console.log("Radius = " +radius);
        console.log("Lonely Max = " +lonelyMax);
        console.log("Overpopulation Min = " + overMin);
        console.log("Generation Min = " + genMin);
        console.log("Generation Max = " +genMax);     
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
        console.log("allAlive = true");
        console.log("allDead = false");
        console.log("wrapAround = false");
        
    });
    
    //All dead
    $('input:radio[name=outsidecells]:nth(0)').click(function(){
        wrapAround = false;
        allDead = true;
        allAlive = false;
        console.log("allAlive = false");
        console.log("allDead = true");
        console.log("wrapAround = false");        
    });
    
    //Wrap Around
    $('input:radio[name=outsidecells]:nth(2)').click(function(){
        wrapAround = true;
        allAlive = false;
        allDead = false;
        console.log("allAlive = false");
        console.log("allDead = false");
        console.log("wrapAround = true");        
    });
    
    //gives each row an id attribute with a unique value (no use yet)
    $("tr").each(function() {
        $(this).attr('id', 'row'+($(this).index() + 1)); 
    });
    
    $("td").each(function() {
        $(this).attr('id', 'column'+($(this).index() + 1));
    });
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
        $("td").each(function(index) {
            if ($(this).attr('bgcolor') === '#29228e'){
                $(this).addClass('alivenow');     
            }
            else if ($(this).attr('bgcolor') === '#9ba3ff'){
                $(this).removeClass('alivenow');   
            }
        });     
    };
    
//  
    function testNeighbors2() {
        $("td").each(function(index) {
            var $this = $(this);
            var totalNeighbors;
            var nextNeighbors = testrightNeighbors($this);
            var prevNeighbors = testleftNeighbors($this);
            var aboveNeighbors = testaboveNeighbors($this);
            var belowNeighbors = testbelowNeighbors($this);
            
            console.log("nextNeighbors = " +nextNeighbors);
            console.log("prevNeighbors = " +prevNeighbors);
            console.log("aboveNeighbors = " +aboveNeighbors);
            console.log("belowNeighbors = " +belowNeighbors);
            
            totalNeighbors = nextNeighbors + prevNeighbors + aboveNeighbors + belowNeighbors;
            console.log("totalNeighbors = " +totalNeighbors);
            
            if ($this.is('.alivenow')){
                newState1(totalNeighbors, $this);   
            } else if ($this.not('.alivenow')){
                newState2(totalNeighbors, $this);   
            }
        });    
    }
    
    function testrightNeighbors(thisNode) { //NOT INCLUDING CORNERS
        var $this = thisNode;   
        var $tr = $this.parent();
        var colNum = $this.index();
        var rowNum = $tr.index();
        var outerRight = colNum + radius;
        var possibleCells = (radius + (radius + 1));
        var rightCounter = 0;
        var start = (rowNum - radius + 1);
        var finish = (rowNum + radius);
        
//        console.log("column number = " +colNum);
//        console.log("outerRight = " +outerRight);
//        
        if (allDead == true){
            if (outerRight >= columns) {
                return 0;   
            }
             for (var i = start; i < finish; i++){
                if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
                    rightCounter++;
                }
            }
            
        } else if (allAlive == true) {
            if (outerRight >= columns) {
                if (rowNum == 0 || rowNum == (rows - 1)){           //top right and bottom right
                    return possibleCells - 1;   
                }
                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
            }      
             for (var i = start; i < finish; i++){
                if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
                    rightCounter++;
                }
            }    
        } else if (wrapAround == true) {
            if (outerRight >= columns) {
                outerRight = (radius - 1);     //since the colNum starts at 0
            }
            for (var i = start; i < finish; i++){
                if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
                    rightCounter++;
                }
            }
            
            if (finish > (rows - 1)){
                for (var i = 0; i < (finish - rows); i++){
                    if ($("tr:eq("+i+")").children().eq(outerRight).is('.alivenow')){
                        rightCounter++;
                    }
                }
                
            }
        }
        
        return rightCounter;
    }
    
    function testleftNeighbors(thisNode) { //DO NOT INCLUDE CORNERS
        var $this = thisNode;   
        var $tr = $this.parent();
        var colNum = $this.index();
        var rowNum = $tr.index();
        var outerLeft = colNum - radius;
        var possibleCells = (radius + (radius + 1));
        var leftCounter = 0;
        var start = (rowNum - radius + 1);
        var finish = (rowNum + radius);
        
        if (allDead == true){
            if (outerLeft < 0) {
                return 0;   
            }
            for (var i = start; i < finish; i++){
                if ($("tr:eq("+i+")").children().eq(outerLeft).is('.alivenow')){
                    leftCounter++;
                }
            }
            
        } else if (allAlive == true) {
            if (outerLeft < 0) {
                if (rowNum == 0 || rowNum == (rows - 1)){
                    return possibleCells - 1;   
                }
                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
            }      
            for (var i = start; i < finish; i++){
                if ($("tr:eq("+i+")").children().eq(outerLeft).is('.alivenow')){
                    leftCounter++;
                }
            }    
        } else if (wrapAround == true) {
//            if (outerLeft < 0) {
//                outerLeft = ((columns - 1) - radius);     //since the colNum starts at 0
//            }
            for (var i = start; i < finish; i++){
                if ($("tr:eq("+i+")").children().eq(outerLeft).is('.alivenow')){
                    leftCounter++;
                }   
            }
//            if (finish > (rows - 1)){
//                for (var i = 0; i < (finish - rows); i++){
//                    if ($("tr:eq("+i+")").children().eq(outerLeft).is('.alivenow')){
//                        leftCounter++;
//                    }
//                }
//                
//            }            
        }
        
        return leftCounter;
    }  
    
    
    function testaboveNeighbors(thisNode) { //INCLUDING CORNERS
        var $this = thisNode;   
        var $tr = $this.parent();
        var colNum = $this.index();
        var rowNum = $tr.index();
        var outerTop = rowNum - radius;
        var possibleCells = (radius + (radius + 1));        //range changes if it includes the corners
        var topCounter = 0;                                
        var start = (colNum - radius);      //TODO
        var finish = (colNum + radius);         //TODO
        
        if (allDead == true){
            if (outerTop < 0) {
                return 0;   
            }
            for (var i = start; i <= finish; i++){
                if ($("tr:eq("+outerTop+")").children().eq(i).is('.alivenow')){
                    topCounter++;
                }
            }
            
        } else if (allAlive == true) {
            if (outerTop < 0) {
                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
            }      
            for (var i = start; i <= finish; i++){
                if ($("tr:eq("+outerTop+")").children().eq(i).is('.alivenow')){
                    topCounter++;
                }
            }    
        } else if (wrapAround == true) {
//            if (outerTop < 0) {                           //will do it automatically
//                outerTop = ((rowNum - 1) - radius);     //since the rowNum starts at 0
//            }
            
            for (var i = start; i <= finish; i++){
                if ($("tr:eq("+outerTop+")").children().eq(i).is('.alivenow')){
                    topCounter++;
                }   
            }   
            
            if (finish > (columns - 1)){
                //loop starting from the other side of the grid
                for (var i = 0; i <= (finish - columns); i++){
                    if ($("tr:eq("+outerTop+")").children().eq(i).is('.alivenow')){
                        topCounter++;
                    }
                }
                
            }
        }
        
        return topCounter;
    }  
    
     function testbelowNeighbors(thisNode) { //INCLUDING CORNERS
        var $this = thisNode;   
        var $tr = $this.parent();
        var colNum = $this.index();
        var rowNum = $tr.index();
        var outerBottom = rowNum + radius;
        var possibleCells = (radius + (radius + 1));        //range changes if it includes the corners
        var bottomCounter = 0;                                
        var start = (colNum - radius);      //TODO
        var finish = (colNum + radius);         //TODO
        
        if (allDead == true){
            if (outerBottom >= rows) {
                return 0;   
            }
            for (var i = start; i <= finish; i++){
                if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
                    bottomCounter++;
                }
            }
            
        } else if (allAlive == true) {
            if (outerBottom >= rows) {
                return possibleCells; //equation is right side will have radius + (radius - 1) cells 
            }      
            for (var i = start; i <= finish; i++){
                if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
                    bottomCounter++;
                }
            }    
        } else if (wrapAround == true) {
            if (outerBottom >= rows) {
                outerBottom = (radius - 1);     //since the rowNum starts at 0
            }
            for (var i = start; i <= finish; i++){
                if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
                    bottomCounter++;
                }   
            }
            
            if (finish > (columns - 1)){
                //loop starting from the other side of the grid
                for (var i = 0; i <= (finish - columns); i++){
                    if ($("tr:eq("+outerBottom+")").children().eq(i).is('.alivenow')){
                        bottomCounter++;
                    }
                }
                
            }            
        }
        
        return bottomCounter;
    }    
    
//    function testNeighbors2() {
//        $("td").each(function(index) {
//            var counter1 = 0;
//            var counter2 = 0;
//            var $this = $(this);
//            var colNum = $this.index();
//            var $tr = $this.parent();
//            var rowNum = $tr.index();
//            var outerLeft = colNum - radius;
//            var outerRight = colNum + radius;
//            var outerTop = rowNum - radius;
//            var outerBottom = rowNum + radius;
//
//            
//            //iterate across columns with .each of the current index -/+ TOP/BOTTOM
//            //iterate down rows with .each of the current index -/+ radius LEFT/RIGHT
//            //THIS ALL AFFECTS A SINGLE CELL IN THE CENTER can CALL newState1 and newState2 below
//            for (var i = outerTop; i <= outerBottom; i++){
//                var $currentLeft = $("tr:eq("+i+")").children().eq(outerLeft);  //tests all the left neighbors from top to bottom                   
//                var $currentRight = $("tr:eq("+i+")").children().eq(outerRight);
//                if ($this.is('.alivenow')){
//                    if ($currentLeft.is('.alivenow')){
//                        counter1++;   
//                    }
//                    if ($currentRight.is('.alivenow')){
//                        counter1++;   
//                    }
////                    if (allAlive == true) {
////                        //cells at certain states will have an additional +5/+3 counter
////                        if (outerRight > (columns - 1) || outerLeft < 0
////                    }
//                }
//                console.log("Counter 1 = " +counter1);
//                
//                if ($this.not('.alivenow')){
//                    if ($currentLeft.is('.alivenow')){
//                        counter2++;   
//                    }
//                    if ($currentRight.is('.alivenow')){
//                        counter2++;   
//                    }
//                }                 
//            }
//            
//            //Should be testing all TOP and BOTTOM neighbors
//            for (var j = (outerLeft+1); j <= (outerRight-1); j++){
//                var $currentTop = $("tr:eq("+(outerTop)+")").children().eq(j);  
//                var $currentBottom = $("tr:eq("+(outerBottom)+")").children().eq(j);
//                
//                if ($this.is('.alivenow')){
//                    if ($currentTop.is('.alivenow')){
//                        counter1++;   
//                    }
//                    if ($currentBottom.is('.alivenow')){
//                        counter1++;   
//                    }
//                } 
//                console.log("Counter 1 = " +counter1);
//                
//                if ($this.not('.alivenow')){
//                    if ($currentTop.is('.alivenow')){
//                        counter2++;   
//                    }
//                    if ($currentBottom.is('.alivenow')){
//                        counter2++;   
//                    }
//                } 
//                
//            }
//            
//            if ($this.is('.alivenow')){
//                newState1(counter1, $this);
//            }else if ($this.not('.alivenow')){
//                newState2(counter2, $this);   
//            }
//            
//        });   
//    }
//    
//    
//    function testNeighbors() {
//        $("td").each(function(index) {
//            var $this = $(this);            
//            var $prev = $this.prev();
//            var $next = $this.next();
//            var $tr = $this.parent();
//            var rowNum = $tr.index();
//            var colNum = $this.index();     //retrieves current colNum
//            var $above = $this.closest('tr').prev().children().eq(colNum); //the child above at the current colNum
//            var $aboveleft = $above.prev();
//            var $aboveright = $above.next();
//            var $below = $this.closest('tr').next().children().eq(colNum);
//            var $belowleft = $below.prev();
//            var $belowright = $below.next();     
//            var counter1 = 0;           //counting for alive cells
//            var counter2 = 0;                
// 
//            
//            //When All the outside neighbors are alive
//            if (allAlive == true){
//                if ((rowNum == 0 && (colNum == 0 || colNum == columns - 1)) || (rowNum == (rows-1) && (colNum == 0 || colNum == columns - 1))){
//                    counter1 += 5;  //corner cells have 5 neighbors that would be alive
//                    counter2 += 5;
//                    
//                }
//                else if (rowNum == 0 || rowNum == (rows - 1) || colNum == 0 || colNum == (columns - 1)) {
//                    counter1 += 3;
//                    counter2 += 3;
//                }
//            }else if (wrapAround == true){
//                //if $this is on the border parts, change it's counter
//                if (rowNum == 0){
//                    //Change everyone's top neighbors
//                    $above = $("tr:eq("+(rows-1)+")").children().eq(colNum);
//                    $aboveleft = $above.prev();
//                    $aboveright = $above.next();
//                    
//                    //Top left
//                    if (colNum == 0){
//                        //just change the above, aboveleft, prev, belowleft
//                        $above = $("tr:eq("+(rows-1)+")").children().eq(colNum);
//                        $aboveleft = $("tr:eq("+(rows-1)+")").children().eq(columns - 1);         //above left would be the bottom right
//                        $prev = $tr.children().eq(columns - 1);             //prev would refer to last one in row
//                        $belowleft = $tr.next().children().eq(columns - 1);
//                    } else if (colNum == (columns - 1)){ //Top right
//                        //change above
//                        $above = $("tr:eq("+(rows-1)+")").children().eq(colNum);
//                        $aboveright = $("tr:eq("+(rows-1)+")").children().eq(0);
//                        $next = $tr.children().eq(0);
//                        $belowright = $tr.next().children().eq(0);
//                    }     
//                }else if (rowNum == (rows - 1)){
//                    //All bottom cells
//                    $below = $("tr:eq(0)").children().eq(colNum);
//                    $belowright = $below.next();
//                    $belowleft = $below.prev();              
//                    //Bottom left
//                    if (colNum == 0){
//                        //change prev, belowleft, aboveleft, and below
//                        $below = $("tr:eq(0)").children().eq(colNum);
//                        $belowleft = $("tr:eq(0)").children().eq(columns - 1);
//                        $aboveleft = $tr.prev().children().eq(columns - 1);
//                        $prev = $tr.children().eq(columns - 1);             
//                    }else if (colNum == (columns - 1)){ //Bottom right
//                        $below = $("tr:eq(0)").children().eq(colNum);
//                        $belowright = $("tr:eq(0)").children().eq(0);
//                        $aboveright = $tr.prev().children().eq(0);
//                        $next = $tr.children().eq(0);
//                    }
//                } else{         
//                    if (colNum == 0){
//                        //prev, aboveleft, belowleft
//                        $prev = $tr.children().eq(columns - 1);
//                        $aboveleft = $tr.prev().children().eq(columns - 1);
//                        $belowleft = $tr.next().children().eq(columns - 1);
//                    } else if (colNum == (columns - 1)){
//                        //next, aboveright, belowright
//                        $next = $tr.children().eq(0);
//                        $aboveright = $tr.prev().children().eq(0);
//                        $belowright = $tr.next().children().eq(0);
//                    }
//                }
//            }
//            
//            //CHANGE THESE ALL TO USE THE TERNARY OPERATOR (?)
//            if ($this.is('.alivenow')){
//                if ($above.is('.alivenow')){
//                    counter1++;   
//                }          
//                if ($below.is('.alivenow')){
//                    counter1++;   
//                }
//                if ($belowleft.is('.alivenow')){
//                    counter1++;   
//                }    
//                if ($belowright.is('.alivenow')){
//                    counter1++;   
//                }                
//                if ($next.is('.alivenow')){
//                    counter1++;   
//                }                
//                if ($prev.is('.alivenow')){
//                    counter1++;   
//                }
//                if ($aboveright.is('.alivenow')){
//                    counter1++;   
//                }
//                if ($aboveleft.is('.alivenow')){
//                    counter1++;   
//                }     
//
//                newState1(counter1, $this); //testing da alive ones
//            }
//            else if ($this.not('.alivenow')){
//                
//                if ($above.is('.alivenow')){
//                    counter2++;   
//                }          
//                if ($below.is('.alivenow')){
//                    counter2++;   
//                }
//                if ($belowleft.is('.alivenow')){
//                    counter2++;   
//                }    
//                if ($belowright.is('.alivenow')){
//                    counter2++;   
//                }                
//                if ($next.is('.alivenow')){
//                    counter2++;   
//                }                
//                if ($prev.is('.alivenow')){
//                    counter2++;   
//                }
//                if ($aboveright.is('.alivenow')){
//                    counter2++;   
//                }
//                if ($aboveleft.is('.alivenow')){
//                    counter2++;   
//                }   
//                     
//                newState2(counter2, $this); //testing da dead cells
//            }
//            
//        });
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
               // $this.addClass('alivenow');
            }
            else {
                $this.attr('bgcolor', '#29228e'); 
                $this.addClass('livedb4');
                //$this.addClass('livedb4 alivenow');                
            }
        }
    }
                            
});
