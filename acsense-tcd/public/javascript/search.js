 // Fuzzy Search
 const options = {
    includeScore: true,
    keys: [ {name:'buildingName', weight:3},
            {name:'aka', weight:1},
            {name:'ZoomedInLabel', weight:1},
            {name:'ZoomedOutLabel', weight:1}]
}

var buildings = [{{#buildings.list}}
{"buildingName":"{{Name}}",
"bldID":"{{bldID}}",
"ZoomedInLabel":"{{ZoomedInLabel}}",
"ZoomedOutLabel":"{{ZoomedOutLabel}}",
"aka": "{{aka}}"
},
{{/buildings.list}}];

// Create a new instance of Fuse
var fuse = new Fuse(buildings, options)

function buildingSearch() {
    // Declare variables
    var input, li, i; 
    var filter = [];
    input = document.getElementById('searchbar').value;
    li = document.getElementsByClassName('accordion-item');
    
    //Use the static generated Fuse instance to get a list of matches
    let result = fuse.search(input)

    //convert that Fuse instance to an array of IDs for filtering
    for (i = 0; i < result.length; i++){
        filter.push(result[i].item.bldID);
    }

    // Check there is a result
    // If there's no result and no text in the textbox, show everything except the apology
    //TODO: Add an apology
    if (result.length == 0 && input == ""){

        //Make everything reappear
        for (i = 0; i < li.length; i++) {
            li[i].style.display = "";
        }
        //Sort them
        sortList_byAlphabet();
        
    }
    else if(result.length == 0){
        //If the results are 0 but there is a query, then we need to apologise
    }
    else {
        // If the result is nonzero, then show the returns
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {

            
            if (filter.includes(li[i].id)) {
                li[i].style.display = "";
                li[i].dataset.score = result.find(r => r.item.bldID == li[i].id).score.toString();
            } 
            else {
                li[i].style.display = "none";
            }
        }

        //Then loop through again and sort based on scores
        sortList_byScore();

    }

}

//Function for sorting list based on data values
function sortList_byScore() {

    var list, i, switching, b, shouldSwitch;

    list = document.getElementById("buildingsList");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByClassName("accordion-item");
        
        // Loop through all list items:
            for (i = 0; i < (b.length - 1); i++) {

                // Start by saying there should be no switching:
                shouldSwitch = false;

                /* Check if the next item should
                switch place with the current item: */
                if (parseFloat(b[i].dataset.score) > parseFloat(b[i+1].dataset.score)) {

                    /* If next item is alphabetically lower than current item,
                    mark as a switch and break the loop: */
                    shouldSwitch = true;
                    break;
                }
            }
        if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        {{!-- console.log(`Swapping ${b[i].id} and ${b[i+1].id}`) --}}
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
        }
    }
}

//Function for sorting list based on alpabet
function sortList_byAlphabet() {

    var list, i, switching, b, shouldSwitch;

    list = document.getElementById("buildingsList");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByClassName("accordion-item");
        
        // Loop through all list items:
            for (i = 0; i < (b.length - 1); i++) {

                // Start by saying there should be no switching:
                shouldSwitch = false;

                /* Check if the next item should
                switch place with the current item: */
                if (b[i].id > b[i+1].id) {

                    /* If next item is alphabetically lower than current item,
                    mark as a switch and break the loop: */
                    shouldSwitch = true;
                    break;
                }
            }
        if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark the switch as done: */
        {{!-- console.log(`Swapping ${b[i].id} and ${b[i+1].id}`) --}}
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
        }
    }
}
