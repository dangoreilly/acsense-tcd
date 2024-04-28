<!-- Page for displaying table of info about -->
<!-- Sensory Spaces and other rooms -->
<template>
    <NuxtLayout name="rooms-layout">
        <!-- <div class="border-end border-start" style="background-color: rgb(255, 252, 240); min-height: 100vh;"> -->
            <div class="m-3 pt-3">
                <a href="#"> &lt; Arts Building</a>
            </div>
            <div class="table-responsive" style="height:calc(70dvh)">
                <table class="table table-striped position-relative">
                    <thead>
                        <tr class="header">
                            <th scope="col" style="left:0; z-index:1000;">CMIS code</th>
                            <th scope="col">Name</th>
                            <th scope="col">AKA</th>
                            <th scope="col">Room Type</th>
                            <th scope="col">Capacity</th>
                            <th scope="col">Hearing Loop</th>
                            <th scope="col">Wheelchair Access</th>
                            <th scope="col">Outlets</th>
                            <th scope="col">Projector</th>
                            <th scope="col">Whiteboard</th>
                            <th scope="col">Lecturn</th>
                            <th scope="col">Hearing Loop</th>
                            <th scope="col">Wheelchair Access</th>
                            <th scope="col">Outlets</th>
                            <th scope="col">Projector</th>
                            <th scope="col">Whiteboard</th>
                            <th scope="col">Lecturn</th>
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
                            <td v-html="room.whiteboard ? tick : x"> </td>
                            <td v-html="room.lecturn ? tick : x"> </td>
                            <td v-html="room.hearingLoop ? tick : x"></td>
                            <td v-html="room.wheelchair ? tick : x"></td>
                            <td v-html="room.outlets ? tick : x"> </td>
                            <td v-html="room.projector ? tick : x"> </td>
                            <td v-html="room.whiteboard ? tick : x"> </td>
                            <td v-html="room.lecturn ? tick : x"> </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        <!-- </div> -->
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
            tick: '<span class="badge rounded-pill text-bg-success">Yes</span>',
            x:  '<span class="badge rounded-pill text-bg-danger">No</span>',

            scrollX: 0,
            scrollY:0,
        }
    },
}
</script>

<style>

th {
    position: sticky;
}

tr.header > th {
    top: 0;
}

tr > th {
    left: 0;
}
</style>