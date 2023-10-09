// Modal for displaying information about the buildings
function openInfoModal(_title, _bodyhtml, buttons){
    // console.log("openInfoModel called");
    // console.log(_title);
    // console.log(_bodyhtml);
    // console.log(buttons);

    let mapModal = document.getElementById('mapModal')

    let modalTitle = mapModal.querySelector('.modal-title');
    let modalBody = mapModal.querySelector('.modal-body');
    let modalFoot = mapModal.querySelector('.modal-footer');

    modalTitle.textContent = _title;
    modalBody.innerHTML = _bodyhtml;

    let _tempHtml = "";

    buttons.forEach(btn => {

        if(btn.disabled){ 
            _tempHtml += `<button type="button" class="btn btn-primary" disabled>${btn.text}</button>`;
        }
        else{
            _tempHtml += `<a class="btn btn-primary" href="${btn.link}" role="button">${btn.text}</a>`;
        }

    });

    modalFoot.innerHTML = _tempHtml;

    mapModal.style.display = "block";

}

// Modal for displaying information about the sensory areas
function openAreaModal(area){

    let areaModal = document.getElementById('areaModal')

    let modalTitle = areaModal.querySelector('.modal-title');
    let modalBody = areaModal.querySelector('.modal-body');
    let modalFoot = areaModal.querySelector('.modal-footer');


    let seating = `<span 
    class="badge rounded-pill text-bg-${area.seating ? "success" : "danger"}" 
    title="${area.seating ? "" : "No "}Seating Available">
    <img class="svg-icon" src="/images/icons/chair-solid.svg" width="12" height="12">
    </span>`;

    let electrical_outlets = `<span 
    class="badge rounded-pill text-bg-${area.electrical_outlets ? "success" : "danger"}" 
    title="${area.electrical_outlets ? "" : "No "}Plug Sockets">
    <img class="svg-icon" src="/images/icons/plug-solid.svg" width="12" height="12">
    </span>`;

    let food_drink_allowed = `<span 
    class="badge rounded-pill text-bg-${area.food_drink_allowed ? "success" : "danger"}" 
    title="Food and Drink ${area.food_drink_allowed ? "" : "Not "}Allowed">
    <img class="svg-icon" src="/images/icons/utensils-solid.svg" width="12" height="12">
    </span>`;

    let wheelchair_accessible = `<span 
    class="badge rounded-pill text-bg-${area.wheelchair_accessible ? "success" : "danger"}" 
    title="${area.wheelchair_accessible ? "" : "No "}Wheelchair Access">
    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg" width="12" height="12">
    </span>`;

    let kettle = `<span 
    class="badge rounded-pill text-bg-${area.kettle ? "success" : "danger"}" 
    title="${area.kettle ? "" : "No "}Kettle Available">
    <img class="svg-icon" src="/images/icons/kettle.svg" width="12" height="12">
    </span>`;

    let microwave = `<span 
    class="badge rounded-pill text-bg-${area.microwave ? "success" : "danger"}" 
    title="${area.microwave ? "" : "No "}Microwave Available">
    <img class="svg-icon" src="/images/icons/microwave.svg" width="12" height="12">
    </span>`;

    let badges = 
    // <!-- Seating -->
    // `<div class="space-modal-badge-container">` +
    `<div style="grid-area: seating;"
    class="badge rounded-pill mx-1 facility-icon ${ area.seating? 'text-bg-success':'text-bg-danger'}" 
    title="${area.seating ? '' : 'No '} + 'Seating Available'">
        <img class="svg-icon" src="/images/icons/chair-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.seating ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +
    /* <!-- Electrical Sockets --> */
    `<div style="grid-area: sockets;"
    class="badge rounded-pill mx-1 facility-icon ${ area.outlets? 'text-bg-success':'text-bg-danger'}" 
    title="${area.outlets ? '' : 'No '} + 'Plug Sockets'">
        <img class="svg-icon" src="/images/icons/plug-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.outlets ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +
    /* <!-- Food and Drink allowed --> */
    `<div style="grid-area: food;"
    
    class="badge rounded-pill mx-1 facility-icon ${ area.food_drink_allowed? 'text-bg-success':'text-bg-danger'}" 
    title="Food and Drink${area.food_drink_allowed ? '' : 'Not '} + 'Allowed'"> 
        <img class="svg-icon" src="/images/icons/utensils-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.food_drink_allowed ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +
    // <!-- Kettle provided -->
    `<div 
    style="grid-area: kettle;" 
    
    class="badge rounded-pill mx-1 facility-icon ${ area.kettle? 'text-bg-success':'text-bg-danger'}" 
    title="${area.kettle ? '' : 'No '} + 'Kettle Available'"> 
        <img class="svg-icon" src="/images/icons/kettle.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.kettle ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +
    /* <!-- Microwave provided --> */
    `<div style="grid-area: microwave;"
    
    class="badge rounded-pill mx-1 facility-icon ${ area.microwave? 'text-bg-success':'text-bg-danger'}" 
    title="${area.microwave ? '' : 'No '} + 'Microwave Available'"> 
        <img class="svg-icon" src="/images/icons/microwave.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.microwave ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +
    /* <!-- Wheelchair Accessible --> */
    `<div style="grid-area: wheelchair;"
    class="badge rounded-pill mx-1 facility-icon ${ area.wheelchair? 'text-bg-success':'text-bg-danger'}" 
    title="${area.wheelchair ? '' : 'No '} + 'Wheelchair Access'"> 
        <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.wheelchair ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +
    `<a class="btn btn-primary mt-2" style="grid-area: btn;" href="/space/${area.canonical}" role="button">More Info</a>`;
    // `</div>`;

    // let electrical_outlets =  `<span class="badge rounded-pill text-bg-${area.electrical_outlets ? "success" : "danger"}" title="${area.electrical_outlets ? "" : "No "}Plug Sockets"><i class="fa-solid fa-plug"></i></span>`;
    // let food_drink_allowed = `<span class="badge rounded-pill text-bg-${area.food_drink_allowed ? "success" : "danger"}" title="Food and Drink ${area.food_drink_allowed ? "Allowed" : "not Allowed"}"><i class="fa-solid fa-utensils"></i></i></span>`;
    // let indoors = `<span class="badge rounded-pill text-bg-warning">${area.indoors ? "Indoors" : "Outdoors"}</span>`;
    // let wheelchair_accessible = `<span class="badge rounded-pill text-bg-${area.wheelchair_accessible ? "success" : "danger"}" title="${area.wheelchair_accessible ? "" : "No "}Wheelchair Access"><i class="fa-solid fa-wheelchair"></i></span>`;
    // let kettle = `<span class="badge rounded-pill text-bg-${area.kettle ? "success" : "danger"}" title="${area.kettle ? "" : "No "}Kettle"><i class="fa-solid fa-mug-saucer"></i></span>`;
    // let microwave = `<span class="badge rounded-pill text-bg-${area.microwave ? "success" : "danger"}" title="${area.microwave ? "" : "No "}Microwave"><i class="fa-solid fa-radiation"></i></span>`;

    modalTitle.textContent = area.name;
    modalBody.textContent = area.description;
    // Combine all the information pills into one string
    // modalFoot.innerHTML = `<span class="fs-4">${seating} ${electrical_outlets} ${food_drink_allowed} ${kettle} ${microwave} ${wheelchair_accessible}</span>`;
    modalFoot.innerHTML = badges;

    areaModal.style.display = "block";

}