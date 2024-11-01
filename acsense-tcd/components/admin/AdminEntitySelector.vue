<template>
    <!-- Container for the sidebar -->
    <div class="d-flex flex-column flex-shrink-0 py-3 px-1 border-end border-secondary-subtle bg-body-tertiary position-sticky">
        <!-- Filter bar for entities -->
        <input 
        id="new-entity" 
        type="text" 
        class="form-control m-1 ms-0 me-2" 
        placeholder="Filter..." 
        @input="search()"
        v-model="searchTerm">
        <!-- Scrolling section -->
        <div class=" entity-selection-sidebar">
            <!-- TODO: Squash into one component with buildings that takes the list as an input -->
            <!-- Pulling the data at the component level is really dumb -->
            <ul class="nav nav-pills flex-column mb-auto">
                <!-- Highlight the active page by matching it to the activeEntity -->
                <li v-for="entity in entities" style="max-width: 100%;">
                    <div
                    @click="changeEntity(entity)"
                    class="nav-link link-body-emphasis text-decoration-none entity-selection"
                    :class="{
                        'bg-blue-300': entity.canonical === activeEntity.canonical, 
                        'fst-italic': !entity.published, 
                        'bg-yellow-100': !getPublishedStatus(entity) && entity.canonical !== activeEntity.canonical,
                        'text-muted pe-none': disabled
                        }"
                    style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
                    :title="entityType == 'space' ? (entity as Space_List_Item).name : (entity as Building_List_Item).display_name">
                        <span>{{entityType == 'space' ? (entity as Space_List_Item).name : (entity as Building_List_Item).display_name}}</span> <br>
                        <span class="font-monospace" style="font-size: 0.8rem;">{{ entity.canonical }}</span>
                    </div>
                </li>
            </ul>
            <!-- We only want to display the new entity field on the primary list -->
            <!-- If we're using a secondary published indicator, then we aren't on the primary list -->
            <div v-if="published_field == 'published'">
                <hr>
                <div class="input-group" v-if="permissions.is_admin">
                    <input id="new-entity" type="text" class="form-control" 
                    :placeholder="'new-' + entityType + 'ID'" 
                    aria-label="New Entity" aria-describedby="button-addon2"
                    v-model="newEntityID">
                    <button 
                    :disabled="!newEntityIDValid" 
                    class="btn"
                    :class="{'btn-primary': newEntityIDValid, 'btn-outline-secondary': !newEntityIDValid}" 
                    type="button" 
                    @click="NewEntity"
                    title="new ID must be at least 5 characters">
                        +
                    </button>
                </div>
            </div>
            <!-- <div class="form-text" style="font-size: 0.75em;">spaceID cannot be updated</div> -->
        </div>
    </div>
</template>
    
<script lang="ts">
    import {createClient} from '@supabase/supabase-js';
    import Fuse from 'fuse.js';
    import { space_template, building_template } from '~/assets/templates';
import type { Building_Template, Space_Template } from '~/assets/types/supabase_types';
    
    type Space_List_Item = {
        name: string,
        canonical: string,
        published: boolean,
    }

    type Building_List_Item = {
        display_name: string,
        canonical: string,
        published: boolean,
        rooms_published: boolean,
        floorplans_published: boolean,
    }

    
    
    export default {
        props: {
            permissions: {
                type: Object,
                required: true
            },
            updateCount: { // Dummy prop to force a refresh
                type: Number,
                required: false
            },
            supabase_client: {
                type: Object,
                required: true
            },
            entityType: {
                type: String,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            published_field: {
                type: String as () => "rooms_published" | "floorplans_published" | "published",
                default: 'published'
            }
        },
        watch: {
            updateCount: function() {
                this.getListOfEntities()
            }
        },
        data() {
            return {
                newEntityID: '',
                activeEntity: {} as (Space_List_Item | Building_List_Item),
                entities: [] as (Space_List_Item | Building_List_Item)[],
                entities_clean: [] as (Space_List_Item | Building_List_Item)[],
                searchTerm: '',
            }
        },
        created() {
            this.getListOfEntities()
        },
        computed: {
            newEntityIDValid() {
                return this.newEntityID.length > 4
            }
        },
        methods: {
            getPublishedStatus(entity: Space_List_Item | Building_List_Item) {
                if (this.published_field == 'rooms_published') {
                    // The published field would only be set for buildings
                    // @ts-ignore
                    return entity.rooms_published
                }
                if (this.published_field == 'floorplans_published') {
                    // The published field would only be set for buildings
                    // @ts-ignore
                    return entity.floorplans_published
                }
                    return entity.published
            },

            async NewEntity() {
                // Attempt to create a new space/building with the entityID from the createNewEntity field
                // If successful, open the new space/building for editing
                // If unsuccessful, display an error message
                // Get the template building or space
                let newEntity = {} as (Space_Template | Building_Template);
                if (this.entityType == "building") {
                    newEntity = building_template
                }
                else if (this.entityType == "space") {
                    newEntity = JSON.parse(JSON.stringify(space_template)) as Space_Template;
                    console.log(newEntity)
                    // For spaces, we need to also set a default type
                    // Get the list of space types, and set the first one as the default
                    const { data: space_types, error } = await this.supabase_client
                        .from('space_styles')
                        .select('category')
                    if (error) {
                        console.log(error)
                        throw error
                    }
                    else {
                        newEntity.type = space_types[0].category;
                        console.log(newEntity)
                    }
                }
                else {
                    console.log("Unknown entity type: " + this.entityType)
                }
                // Assign the new entity the newEntityID
                newEntity.canonical = this.newEntityID

                const access_token = await getSessionAccessToken(this.supabase_client);

                const {data, error:db_insert_error} = await insertToTable(
                    access_token, 
                    this.entityType+'s', 
                    newEntity
                )
                
                if (db_insert_error) {
                    console.error(db_insert_error)
                    alert(db_insert_error.message)
                    throw db_insert_error
                }
                else {
                    console.log(`New ${this.entityType} created`)
                    this.getListOfEntities()
                    
                    // Set the active entity to the new entity
                    this.$emit('activeEntityChanged', newEntity.canonical);
                    // Find the new entity in the list
                    for (let i = 0; i < this.entities.length; i++) {
                        if (this.entities[i].canonical == newEntity.canonical) {
                            this.activeEntity = this.entities[i];
                            break;
                        }
                    }
                    // Clear the newEntityID field
                    this.newEntityID = '';
                }
            },
    
            async getListOfEntities() {
                let entities = [];
                // Select All spaces from supabase
                // Assign them the spaces array
                if (this.entityType == "space") {
                    let { data: spaces, error } = await this.supabase_client
                        .from('spaces')
                        .select('name, canonical, published')
                    if (error) {
                        console.log(error)
                        throw error
                    }
                    else {
                        entities = spaces;
                    }
                }
                else if (this.entityType == "building") {
                    let { data: buildings, error } = await this.supabase_client
                        .from('buildings')
                        .select('display_name, canonical, published, floorplans_published, rooms_published')
                    if (error) {
                        console.log(error)
                        throw error
                    }
                    else {
                        entities = buildings;
                    }
                }
                else {
                    console.log("Unknown entity type: " + this.entityType)
                    return;
                }
                
                // Add the entities to the entities array, sorted by canonical
                this.entities = sortArrayOfObjectsByKey(entities, "canonical");
                this.entities_clean = JSON.parse(JSON.stringify(this.entities));

                // Check if this is the first load
                if (JSON.stringify(this.activeEntity) == JSON.stringify({})) {
                    // Set the active entity to the first entity in the array
                    this.activeEntity = this.entities[0];
                    this.$emit('activeEntityChanged', this.activeEntity.canonical);
                }
                else {
                    // Check if the active entity is still in the list
                    let activeEntityInList = false;
                    for (let i = 0; i < this.entities.length; i++) {
                        if (this.entities[i].canonical == this.activeEntity.canonical) {
                            activeEntityInList = true;
                            break;
                        }
                    }
                    // If the active entity is not in the list, set the active entity to the first entity in the list
                    if (!activeEntityInList) {
                        this.activeEntity = this.entities[0];
                        this.$emit('activeEntityChanged', this.activeEntity.canonical);
                    }
                }
                
            },

            changeEntity(entity: Space_List_Item | Building_List_Item) {
                // If the list is disabled, ignore the click
                if (this.disabled) {
                    return;
                }
                // Set the active entity to the clicked entity
                this.activeEntity = entity;
                this.$emit('activeEntityChanged', this.activeEntity.canonical);
                // console.log("Changing entity to " + this.activeEntity.canonical);
            },

            // Functions for dealing with the search/filter
            search() {
                 
                const fuse_options = {
                    includeScore: true,
                    // threshold: 1,
                    keys: [ 
                        // "display_name" 
                        {name:'name', weight:5},
                        {name:'canonical', weight:1},
                    ]
                }
                // Create a new Fuse object
                let fuse = new Fuse(this.entities_clean, fuse_options);

                //Use the static generated Fuse instance to get a list of matches
                let result = fuse.search(this.searchTerm)
                console.log(result)

                // Check there is a result
                // If there's no result and no text in the textbox, show everything except the apology
                //TODO: Add an apology
                if (result.length == 0 && this.searchTerm == ""){

                    this.entities = JSON.parse(JSON.stringify(this.entities_clean));

                }
                else {

                    // If the result is nonzero, clear the old results and add the new ones
                    this.entities = [];
                    for (let i = 0; i < result.length; i++) {
                        this.entities.push(result[i].item);
                    }

                    // Check if the active entity is still in the list
                    let activeEntityInList = false;
                    for (let i = 0; i < this.entities.length; i++) {
                        if (this.entities[i].canonical == this.activeEntity.canonical) {
                            activeEntityInList = true;
                            break;
                        }
                    }
                    // If the active entity is not in the list, set the active entity to the first entity in the list
                    if (!activeEntityInList) {
                        this.activeEntity = this.entities[0];
                        this.$emit('activeEntityChanged', this.activeEntity.canonical);
                    }

                }

            },
        }
    };
    </script>
    
    
    <style>
    .entity-selection-sidebar{
        width: 250px; 
        overflow-y: auto;
        transition: width 0.4s ease-in-out;
    }
    .entity-selection-sidebar:hover {
        width: 400px;
    }

    .entity-selection {
        cursor: pointer;
    } 
    .entity-selection:hover {
        background-color: #e9ecef;
    }
    .active-entity-selection {
        background-color: #6bb5ff;
    }
    </style>