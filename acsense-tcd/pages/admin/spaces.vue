<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'buildings'">
        <!-- Header -->
        <div class="border-bottom border-2 border-black mb-3 d-flex">
            <!-- Title -->
            <h1 class="display-6 d-flex align-items-end">
                Building Management
            </h1>

            <!-- Construction Badge -->
            <div class="d-flex align-items-center m-3 fs-5">
                <span class="badge rounded-pill text-bg-info">
                    Partial Demonstration
                </span>
            </div>

        </div>

        <!-- Main Matter -->
        <div class="mainMatter-admin">
            <!-- Two columns -->
            <!-- Column 1 contains input boxes -->
            <!-- Column 2 contains infoPage components -->
            <!-- The input boxes are paired to the components to allow for live editing -->
            <!-- The input boxes and components are left aligned in their respective colum -->
        
            <!-- <Summary> (and building selection dropdown) -->
            <div class="row">
                <div class="col d-flex flex-column">
                    <!-- Building Name -->
                    <select class="form-select mb-3">
                        <!-- <option selected disabled>Select a building to edit</option> -->
                        <option :value="building.buildingId">{{ building.name }}</option>
                    </select>

                    <!-- Aka -->
                    <div class="mb-3">
                        <label for="AkaInput" class="form-label">AKA <small>(optional)</small></label>
                        <input id="AkaInput" type="text" class="form-control" 
                        v-model="building.aka">
                    </div>

                    <!-- Description -->
                    <div class="mb-3">
                        <label for="descInput" class="form-label">Description</label>
                        <textarea class="form-control" id="descInput" rows="4" 
                        v-model="building.description"></textarea>
                    </div>

                </div>
                <div class="col">
                    <Summary 
                    :buildingName="building.name"
                    :aka="building.aka"
                    :description="building.description"
                    />
                </div>
            </div>
        
            <!-- Opening Times -->
            <div class="row mt-3"><label class="form-label d-block">Opening Times</label>
                <div class="col d-flex flex-column">
                    <!-- Weekdays -->
                    <div class="row">
                        <div class="col">
                            <label for="weekDay-checkbox" >Weekdays</label>
                            <input type="checkbox" id="weekDay-checkbox" class="form-check-input form-control"
                            v-model="building.openingTimes.weekday.open" />
                        </div>
                        <div class="col">
                            <label for="weekDay-open">Opening Time</label>
                            <input type="time" id="weekDay-open" class="form-control"
                            v-model="building.openingTimes.weekday.times[0]" 
                            :disabled="!building.openingTimes.weekday.open"/>
                        </div>
                        <div class="col">
                            <label for="weekDay-open">Closing Time</label>
                            <input type="time" id="weekDay-open" class="form-control"
                            v-model="building.openingTimes.weekday.times[1]" 
                            :disabled="!building.openingTimes.weekday.open"/>
                        </div>
                    </div>
                    <!-- Saturdays -->
                    <div class="row">
                        <div class="col">
                            <label for="sat-checkbox">Saturday</label>
                            <input type="checkbox" id="sat-checkbox" class="form-check-input form-control"
                            v-model="building.openingTimes.sat.open" />
                        </div>
                        <div class="col">
                            <label for="sat-open">Opening Time</label>
                            <input type="time" id="sat-open" class="form-control"
                            v-model="building.openingTimes.sat.times[0]" 
                            :disabled="!building.openingTimes.sat.open"/>
                        </div>
                        <div class="col">
                            <label for="sat-close">Closing Time</label>
                            <input type="time" id="sat-close" class="form-control"
                            v-model="building.openingTimes.sat.times[1]" 
                            :disabled="!building.openingTimes.sat.open"/>
                        </div>
                    </div>
                    <!-- Sundays -->
                    <div class="row">
                        <div class="col">
                            <label for="sunday-checkbox">Sunday & Public Holidays</label>
                            <input type="checkbox" id="sunday-checkbox" class="form-check-input form-control"
                            v-model="building.openingTimes.holidays.open" />
                        </div>
                        <div class="col">
                            <label for="sunday-open">Opening Time</label>
                            <input type="time" id="sunday-open" class="form-control"
                            v-model="building.openingTimes.holidays.times[0]" 
                            :disabled="!building.openingTimes.holidays.open"/>
                        </div>
                        <div class="col">
                            <label for="sunday-close">Closing Time</label>
                            <input type="time" id="sunday-close" class="form-control"
                            v-model="building.openingTimes.holidays.times[1]" 
                            :disabled="!building.openingTimes.holidays.open"/>
                        </div>
                    </div>

                    <!-- Note -->
                    <div class="mt-3">
                        <label for="timeNoteInput" class="form-label">Note <small>(optional)</small></label>
                        <input id="timeNoteInput" type="text" class="form-control" 
                        v-model="building.openingTimes.note">
                    </div>
                </div>

                <div class="col">
                    <Timebox
                        :times="building.openingTimes"/>
                </div>
            </div>

            <!-- Infobox -->
            <div class="row mt-3">
                <div class="col">
                    <AdminInfobox
                    :contentArray="infoBoxContent"
                    :activeInfoTab="activeInfoBoxTab"
                    @tabChanged="activeInfoBoxTab = $event"
                    @contentChanged="updateInfoBoxContent($event)"
                    @modalOpen="markdownModalOpen = $event"
                    />
                </div>
                <div class="col">
                    <Infobox
                    :contentArray="infoBoxContent"
                    :activeInfoTab="activeInfoBoxTab"
                    @tabChanged="activeInfoBoxTab = $event"
                    @contentChanged="updateInfoBoxContent($event)"
                    />
                </div>
            </div>
            

        <!-- Tips -->

        <!-- Additional Information -->


        </div>
        <AdminMarkdownModal 
        :modalOpen="markdownModalOpen" 
        @modalClose="markdownModalOpen = false"
        />

    </NuxtLayout>
</template>

<script lang="ts">

    import bld from '~/assets/example-data';
    import { Building } from '~/assets/types/Building';

    import { InfoBoxContentTab } from '~/assets/types/infoPageTypes';

    export default {
        data() {
            return {
            building: {} as Building,
            infoBoxContent: [] as InfoBoxContentTab[],
            activeInfoBoxTab: 0,
            markdownModalOpen: false,
            }
        },
        created() {
            // Deep copy the building object to avoid changing the original
            this.building = JSON.parse(JSON.stringify(bld));
            this.infoBoxContent = [
                {
                    title: "Sound",
                    content: this.building.sounds,
                },
                {
                    title: "Lights",
                    content: this.building.lights,
                },
                {
                    title: "Experience",
                    content: this.building.experience,
                },
                {
                    title: "Sensory Spaces",
                    content: this.building.respite,
                },
                {
                    title: "Physical Access",
                    content: this.building.physicalAccess,
                },
            ];
        },
        methods: {
            // This function is called when the user changes the content of the infoBox
            // Because of the way the infobox is handled, we need to update the building object manually
            updateInfoBoxContent(newContent: InfoBoxContentTab[]) {
                this.infoBoxContent = newContent;
                this.building.sounds = this.infoBoxContent[0].content;
                this.building.lights = this.infoBoxContent[1].content;
                this.building.experience = this.infoBoxContent[2].content;
                this.building.respite = this.infoBoxContent[3].content;
                this.building.physicalAccess = this.infoBoxContent[4].content;
            },

            // This function is called when the user clicks the "Save" button
            // It will save the current state of the building to the database
            saveBuilding() {},

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {},

            // This function checks the current state of the building against the state it was in when the page was loaded
            // It returns true if the building has been changed, and false if it has not
            isBuildingChanged() {},

            // This function compares the current state of the building against the state it was in when the page was loaded
            // It returns a list of the fields that have been changed
            getChanges() {},

            // This function adds a log entry to the database
            logChange() {},
        },
    }

    definePageMeta({
        middleware: 'auth'
    })


</script>

<style>

</style>