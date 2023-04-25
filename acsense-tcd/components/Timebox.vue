<template>

    <div class="time-card card px-2">
        <div class="time-container pt-2">

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
    </div>

</template>

<script lang="ts">

    interface OpeningTimes {
        weekday: {
            open: boolean,
            times: string[],
        },
        sat: {
            open: boolean,
            times: string[],
        },
        holidays: {
            open: boolean,
            times: string[],
        },
    }

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
    justify-content: flex-start;
    align-items: flex-end;
    flex-wrap: wrap;
    column-gap: 2rem;
}
time-entry {
    display: flex;
    flex-direction: column;
    /* justify-content: flex-end; */
    /* align-items: flex-start; */
    flex-wrap: nowrap;
    margin-left: 1rem;
    margin-right: 1rem;
}
.time-lead {
    display: flex;
    font-weight: bold;
    font-size: smaller
}
.time-info {
    display: flex;
}

</style>