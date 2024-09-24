<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'buildings'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <!-- Sidebar for building selection -->
            <AdminEntitySelector 
            @activeEntityChanged="getBuilding($event)"
            entityType="building"
            :permissions="user"
            :supabase_client="supabase"
            :updateCount="building_list_refresh_token"/>
            <!-- Main section for editing -->
            <div class="pt-0 px-4 w-100" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between sticky-top bg-light">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Building Management | 
                        <!-- Input for canonical, only if the user is the superadmin -->
                        <div v-if="checkPermission('canonical')" class="ms-2">
                            <!-- The field should only be editable if the building is unpublished -->
                            <input type="text" 
                            id="canonical"
                            :class="building.published ? 'bg-yellow-100' : 'bg-white'"
                            class="form-control fs-5 border font-monospace border-success" 
                            v-model="building.canonical"
                            title="Change the page URL. This can only be done while the building is unpublished"
                            :disabled="building.published">
                        </div>
                        <span class=" p-1 ms-2 border font-monospace border-success bg-yellow-100 fs-4" v-else>
                            <NuxtLink
                            :to="'/info/' + building.canonical"
                            class="link-dark text-decoration-none">
                                {{ building.canonical }}
                            </NuxtLink>
                        </span>
                    </h1>

                    <!-- Construction Badge -->
                    <div class="d-flex align-items-center m-3 fs-5">
                        <button 
                        type="button" 
                        :disabled="!checkPermission('published')"
                        class="btn me-2" 
                        :class="building.published ? 'btn-danger' : 'btn-outline-success'"
                        @click="confirmChangePublishStatus()">
                            {{ building.published ? "Unpublish" : "Publish" }}
                        </button>
                        
                        <div class="btn-group" role="group">
                            <button 
                            type="button" 
                            class="btn" 
                            :class="buildingHasBeenChanged ? 'btn-success' : 'btn-outline-secondary'"
                            @click="updateBuilding()"
                            :disabled="!buildingHasBeenChanged">
                                Save Changes
                            </button>

                            <button 
                            type="button" 
                            class="btn"
                            :class="buildingHasBeenChanged ? 'btn-warning' : 'btn-outline-secondary'"
                            @click="cancelChanges()"
                            :disabled="!buildingHasBeenChanged">
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Main Matter -->
                <!-- Don't render anything until some data has been pulled -->
                <div class="mainMatter-admin" v-if="building.display_name">
                    <!-- Two columns -->
                    <!-- Column 1 contains input boxes -->
                    <!-- Column 2 contains infoPage components -->
                    <!-- The input boxes are paired to the components to allow for live editing -->
                    <!-- The input boxes and components are left aligned in their respective colum -->
                
                    <!-- <Summary> -->
                    <div class="row border-b">
                        <!-- Input -->
                        <div class="col d-flex flex-column">
                            <!-- Building Name -->
                            <div class="mb-3">
                                <label for="TitleInput" class="form-label">Building Name</label>
                                <input id="TitleInput" type="text" class="form-control" 
                                :disabled="!checkPermission('display_name')"
                                v-model="building.display_name">
                            </div>

                            <!-- Aka -->
                            <div class="mb-3">
                                <label for="AkaInput" class="form-label">AKA <small>(optional)</small></label>
                                <input id="AkaInput" type="text" class="form-control"  
                                :disabled="!checkPermission('aka')"
                                v-model="building.aka">
                            </div>

                            <!-- Primary Image -->
                            <div class="mb-3">
                                <label for="PrimaryImageInput" class="form-label">Primary Image</label>
                                <input id="PrimaryImageInput" type="file" class="form-control" 
                                :disabled="!checkPermission('primary_image_url')"
                                @change="handlePrimaryImageSelect">
                            </div>
                            <!-- Primary image alt text -->
                            <div class="mb-3">
                                <label for="PrimaryImageAltInput" class="form-label">Primary Image Alt Text</label>
                                <input id="PrimaryImageAltInput" type="text" class="form-control" 
                                :disabled="!checkPermission('primary_image_alt')"
                                v-model="building.primary_image_alt">
                            </div>
                        </div>

                        <!-- Preview -->
                        <div class="col">
                            <!-- Name -->
                            <div class="info-page-title" style="grid-area: title;">
                                <h1>{{building.display_name}}</h1>
                                <p v-if="building.aka" id="aka" style="display:block"><b>Also Known as:</b> {{building.aka}}</p>
                            </div>

                            <!-- Primary Image -->
                            <div class="mb-3">
                                <!-- MainPicure component preprocesses for null image, so we can't use it -->
                                <!-- Because we want to dynamically change the image and alt text -->
                                <img 
                                class="primary-image-preview"
                                :src="building.primary_image_url"
                                :alt="building.primary_image_alt">
                            </div>    
                        </div>
                    </div>

                                <!-- Description -->
                    <div class="row border-bottom mb-3">
                        <!-- Input -->
                        <div class="col">
                            <label for="descInput" class="form-label">Description</label>
                            <textarea class="form-control" id="descInput" rows="4" 
                            :disabled="!checkPermission('description')"
                            v-model="building.description"></textarea>
                        </div>
                        <!-- Preview -->
                        <div class="col" id="description" style="grid-area: desc; justify-self: start;">
                            <h3>Description</h3>
                            <p>{{building.description}}</p>
                        </div>
                    </div>
                           
                
                    <!-- Opening Times -->
                    <div class="row mt-3 pb-3 border-bottom"><label class="form-label d-block">Opening Times</label>
                        <div class="col d-flex flex-column">
                            <!-- Weekdays -->
                            <div class="row">
                                <div class="col">
                                    <label for="weekDay-checkbox" >Weekdays</label>
                                    <input type="checkbox" id="weekDay-checkbox" class="form-check-input form-control"
                                    :disabled="!checkPermission('opening_times')"
                                    v-model="building.opening_times.weekday.open" />
                                </div>
                                <div class="col">
                                    <label for="weekDay-open">Opening Time</label>
                                    <input type="time" id="weekDay-open" class="form-control"
                                    v-model="building.opening_times.weekday.times[0]" 
                                    :disabled="!building.opening_times.weekday.open && !checkPermission('opening_times')"/>
                                </div>
                                <div class="col">
                                    <label for="weekDay-open">Closing Time</label>
                                    <input type="time" id="weekDay-open" class="form-control"
                                    v-model="building.opening_times.weekday.times[1]" 
                                    :disabled="!building.opening_times.weekday.open && !checkPermission('opening_times')"/>
                                </div>
                            </div>
                            <!-- Saturdays -->
                            <div class="row">
                                <div class="col">
                                    <label for="sat-checkbox">Saturday</label>
                                    <input type="checkbox" id="sat-checkbox" class="form-check-input form-control"
                                    :disabled="!checkPermission('opening_times')"
                                    v-model="building.opening_times.sat.open" />
                                </div>
                                <div class="col">
                                    <label for="sat-open">Opening Time</label>
                                    <input type="time" id="sat-open" class="form-control"
                                    v-model="building.opening_times.sat.times[0]" 
                                    :disabled="!building.opening_times.sat.open && !checkPermission('opening_times')"/>
                                </div>
                                <div class="col">
                                    <label for="sat-close">Closing Time</label>
                                    <input type="time" id="sat-close" class="form-control"
                                    v-model="building.opening_times.sat.times[1]" 
                                    :disabled="!building.opening_times.sat.open && !checkPermission('opening_times')"/>
                                </div>
                            </div>
                            <!-- Sundays -->
                            <div class="row">
                                <div class="col">
                                    <label for="sunday-checkbox">Sunday & Public Holidays</label>
                                    <input type="checkbox" id="sunday-checkbox" class="form-check-input form-control"
                                    :disabled="!checkPermission('opening_times')"
                                    v-model="building.opening_times.holidays.open" />
                                </div>
                                <div class="col">
                                    <label for="sunday-open">Opening Time</label>
                                    <input type="time" id="sunday-open" class="form-control"
                                    v-model="building.opening_times.holidays.times[0]" 
                                    :disabled="!building.opening_times.holidays.open && !checkPermission('opening_times')"/>
                                </div>
                                <div class="col">
                                    <label for="sunday-close">Closing Time</label>
                                    <input type="time" id="sunday-close" class="form-control"
                                    v-model="building.opening_times.holidays.times[1]" 
                                    :disabled="!building.opening_times.holidays.open && !checkPermission('opening_times')"/>
                                </div>
                            </div>

                            <!-- Note -->
                            <div class="mt-3">
                                <label for="timeNoteInput" class="form-label">Note <small>(optional)</small></label>
                                <input id="timeNoteInput" type="text" class="form-control" 
                                :disabled="!checkPermission('opening_times')"
                                v-model="building.opening_times.note">
                            </div>
                        </div>

                        <div class="col">
                            <Timebox
                                :times="building.opening_times"/>
                        </div>
                    </div>

                    <!-- Infobox -->
                    <div class="row mt-3 border-bottom">
                        <div class="col">
                            <!-- Sensory -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                    :disabled="!checkPermission('sense_exp_display')"
                                    v-model="building.sense_exp_display" id="SenseDisplay">
                                    <label class="form-check-label" for="SenseDisplay">
                                        Sensory Experience
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                :disabled="!checkPermission('sense_exp')"
                                v-model="building.sense_exp"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Sensory Experience Youtube link</small></label> -->
                                    <input id="videolink" type="text" class="form-control" 
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    :disabled="!checkPermission('sense_exp_video')"
                                    v-model="building.sense_exp_video">
                                </div>
                            </div>
                            <!-- Wayfinding -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                    :disabled="!checkPermission('wayfinding_display')"
                                    v-model="building.wayfinding_display" id="WayfindDisplay">
                                    <label class="form-check-label" for="WayfindDisplay">
                                        Wayfinding
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                :disabled="!checkPermission('wayfinding')"
                                v-model="building.wayfinding"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Sensory Experience Youtube link</small></label> -->
                                    <input id="videolink" type="text" class="form-control" 
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    :disabled="!checkPermission('wayfinding_video')"
                                    v-model="building.wayfinding_video">
                                </div>
                            </div>
                            <!-- Physical -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" 
                                    :disabled="!checkPermission('phys_access_display')"
                                    v-model="building.phys_access_display" id="PhysicalDisplay">
                                    <label class="form-check-label" for="PhysicalDisplay">
                                        Physical Experience
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                :disabled="!checkPermission('phys_access')"
                                    v-model="building.phys_access"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Youtube link</small></label> -->
                                    <input id="videolink" type="text" class="form-control"
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    :disabled="!checkPermission('phys_access_video')"
                                    v-model="building.phys_access_video">
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <Infobox
                            :contentArray="infoBoxContent"
                            />
                        </div>
                    </div>
                    
                    <!-- Tips -->
                    <div class="row mt-3 pb-3 border-bottom">
                        <!-- Edit -->
                        <div class="col">
                            <!-- Loop through the tips as text inputs -->
                            <div class="mb-3">
                                <div v-for="(tip, index) in building.tips" :key="index" class="input-group mb-2">
                                    <input type="text" class="form-control" 
                                    :disabled="!checkPermission('tips')"
                                    v-model="building.tips[index]" placeholder="New Tip">
                                    <button 
                                    :disabled="!checkPermission('tips')"
                                    class="btn btn-warning" type="button" @click="removeTip(index)">Remove</button>
                                </div>
                                <!-- Button to add a new tip -->
                                <button 
                                :disabled="!checkPermission('tips')"
                                class="btn btn-success" type="button" @click="addTip()">Add Tip</button>
                            </div>
                            
                        </div>
                        <!-- Display -->
                        <div class="col" v-if="building.tips.length > 0">
                            <AccessTips :tips="building.tips" entity="building"/>
                        </div>
                        <div class="col" v-else>
                            <!-- <p><em> &lt;&lt; Tip box will not display >> </em></p> -->
                        </div>
                        
                    </div>


                <!-- Additional Information -->
                    <div class="row mt-3 border-b">
                        <!-- Edit -->
                        <div class="col">
                            <div class="form-check">
                                <input 
                                :disabled="!checkPermission('furtherinfo_display')"
                                class="form-check-input" type="checkbox" v-model="building.furtherinfo_display" id="furtherInfoDisplay">
                                <label class="form-check-label" for="furtherInfoDisplay">
                                    Further Information
                                </label>
                            </div>
                            <textarea class="form-control" id="descInput" rows="4" 
                            :disabled="!checkPermission('further_info')"
                            v-model="building.further_info"></textarea>
                        </div>
                        <!-- Display -->
                        <div class="col">
                            <div
                            v-if="building.furtherinfo_display">
                                <AdditionalInfo 
                                :info="building.further_info"/>
                            </div>
                        </div>
                    </div>

                    <!-- Map Preview-->
                    <div class="map-section border-top border-1 border-black pt-3 mt-3" v-if="building.geometry">
                        <!-- Inputs -->
                        <div style="grid-area: 'input';" class="me-2">    
                            <!-- Views -->
                            <div>
                                <span class="d-block">Center map</span>
                                <button 
                                type="button" 
                                class="btn btn-sm btn-outline-primary mx-1" 
                                @click="centerViewOnCampus()">
                                    Campus
                                </button>

                                <button 
                                type="button" 
                                class="btn btn-sm btn-outline-primary mx-1" 
                                @click="centerViewOnBuilding()">
                                    Building
                                </button>
                            </div>
                            <!-- Labels -->
                            <div class="mt-3">
                                <label for="coordinates">Primary Label</label>
                                <input  
                                :disabled="!checkPermission('map_label_1')"
                                @input="updateCurrentBuildingLabels()"
                                type="text" class="form-control mb-2" v-model="building.map_label_1">
                                
                                    <label for="coordinates">Secondary Label</label>
                                <input  
                                :disabled="!checkPermission('map_label_2')"
                                @input="updateCurrentBuildingLabels()"
                                type="text" class="form-control" v-model="building.map_label_2">
                                
                                    <!-- <label for="coordinates">Tertiary Label</label>
                                <input  
                                :disabled="!checkPermission('map_label_3')"
                                    type="text" class="form-control" v-model="building.map_label_3"> -->
                            </div>
                            <!-- Display Settings -->
                            <div class="form-check mb-3 mt-3" title="Select for satellite buildings that are not already included in an overlay">
                                <input  
                                :disabled="!checkPermission('always_display')"
                                class="form-check-input" type="checkbox" v-model="building.always_display" id="always_display">
                                <label class="form-check-label" for="always_display">
                                    Always Display
                                </label>
                            </div>
                            <!-- Lat and long inputs -->
                            <div class="mb-3">
                                <label for="coordinates">Building Shape</label>
                                <textarea 
                                :disabled="!checkPermission('geometry')"
                                class="form-control" 
                                id="coordinates" 
                                rows="4" 
                                :value="JSON.stringify(building.geometry.coordinates)">
                                </textarea>
                                <p class="fst-italic mb-0 my-1">To update building shape, copy and paste coordinates from geometryEdit into the above box</p>
                                <a  
                                class="btn btn-sm btn-secondary mx-1 mt-1" 
                                :href="'/geometryEdit?building='+building.canonical" target="_blank">
                                    geometryEdit
                                </a>
                                <button 
                                :disabled="!checkPermission('geometry')"
                                title="Warning: Confirm new geometry renders as expected in preview before saving"
                                type="button" 
                                class="btn btn-sm btn-warning mx-1 mt-1" 
                                @click="updateBuildingGeometry()">
                                    Update geometry
                                </button>
                            </div>
                        </div>
                        <!-- Map -->
                        <div style="grid-area: 'input';">
                            <span class="fw-bold">{{hover.active ? hover.space : "Hover over space or building to see what it is"}}</span>
                            <div id="building-placement-map" style="height: 600px; padding-top: 30px; "></div>
                        </div>
                    </div>
                    <!-- <AdminBuildingGeometryEdit v-if="mapDataLoaded()"
                    :building="building"
                    :checkPermission="checkPermission"
                    :buildings_list="buildings_list" 
                    :space_types="space_types"
                    :spaces_list="spaces_list"
                    :overlays="overlays"
                    ></AdminBuildingGeometryEdit> -->
                    <p></p>
                    <!-- Gallery -->
                    <div class="row">
                        <h3 class="mt-3">Gallery Images</h3>

                        <table class="table w-100 mx-2">
                            <thead>
                                <tr>
                                    <th scope="col">File</th>
                                    <th scope="col">Alt Text <span class="fw-normal text-danger text-small">*Required</span></th>
                                    <th scope="col">Caption</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(image, index) in gallery">
                                    <td style="white-space: nowrap; text-overflow: ellipsis; overflow: clip; max-width: 400px;">
                                        <a :href="image.url" target="_blank"> {{ image.url }}</a>
                                    </td>
                                    <td><input 
                                    :disabled="!checkPermission('alt', 'building_gallery_images')"
                                    type="text" placeholder="Alt Text" v-model="image.alt"></td>
                                    <td><input 
                                    :disabled="!checkPermission('caption', 'building_gallery_images')"
                                    type="text" placeholder="Caption" v-model="image.caption"></td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            <!-- Save -->
                                            <!-- To be a valid edit, alt must be provided -->
                                            <button 
                                            type="button" 
                                            class="btn" 
                                            :class="galleryImageHasBeenChanged(index) ? 'btn-success' : 'btn-outline-secondary'"
                                            @click="updateGalleryImage(index)"
                                            :disabled="!(galleryImageHasBeenChanged(index) && image.alt.length > 0)">
                                                Save Changes
                                            </button>
                                            <!-- Cancel -->
                                            <button 
                                            type="button" 
                                            class="btn"
                                            :class="galleryImageHasBeenChanged(index) ? 'btn-warning' : 'btn-outline-secondary'"
                                            @click="revertGalleryImage(index)"
                                            :disabled="!galleryImageHasBeenChanged(index)">
                                                Cancel
                                            </button>
                                            <!-- Delete -->
                                            <button 
                                            :disabled="!checkPermission('url', 'building_gallery_images')"
                                            class="btn btn-danger" 
                                            type="button" 
                                            title="This cannot be undone"
                                            @click="removeGalleryImage(index, image.url)">Remove</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input 
                                        :disabled="!checkPermission('url', 'building_gallery_images')"
                                        type="file" 
                                        id="myFile" 
                                        name="newGalleryImage" 
                                        accept="image/png, image/jpg, image/jpeg"
                                        @change="handleFileUpload">
                                    </td>
                                    <td><input 
                                        :disabled="!checkPermission('url', 'building_gallery_images')"
                                        type="text" placeholder="Alt Text" v-model="newGalleryImage.alt"></td>
                                    <td><input 
                                        :disabled="!checkPermission('url', 'building_gallery_images')"
                                        type="text" placeholder="Caption" v-model="newGalleryImage.caption"></td>
                                    <td>
                                        <!-- The add button will only become active when a file has been uploaded, and alt text have been provided -->
                                        <button 
                                        class="btn btn-success" 
                                        type="button"
                                        @click="addGalleryImage()"
                                        :disabled="!(newGalleryImage.selectedFile && newGalleryImage.alt.length > 0) && !checkPermission('url', 'building_gallery_images')">
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
                <AdminMarkdownModal 
                :modalOpen="markdownModalOpen" 
                @modalClose="markdownModalOpen = false"
                />
            </div>
        </main>
    </NuxtLayout>
</template>

<script setup>
    
//Script setup needed for UseHead
// import '~/assets/css/leaflet.css'

// useHead({

//     link: [
//         {
//             rel:"stylesheet",
//             href:"https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css"
//         },
//     ],
//     script: [
//         {
//             src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
//             integrity: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
//             crossorigin: "",
//         },
//         {
//             src: 'https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.min.js',
//             body: true,
//         },
//         // {
//         //     src: '/javascript/mapInit.js',
//         //     body: true,
//         // },
//         // {
//         //     src: 'https://unpkg.com/@supabase/supabase-js@2',
//         // },
//         {
//             src: '/javascript/adminMapFunctions.js',
//         },
//         {
//             src: '/javascript/mapFunctions.js',
//         },
//     ]
// });


// const { supabase, session } = await adminSupabaseInit();

// // Add the supabase client to the nuxt app
// const nuxtApp = useNuxtApp();
// nuxtApp.provide('supabase', supabase);

</script>

<script>
import {createClient} from '@supabase/supabase-js';
import getPermissionsKey from "~/assets/permissionsKey"
// @ts-ignore
import * as L from "leaflet";
import '~/assets/css/leaflet.css'
// import "@geoman-io/leaflet-geoman-free";
// import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';
// L.PM.setOptIn(false);

import { addBuildings, addLabelsToMap, addOverlays, addSpaces, addZoomHandling } from '~/utils/adminMapUtils'
// import type { Building, Space, Space_Type, Overlay } from '~/assets/types/supabase_types'
// import type { Building_Partial, Space_Partial } from "~/utils/adminMapUtils";


const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ];

    export default {
        data() {
            return {
                building: {},
                building_clean: {},
                gallery: [],
                gallery_clean: [],
                markdownModalOpen: false,
                supabase: {},
                newGalleryImage: {
                    selectedFile: null,
                    alt: "",
                    caption: "",
                },
                user: {},
                permissionsKey: {},
                permissionsKey_gallery: {},
                building_list_refresh_token: 0,

                // Map stuff
                buildings_list: [],
                space_types: [],
                spaces_list: [],
                overlays: [],
                map: {},
                hover: {
                    active: false,
                    space: ''
                },
                buildingLabels: {},
            }
        },
        created() {
            // Initialise the supabase client
            // const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            // const supabaseKey = useRuntimeConfig().public.supabaseKey;
            // this.supabase = createClient(supabaseUrl, supabaseKey)

            // const { data, error } = this.supabase.auth.getSession();

            // this.session = data;
            
            // Get the supabase client from the nuxt app
            // const nuxtApp = useNuxtApp();
            
            // // this.startSupabase();
            this.supabase = adminSupabaseInit();
            this.getUser();
            // Get the permissionsKey for Buildings
            this.permissionsKey = getPermissionsKey("buildings");
            this.permissionsKey_gallery = getPermissionsKey("building_gallery_images");
            
            // Get the lists of buildings, overlays, and spaces to display on the map
            this.getMapObjects();
            
        },
        computed: {
            infoBoxContent() {
                return setInfoBoxContent(this.building);
            },
            buildingHasBeenChanged() {
                // This function compares the current state of the building against the state it was in when the page was loaded
                return JSON.stringify(this.building) !== JSON.stringify(this.building_clean);
            },
            
        },
        methods: {

            async getMapObjects(){
                // Get the lists of buildings, overlays, and spaces to display on the map
                this.buildings_list = await getBuildingList(this.supabase);
                this.overlays = await getOverlays(this.supabase);
                this.space_types = await getSpaceTypes(this.supabase);
                this.spaces_list = await getSpaces(this.supabase);
            },
            // Resolve the promise of the user object
            // So that we can check the permissions on it
            async getUser(){
                this.user = JSON.parse(JSON.stringify(await getCurrentUserPermissions()));
            },

            checkPermission(permission, table="buildings"){
                // If the user is an admin, they have all permissions on this page
                if (this.user.is_admin){
                    return true;
                }

                // Then check if we're looking at the gallery permissions
                if (table == "building_gallery_images"){
                    return userHasPermission(this.user, this.permissionsKey_gallery, permission);
                }

                // Else, check if the user has the permission to perform an action
                return userHasPermission(this.user, this.permissionsKey, permission);
            },

            updateBuildingGeometry(){
                // Get the value of the geometry textarea
                let newGeometry = JSON.parse(document.getElementById("coordinates").value);
                // Update the building object with the new geometry
                this.building.geometry.coordinates = newGeometry;
                // Update the map with the new building
                this.loadBuildingToMap();
            },

            async loadBuildingToMap(){
                // Wait for the page to be loaded
                while (!this.mapDataLoaded()) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Regenerate and Set up the basics of the map
                this.initMap();

                // Add the editable building to the map
                this.addCurrentBuildingToMap();
                // Add the editable labels to the map
                this.addCurrentBuildingLabelsToMap();

                // Move the view to the building
                this.centerViewOnBuilding();

                
                // Init a callback function to update hover text
                let updateHoverText = (active, text) => {
                    this.hover.active = active;
                    this.hover.space = text;
                }

                // Add the overlays to the map
                // this.map = 
                addOverlays(L, this.map, this.overlays, null, false);

                // Add the buildings to the map
                // this.map = 
                addBuildings(L, this.map, this.buildings_list, this.building, true, updateHoverText);
                addLabelsToMap(L, this.map, this.buildings_list, this.building);

                // Add the other spaces to the map
                // this.map = 
                addSpaces(L, this.map, this.spaces_list, this.space_types, null, true, updateHoverText);
            },

            addCurrentBuildingLabelsToMap(){
                this.buildingLabels = makeLabels(L, this.map, this.building);
            },

            addCurrentBuildingToMap(){
                // Add a new layer to the map for the building
                let building_geojson = {
                    "type": "Feature",
                    "geometry": {
                        "coordinates": this.building.geometry.coordinates,
                        "type": "Polygon"
                    }
                }
                let buildingLayer = L.geoJSON(building_geojson, {
                    style: {
                        color: '#E53397',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.75,
                        fillColor: "#E53397"
                    },
                    // onEachFeature: function(feature, layer) {
                    //     layer.options.pmIgnore = false;
                    //     L.PM.reInitLayer(layer);
                    //     console.log(layer);
                    // }
                })
                // buildingLayer.options.pmIgnore = false;
                // L.PM.reInitLayer(buildingLayer);
                
                buildingLayer.addTo(this.map);

                // this.currentBuildingLayer = buildingLayer;
            },

            initMap(){
                // Check if there is already a map object, remove if there is
                try {
                    this.map.remove();
                }
                catch (error) {
                    console.log("No map to remove");
                }

                // Initialise the map
                let map = L.map('building-placement-map', {
                    zoomSnap: 0.25,
                    zoomDelta: 0.25,
                    maxZoom: 20,
                    renderer: L.canvas({padding: 1}),
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: 'topleft'
                    },
                    // pmIgnore: false,
                }).fitBounds(campusBounds);

                // add Leaflet-Geoman controls with some options to the map  
                // map.pm.addControls({  
                //     position: 'topleft',  
                //     drawControls: false,
                //     cutPolygon: false,
                //     removalMode: false,
                // }); 

                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    maxZoom:20
                }).addTo(map);

                // Cheap debug
                // map.on('click', function(e) {
                //     let cheapDebugObject = {
                //         latlng: e.latlng,
                //         bounds: map.getBounds(),
                //         zoom: map.getZoom(),
                //         center: map.getCenter()
                //     }
            
                //     console.log(cheapDebugObject);
                    
                // });

                // map.on("pm:enable", function(e) {
                //     console.log("pm:enable", e);
                // });

                // Add zoom handling
                addZoomHandling(map);

                // // Add the current building to the map
                // this.addCurrentBuildingToMap(map);

                this.map = map;
                // return map;

            },

            updateCurrentBuildingLabels(){
                // Remove the current labels from the map
                this.buildingLabels.primary_label?.remove();
                this.buildingLabels.secondary_label?.remove();
                this.buildingLabels.tertiary_label?.remove();
                // Add the new labels to the map
                this.addCurrentBuildingLabelsToMap();
            },

            centerViewOnCampus(){
                // When called, update the map to be centred on the campus
                this.map.fitBounds(campusBounds);
            },

            centerViewOnBuilding(){
                // When called, update the map to be centred on the building
                this.map.setView(getGeometricCenter(this.building.geometry.coordinates), 18);
            },

            confirmChangePublishStatus(){
                // Confirm the user wants to change the publish status
                if (window.confirm(`Are you sure you want to ${this.building.published ? "unpublish" : "publish"} ${this.building.display_name}?`)){
                    // If they do, update the space
                    this.changePublishStatus();
                }
            },

            async changePublishStatus(){
                // Change the publish status of the space
                // This happens instantly, outside of the normal save process

                // Get the session access token
                const access_token = await getSessionAccessToken(this.supabase);
                // Set up a dummy building object to toggle the published status
                let dummyBuilding = JSON.parse(JSON.stringify(this.building_clean));
                dummyBuilding.published = !dummyBuilding.published;

                // Update the space in the database
                const { data, error } = await updateTable(
                    access_token, 
                    "buildings", 
                    dummyBuilding,
                    {col: "UUID", eq: this.building.UUID},
                )
                if(error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                // If the update was successful, update the clean building object
                this.building_clean.published = !this.building_clean.published;
                this.building.published = JSON.parse(JSON.stringify(this.building_clean.published));
                alert(this.building.display_name + " has been " + (this.building.published ? "published" : "unpublished"));

                // Refresh the building list
                this.building_list_refresh_token += 1;

            },

            // This function is called when the user clicks the "Save" button
            // It will save the current state of the building to the database
            async updateBuilding() {
                // Deep copy the building object, as things get messy otherwise
                let update_vehicle = JSON.parse(JSON.stringify(this.building));

                // Check if the canonical name has been changed
                // Confirm with a dialog box if it has
                if (this.building.canonical != this.building_clean.canonical){
                    if (!window.confirm("Changing the canonical name will break all links to this building. Are you sure you want to do this?")){
                        return;
                    }
                }

                // If the primary image has been changed, upload the new image and update the url
                try {
                    if (document.getElementById("PrimaryImageInput").files[0]) {
                        // If the primary image has been changed, upload the new image and update the url, and the alt
                        // If uploading the primary image fails, we don't want to update the alt
                        update_vehicle.primary_image_url = await this.uploadNewPrimaryImage();
                        update_vehicle.primary_image_alt = this.building.primary_image_alt;
                    }
                    else{
                        // If the primary image has not been changed, update the alt
                    }
                }
                catch (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }

                // Update the building in the database
                const access_token = await getSessionAccessToken(this.supabase);
                const {data, error} = await updateTable(access_token, "buildings", update_vehicle, {col: "UUID", eq: this.building.UUID})
                
                // If there is an error, log it
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // If the update was successful, update the clean building object
                    this.building_clean = JSON.parse(JSON.stringify(this.building));
                    alert(this.building.display_name + " updated successfully")
                    console.log(data)
                }

                // Refresh the building list
                this.building_list_refresh_token += 1;
            },

            handlePrimaryImageSelect(evt) { 
                // Get the file from the input
                // Set the primary image to the file to preview
                const file = evt.target.files[0];
                this.building.primary_image_url = URL.createObjectURL(file);
            },

            async uploadNewPrimaryImage(){
                // Get the file object from the primary image upload input
                // Upsert to the storage bucket as the canonical name
                // TODO: Check if the file already exists under a different extension, and if so, delete it

                // Get the file
                let file = document.getElementById("PrimaryImageInput").files[0];
                // Get the file extension
                let extension = file.name.split('.').pop();
                
                // Build the new url for the file
                let newUrl = this.supabase.storageUrl + "/object/public/primary-images/" + this.building.canonical + "." + extension;

                // Upload the file to the storage bucket
                const { data, error:upload_error } = await this.supabase.storage
                .from('primary-images')
                .upload(`${this.building.canonical}.${extension}`, file)
                if (upload_error) {
                    console.error(upload_error)
                    return error
                }
                
                // Clear the primary image input
                document.getElementById("PrimaryImageInput").value = "";

                return newUrl;

            },

            // Function to add a new gallery image to the building
            async addGalleryImage() {
                // Get the file from the input
                const file = document.getElementById("myFile").files[0];
                // Upload the file to the storage bucket
                // Get the URL of the uploaded file
                const { data, error:upload_error } = await this.supabase.storage
                .from('gallery-images')
                .upload(`${this.building.canonical}/${file.name}`, file)
                if (upload_error) {
                    console.error(upload_error)
                    alert(upload_error.message)
                    throw upload_error
                }
                console.log(data)
                // Create a new image object
                const baseURL = this.supabase.storageUrl + "/object/public/gallery-images/";
                let newImage = {
                    url: baseURL + data.path,
                    alt: this.newGalleryImage.alt,
                    caption: this.newGalleryImage.caption,
                }

                // Add the image to the database
                // let { data: img, error:db_insert_error } = await this.supabase
                //     .from('building_gallery_images')
                //     .insert([
                //         { 
                //             building: this.building.canonical,
                //             url: newImage.url,
                //             alt: newImage.alt,
                //             caption: newImage.caption,
                //         }
                //     ])

                
                // Add gallery image to the database
                const access_token = await getSessionAccessToken(this.supabase);
                const {data: img, error:db_insert_error} = await insertToTable(
                    access_token, 
                    "building_gallery_images", 
                    { 
                        building: this.building.canonical,
                        url: newImage.url,
                        alt: newImage.alt,
                        caption: newImage.caption,
                    }
                )
                

                if (db_insert_error) {
                    console.error(db_insert_error)
                    alert(db_insert_error.message)
                    throw db_insert_error
                }
                // Add a copy of the image to the gallery array
                this.gallery.push(JSON.parse(JSON.stringify(newImage)))
                // And to the clean gallery
                this.gallery_clean.push(JSON.parse(JSON.stringify(newImage)))
                

            },
            handleFileUpload(event) {
                this.newGalleryImage.selectedFile = event.target.files[0];
            },

            // Function to remove a gallery image from the building
            async removeGalleryImage(index, url) {
                // Remove the image from the gallery array
                this.gallery.splice(index, 1);
                // And from the clean copy
                this.gallery_clean.splice(index, 1);
                
                // Remove the database entry
                const access_token = await getSessionAccessToken(this.supabase);
                const {data: img, error:db_delete_error} = await removeFromTable(
                    access_token, 
                    "building_gallery_images", 
                    { 
                        col: 'url', 
                        eq: url,
                    }
                )
                

                if (db_delete_error) {
                    console.error(db_delete_error)
                    alert(db_delete_error.message)
                    throw db_delete_error
                }

                // Get the path by subtracting the supabase url from the image url
                let path = url.replace(this.supabase.storageUrl + "/object/public/gallery-images/", "");
                console.log(path)
                // Delete the image from the storage bucket
                const { data:storage_response, error:storage_error } = await this.supabase.storage
                .from('gallery-images')
                .remove([path])

                if (storage_error) {
                    console.error(storage_error)
                    alert(storage_error.message)
                    throw storage_error
                }
                console.log("storage_response")
                console.log(storage_response)

                alert("Image deleted successfully")
            },

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {

                // Deep copy the building_clean object back into the building object
                this.building = JSON.parse(JSON.stringify(this.building_clean));

                // Clear the primary image input
                document.getElementById("PrimaryImageInput").value = "";

            },

            // This function fetches the building from the database based on it's canonical name
            async getBuilding(canonical){
                console.log("Fetching building: " + canonical);

                // Fetch the building from the database
                // Since we are using the canonical name, we should only get one result
                let { data: bld, error } = await this.supabase
                    .from('buildings')
                    .select('*')
                    .eq('canonical', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    
                    // Fill in the gaps with sensible defaults, but only on hot copy
                    // This will highlight to the user when a field is about to be set to a default
                    this.building = this.fillInTheGaps( JSON.parse( JSON.stringify(bld[0]) ) );

                    // Grab all the images for this building, attach them to the building object
                    this.getGallery(canonical);

                    // Deep copy the building object so we have comparison data
                    this.building_clean = JSON.parse(JSON.stringify(this.building));
                    
                    // Update the map to show the building
                    // Wait for the space_types and buildings list to have loaded first
                    while (!this.mapDataLoaded()) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    // Now we have the space types and buildings, we can load the space to the map
                    this.loadBuildingToMap();

                }
                
            },
            mapDataLoaded(){

                // Checks if the arrays for the map data have been populated
                // Returns true if all are populated, false otherwise
                if (this.space_types.length == 0) return false; 
                if(this.buildings_list.length == 0) return false;
                if(this.spaces_list.length == 0) return false;
                if(this.overlays.length == 0) return false;
                if(document.getElementById("building-placement-map") == null) return false;

                return true

            },

            // this function fetches all the images for a given building
            async getGallery(canonical){
                let { data: imgs, error } = await this.supabase
                    .from('building_gallery_images')
                    .select('*')
                    .eq('building', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // console.log(imgs);
                    this.gallery = JSON.parse(JSON.stringify(imgs));
                    this.gallery_clean = JSON.parse(JSON.stringify(imgs));
                }
            },
            galleryImageHasBeenChanged(index){
                // Check the gallery images array against the clean copy
                return JSON.stringify(this.gallery[index]) !== JSON.stringify(this.gallery_clean[index]);
            },

            revertGalleryImage(index){
                // Deep copy the clean copy back into the gallery
                this.gallery[index] = JSON.parse(JSON.stringify(this.gallery_clean[index]));

            },


            // Once a building has been fetched, this function will fill in any gaps in object data
            // For example, if a building has no opening times, this function will add sensible defaults
            // and will generate a full empty template for new buildings
            // Protects against render errors when fields are updated
            fillInTheGaps(b){

                // Deep copy the building
                let gapsFilled = JSON.parse( JSON.stringify(b) );

                // Cycle through every section of the model
                // If no data exists, populate with a sensible default
                // Display Name
                if (!b.display_name) gapsFilled.display_name = "Building Name";
                // Description
                if (!b.description) gapsFilled.description = "Descritpion";
                
                // Opening Times
                if (!b.opening_times) gapsFilled.opening_times = {
                    weekday: {
                        open: false,
                        times: ["08:00", "17:00"],
                    },
                    sat: {
                        open: false,
                        times: ["08:00", "17:00"],
                    },
                    holidays: {
                        open: false,
                        times: ["08:00", "17:00"],
                    },
                    note: "",
                }
                  
                return gapsFilled;

            },
            
            // This function adds a new tip to the building
            addTip() {
                this.building.tips.push("");
            },

            // This function removes a tip from the building
            removeTip(index) {
                this.building.tips.splice(index, 1);
            },
        },
    }

</script>

<style>

.primary-image-preview{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.3), -5px -5px 15px rgba(0,0,0,0.1);
    width: min(25rem, calc(100vw - 6rem));
    margin: 0 min(3rem, 3vw) 0 min(3rem, 3vw);
}

</style>