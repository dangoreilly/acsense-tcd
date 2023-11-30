// Modal for displaying information about the buildings
function openInfoModal(building){

    let modal_aka = '<p><em>Also known as: ' + building.aka + '</em></p>';
    let modal_Description = '<p><b>Description</b><br>' + building.description + '</p>';

    let modal_info_button = {
        text: "More Info",
        link: `/info/${building.canonical}`,
    }
        
    let modal_content = "";
    
    if (building.aka != "" && building.aka != "null" && building.aka != null){
        modal_content += modal_aka;
    }
    
    modal_content += modal_Description;

    let buttons = [modal_info_button];

    // let mapModal = document.getElementById('buildingModal')

    // let modalTitle = mapModal.querySelector('.modal-title');
    // let modalBody = mapModal.querySelector('.modal-body');
    // let modalFoot = mapModal.querySelector('.modal-footer');

    // modalTitle.textContent = building.name;
    // modalBody.innerHTML = modal_content;

    let _tempHtml = "";

    buttons.forEach(btn => {

        if(btn.disabled){ 
            _tempHtml += `<button type="button" class="btn btn-primary" disabled>${btn.text}</button>`;
        }
        else{
            _tempHtml += `<a class="btn btn-primary" href="${btn.link}" role="button">${btn.text}</a>`;
        }

    });

    // modalFoot.innerHTML = _tempHtml;

    return {
        title: building.name, 
        mainContent: modal_content, 
        footer: _tempHtml
    }

    // mapModal.style.display = "block";

}

// Modal for displaying information about the sensory areas
function openAreaModal(area){

    // let areaModal = document.getElementById('areaModal')

    // let modalTitle = areaModal.querySelector('.modal-title');
    // let modalBody = areaModal.querySelector('.modal-body');
    // let modalFoot = areaModal.querySelector('.modal-footer');

    let badges = 
    // <!-- Seating -->
    `<div style="grid-area: seating;"
    class="badge rounded-pill mx-1 facility-icon ${ area.seating? 'text-bg-success':'text-bg-danger'}" 
    title="${area.seating ? '' : 'No '}Seating Available">
        <img class="svg-icon" src="/images/icons/chair-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.seating ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +

    // <!-- Electrical Sockets -->
    `<div style="grid-area: sockets;"
    class="badge rounded-pill mx-1 facility-icon ${ area.outlets? 'text-bg-success':'text-bg-danger'}" 
    title="${area.outlets ? '' : 'No '}Plug Sockets">
        <img class="svg-icon" src="/images/icons/plug-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.outlets ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +

    // <!-- Food and Drink allowed -->
    `<div style="grid-area: food;"
    class="badge rounded-pill mx-1 facility-icon ${ area.food_drink_allowed? 'text-bg-success':'text-bg-danger'}" 
    title="Food and Drink${area.food_drink_allowed ? ' ' : 'Not '}Allowed"> 
        <img class="svg-icon" src="/images/icons/utensils-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.food_drink_allowed ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +

    // <!-- Kettle provided -->
    `<div style="grid-area: kettle;" 
    class="badge rounded-pill mx-1 facility-icon ${ area.kettle? 'text-bg-success':'text-bg-danger'}" 
    title="${area.kettle ? '' : 'No '}Kettle Available"> 
        <img class="svg-icon" src="/images/icons/kettle.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.kettle ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +

    // <!-- Microwave provided --> 
    `<div style="grid-area: microwave;"
    class="badge rounded-pill mx-1 facility-icon ${ area.microwave? 'text-bg-success':'text-bg-danger'}" 
    title="${area.microwave ? '' : 'No '}Microwave Available"> 
        <img class="svg-icon" src="/images/icons/microwave.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.microwave ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +

    // <!-- Wheelchair Accessible --> 
    `<div style="grid-area: wheelchair;"
    class="badge rounded-pill mx-1 facility-icon ${ area.wheelchair? 'text-bg-success':'text-bg-danger'}" 
    title="${area.wheelchair ? '' : 'No '}Wheelchair Access"> 
        <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
        <!-- Strikethrough for RG blindness -->
        ${area.wheelchair ? '' :'<img class="svg-icon-sash" src="/images/icons/sash.svg">'}
    </div>` +
    `<a class="btn btn-primary mt-2" style="grid-area: btn;" href="/space/${area.canonical}" role="button">More Info</a>`;

  
    // modalTitle.textContent = area.name;
    // modalBody.textContent = area.description;
    // modalFoot.innerHTML = badges;

    
    return {
        title: area.name, 
        mainContent: area.description, 
        footer: badges
    }

}

export {openInfoModal, openAreaModal};