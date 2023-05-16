<template>

    <div class="time-card card">
        <div class="time-container pt-2 mx-2">

            <div class="time-entry">
                <div class="time-lead">
                    Mon-Fri
                </div>
                <div class="time-info">
                    <p v-if="times.weekday.open"> {{ times.weekday.times[0] }} - {{ times.weekday.times[1] }} </p>
                    <p v-else><em> Closed </em></p>
                </div>
            </div>

            <div class="time-entry">
                <div class="time-lead">
                    Saturday
                </div>
                <div class="time-info">
                    <p v-if="times.sat.open"> {{ times.sat.times[0] }} - {{ times.sat.times[1] }} </p>
                    <p v-else><em> Closed </em></p>
                </div>
            </div>

            <div class="time-entry">
                <div class="time-lead">
                    Sunday & Public Holidays
                </div>
                <div class="time-info">
                    <p v-if="times.holidays.open"> {{ times.sat.times[0] }} - {{ times.sat.times[1] }} </p>
                    <p v-else><em> Closed </em></p>
                </div>
            </div>

        </div>
        <!-- Render the footer if there's a note; there won't always be one -->
        <div class="card-footer" v-if="times.note.length > 0">
            {{ times.note }}
        </div>
    </div>

</template>

<script lang="ts">

import { OpeningTimes } from 'assets/types/infoPageTypes'

    export default {
        props: {
            times: {
                type: Object as () => OpeningTimes,
                required: true,
            }
        },

    }

</script>

<style>
.time-card{
    margin-left: min(3rem, 3vw);
    margin-right: min(3rem, 3vw);
}

.time-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    flex-wrap: wrap;
    column-gap: 2rem;
    padding-left: auto;
    padding-right: auto;
}

@media screen and (min-width: 415px) {
    .time-container {
        justify-content: space-evenly;
    }
}




/* .time-entry {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin-left: 1rem;
    margin-right: 1rem;
} */
.time-lead {
    display: flex;
    font-weight: bold;
    font-size: smaller
}
.time-info {
    display: flex;
}

</style>