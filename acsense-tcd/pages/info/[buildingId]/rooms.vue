<!-- Page for displaying table of info about -->
<!-- Sensory Spaces and other rooms -->
<template>
    <NuxtLayout name="info-layout">
        <div class="border-end border-start" style="background-color: rgb(255, 252, 240); min-height: 100vh;">
            <div class="m-3 py-3">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Map</a></li>
                        <li class="breadcrumb-item"><a href="/info/{{ buildingId }}">Building Info</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Room Info</li>
                    </ol>
                </nav>
            </div>
            <table class="table">
  <thead>
    <tr>
      <th scope="col">CMIS code</th>
      <th scope="col">Name</th>
      <th scope="col">AKA</th>
      <th scope="col">Room Type</th>
      <th scope="col">Capacity</th>
      <th scope="col">Hearing Loop</th>
      <th scope="col">Wheelchair Access</th>
      <th scope="col">Outlets</th>
      <th scope="col">Projector</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="room in rooms">
        <th scope="row">{{ room.cmis }}</th>
        <td>{{ room.roomName }}</td>
        <td>{{ room.aka }}</td>
        <td>{{ room.roomType }}</td>
        <td>{{ room.capacity }}</td>
        <td v-html="room.hearingLoop ? tick : x"></td>
        <td v-html="room.wheelchair ? tick : x"></td>
        <td v-html="room.outlets ? tick : x"> </td>
        <td v-html="room.projector ? tick : x"> </td>
    </tr>
    
  </tbody>
</table>
        </div>
    </NuxtLayout>
</template>

<script>

let rooms = [
    {
        "roomName": "FITZGERALD LIBRARY ",
        "aka": "",
        "cmis": "FITZLIB",
        "roomType": "Flat",
        "capacity": 22,
        "hearingLoop": false,
        "wheelchair": true,
        "outlets": false,
        "projector": true,
        "whiteboard": true,
        "lecturn": true

    },
    {
        "roomName": "PHYSICS LARGE LECTURE THEATRE",
        "aka": "The Shro",
        "cmis": "PHYLLT",
        "roomType": "Tiered",
        "capacity": 148,
        "hearingLoop": false,
        "wheelchair": false,
        "outlets": false,
        "projector": true,
        "whiteboard": true,
        "lecturn": true

    },
    {
        "roomName": "SNIAM COMPUTATIONAL PHYSICS LAB (0.19)",
        "aka": "SNIAM PC Room",
        "cmis": "SNIAM CPL",
        "roomType": "Lab",
        "capacity": 35,
        "hearingLoop": false,
        "wheelchair": true,
        "outlets": true,
        "projector": true,
        "whiteboard": true,
        "lecturn": true

    },
    {
        "roomName": "SNIAM LECTURE THEATRE",
        "aka": "SNIAM Basement",
        "cmis": "SNIAM LT",
        "roomType": "Flat",
        "capacity": 122,
        "hearingLoop": false,
        "wheelchair": true,
        "outlets": true,
        "projector": true,
        "whiteboard": true,
        "lecturn": true

    },
]

export default {
    data() {
        return {
            buildingId: this.$route.params.buildingId,
            rooms: rooms,
            tick: '<span class="badge rounded-pill text-bg-success"><i class="bi bi-check-circle-fill"></i></span>',
            x:  '<span class="badge rounded-pill text-bg-danger"><i class="bi bi-x-circle-fill"></i></span>',

        }
    },
}
</script>

<style>
</style>