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


    let capacity = `<span class="badge rounded-pill text-bg-warning" title="Capacity"><i class="fa-solid fa-chair"></i> ${area.capacity > 0 ? area.capacity : "?"}</span>`;
    let electrical_outlets =  `<span class="badge rounded-pill text-bg-${area.electrical_outlets ? "success" : "danger"}" title="${area.electrical_outlets ? "" : "No "}Plug Sockets"><i class="fa-solid fa-plug"></i></span>`;
    let food_drink_allowed = `<span class="badge rounded-pill text-bg-${area.food_drink_allowed ? "success" : "danger"}" title="Food and Drink ${area.food_drink_allowed ? "Allowed" : "not Allowed"}"><i class="fa-solid fa-utensils"></i></i></span>`;
    let indoors = `<span class="badge rounded-pill text-bg-warning">${area.indoors ? "Indoors" : "Outdoors"}</span>`;
    let wheelchair_accessible = `<span class="badge rounded-pill text-bg-${area.wheelchair_accessible ? "success" : "danger"}" title="${area.wheelchair_accessible ? "" : "No "}Wheelchair Access"><i class="fa-solid fa-wheelchair"></i></span>`;
    let kettle = `<span class="badge rounded-pill text-bg-${area.kettle ? "success" : "danger"}" title="${area.kettle ? "" : "No "}Kettle"><i class="fa-solid fa-mug-saucer"></i></span>`;
    let microwave = `<span class="badge rounded-pill text-bg-${area.microwave ? "success" : "danger"}" title="${area.microwave ? "" : "No "}Microwave"><i class="fa-solid fa-radiation"></i></span>`;

    modalTitle.textContent = area.Name;
    modalBody.textContent = area.Description;
    // Combine all the information pills into one string
    modalFoot.innerHTML = `<span class="fs-4">${indoors} ${capacity} ${electrical_outlets} ${food_drink_allowed} ${kettle} ${microwave} ${wheelchair_accessible}</span>`;

    areaModal.style.display = "block";

}