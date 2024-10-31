<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
	<NuxtLayout name="admin-layout" :activePage="'floorplans'" :supabase_client="supabase">
		<main class="d-flex flex-nowrap" style="height:100vh">

			<!-- Sidebar for building selection -->
			
			<AdminEntitySelector 
			@activeEntityChanged="getBuilding($event)"
			entityType="building"
			:published_field="'floorplans_published'"
			:disabled="buildingHasBeenChanged"
			:permissions="user"
			:supabase_client="supabase"
			:updateCount="update_count"/>
			<!-- Main section for editing -->
			<div class="pt-0 px-4 w-100" style="overflow-y: auto;">

				<!-- Header -->
				<div class="pt-1 border-bottom border-2 border-black mb-3 d-flex justify-content-between sticky-top bg-light">
					<!-- Title -->
					<h1 class="display-6 d-flex align-items-end">
						Floorplan | 
						<span class=" p-1 ms-2 border font-monospace border-success bg-yellow-100 fs-4">
							<NuxtLink 
							:to="'/info/' + building.canonical"
							class="link-dark text-decoration-none">
								{{ building.canonical }}
							</NuxtLink>
						</span>
					</h1>

					<!-- Construction Badge -->
					<div class="d-flex align-items-center m-3 fs-5">
						<!-- Test data puller -->
						<!-- <button 
							type="button" 
							class="btn btn-primary me-2" 
							@click="loadTestData()">
								Pull test data
						</button> -->

						<div class="btn-group" role="group">
							<button 
							type="button" 
							class="btn" 
							:class="buildingHasBeenChanged ? 'btn-success' : 'btn-outline-secondary'"
							@click="updateBuilding()"
							:disabled="!buildingHasBeenChanged || !checkPermission('url')">
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

					<div class="border-bottom border-1 border-secondary mb-3">
						<!-- <h3 class="fs-4">Floorplans</h3> -->
						<ContentDoc path="admincopy/floorplans"></ContentDoc>
						
					</div>

					<!-- <div class="mb-3 ps-3">
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" role="switch" :v-model="building.floorplans_published">
							<label class="form-check-label" for="flexSwitchCheckDefault">Display floorplan for {{ building.display_name }}</label>
						</div>
					</div> -->

					<!-- Floorplan size -->
					<div class="row g-3 mb-2">
						<!-- Button to remake the map -->
						<!-- <div class="col-md-2 d-flex">
							<button class="btn btn-outline-secondary flex-fill" @click="mapInit()">Re-generate Map</button>
						</div> -->
						<div class="col">
							<div class="form-check form-switch">
								<input 
								:disabled="!checkPermission('floorplans_publish', 'buildings')"
								class="form-check-input" type="checkbox" role="switch" v-model="building.floorplans_published">
								<label class="form-check-label" for="flexSwitchCheckDefault">Display floorplan for {{ building.display_name }}</label>
							</div>
							<!-- <label for="floorSelect" class="form-label">Entry Floor</label>
							<select class="form-select" id="floorSelect" 
							@change="setEntryFloor($event.target.value as number)"
							v-model="building.entry_floor">
								<option 
								v-for="(floor, index) in floors"
								:value="index">
									{{ floor.label }}
								</option>
							</select> -->
						</div>
						<!-- Map dimensions -->
						<div class="col">
							<label for="width" class="form-label">Height</label>
							<input
							:disabled="!checkPermission('internal_map_size', 'buildings')"
							type="number" class="form-control" id="width" v-model="building.internal_map_size[0]">
						</div>
						<div class="col">
							<label for="height" class="form-label">Width</label>
							<input 
							:disabled="!checkPermission('internal_map_size', 'buildings')"
							type="number" class="form-control" id="height" v-model="building.internal_map_size[1]">
						</div>
					</div>
					<!-- <div>
						<div class="mb-3 ps-3">
							<label for="lat" class="form-label">Latitude</label>
							<input 
							type="text" 
							id="lat"
							class="form-control"
							placeholder="Latitude"
							v-model="space.location[0]" 
							disabled>
						</div>
						
						<div class="mb-3">
							<label for="long" class="form-label">Longitude</label>
							<input 
							type="text" 
							id="long" 
							class="form-control"
							placeholder="Longitude"
							v-model="space.location[1]"  
							disabled>
						</div>
					</div> -->
					
					<!-- Floor arranging -->
					<div class="container text-center">
						<!-- Header -->
						<div class="floors-list-row">
							<span>Entry floor</span>
							<span>SVG file</span>
							<span>Label</span>
							<span>Arrange</span>
							<span>Delete</span>
						</div>

						
						<div v-for="(floor, index) in floors" :key="index" class="floors-list-row mb-1">
							<div class="form-check">
								<input 
								:disabled="!checkPermission('entry_floor', 'buildings')"
								class="form-radio-input" 
								type="radio" 
								@change="setEntryFloor(index)"
								:checked="floor.isEntry">
								<!-- :disabled="floor.isEntry"> -->
								<!-- Disable the checkbox if this is the entry floor, to avoid it being deselected -->
								<!-- The only way the checkbox can change therefor is to change the floor -->
							  </div>
							<span>
								<!-- <input type="text" style="width:95%" :value="floor.url"> -->
								<!-- Floor svg file display -->
								<!-- File input that will show the current URL on load -->
								<!-- On change, it will update the URL for the selected floor -->
								
								<!-- <input 
								:id="'floorSVGInput_' + index"
								type="file" 
								style="width:90%"
								class="form-control" 
								@change="handleFloorImageSelect(index)">  -->
								<div class="input-group input-group-sm"
									style="width:90%">
									<!-- File input -->
									<input 
									:id="'floorSVGInput_' + index"
									:disabled="!checkPermission('url')"
									type="file" 
									accept=".svg"
									class="form-control" 
									@change="handleFloorImageSelect(index)">
									<!-- Preview Button -->
									<a class="btn btn-outline-secondary" type="button" :href="floor.url"
									target="_blank">
										<i class="bi bi-image"></i>
										View
									</a>
								</div>
							</span>
							
							<span>
								<!-- Allow hovering to show the actual database ID, for debugging -->
								<input 
								type="text" 
								:disabled="!checkPermission('url')"
								style="width:95%" 
								:title="'id: '+floor.id"
								v-model="floor.label">
							</span>
							<div>
								<div class="btn-group" role="group">
									<!-- Swap upwards -->
									<button 
									type="button" 
									class="btn btn-sm btn-secondary"
									:disabled="index == 0 || !checkPermission('level')"
									@click="swapFloors(index, index-1)"
									>&#x2191;</button>
									<!-- Swap downwards -->
									<button 
									type="button" 
									class="btn btn-sm btn-secondary"
									:disabled="index == floors.length - 1 || !checkPermission('level')"
									@click="swapFloors(index, index+1)"
									>&#x2193;</button>
								</div>
							</div>
							<div>
								<!-- Don't allow the entry floor to be deleted, because I don't want to deal with that logic -->
								<button class="btn btn-sm btn-danger"
								:disabled="floor.isEntry || !checkPermission('url')"
								@click="deleteFloor(index)"
								>Delete</button>
							</div>
						</div>

						<!-- Input a new floor -->
						<!-- File select and label input same as edit -->
						<!-- No entry floor or rearrange buttons -->
						<!-- Replace Delete button with Add button that calls addNewFloor() -->
						<div class="floors-list-row mb-1">
							<div>  
								<!-- Empty Div for layout -->
							</div>
							<span>
								<!-- Floor svg file display -->
								<div class="input-group input-group-sm"
									style="width:90%">
									<!-- File input -->
									<input 
									id="newFloorSVGInput"
									:disabled="!checkPermission('url')"
									type="file" 
									accept=".svg"
									class="form-control" 
									@change="handleNewFloorImageSelect()">
									<!-- Preview Button -->
									<!-- Disabled if there is no url -->
									<a class="btn btn-outline-secondary" 
									type="button" 
									:href="newFloor.url"
									:disabled="newFloor.url.length == 0"
									target="_blank">
										<i class="bi bi-image"></i>
										View
									</a>
								</div>
							</span>
							
							<span>
								<input 
								:disabled="!checkPermission('label')"
								type="text" style="width:95%" v-model="newFloor.label"></span>
							<div>
								<!-- Empty Div for layout -->
							</div>
							<div>
								<button class="btn btn-sm btn-success"
								:disabled="!newFloorIsValid"
								@click="addNewFloor()"
								>Add</button>
							</div>
						</div>

					</div>

					<!-- Internal spaces management -->
					<div class="border-bottom border-1 border-secondary mt-3">
						<h3 class="fs-4">Spaces</h3>
					</div>
					<ContentDoc path="admincopy/floorplans/spaces"></ContentDoc>
					<div class="container text-center">
						<!-- Header -->
						<div class="spaces-list-row">
							<span>Space</span>
							<span>Floor</span>
							<span>Location</span>
						</div>
						<!-- Spaces -->
						<div class="spaces-list-row border-top border-primary-subtle my-1 py-1" v-for="space in spaces">
							<!-- Space name + icon -->
							<span class="spaces-list-space">
								<div class="space-list-space-icon">
									<img :src="space.icon" style="width: 2rem; margin-right: .25rem;"/>
								</div>

								<div class="spaces-list-space-name">
									{{ space.name }}
								</div>
							</span>
							<select class="form-select" v-model="space.floor">
								<option v-for="(floor, index) in floors"
								:disabled="!checkPermission('floor', 'spaces')"
								:value="index">
									{{ floor.label }}
								</option>
							</select>
							<!-- Space internal location -->
							<input 
							class="form-control"
							type="text" 
							:value="coordinatesToString(space.location_internal)" 
							disabled readonly>
						</div>
					</div>

					<!-- Navigation nodes -->
					<div class="border-bottom border-1 border-secondary mt-3">
						<h3 class="fs-4">Navigation</h3>
					</div>
					<ContentDoc path="admincopy/floorplans/navigation"></ContentDoc>

					<div class="container text-center">
						<!-- Header -->
						<div class="nav-list-row">
							<span>Node</span>
							<span>Type</span>
							<span>Floors</span>
							<span>UP Location</span>
							<span>DOWN Location</span>
							<span></span>
						</div>
						<!-- Nodes -->
						<div class="nav-list-row border-top border-primary-subtle my-1 py-1" 
						:class="checkNodeValid(node) ? '' : 'bg-warning'"
						v-for="node in navigationNodes">
							<!-- Node label -->
							<span><input 
								:disabled="!checkPermission('label', 'nav_nodes')"
								type="text" style="width:95%" v-model="node.label"></span>
							<!-- Lift or stair -->
							<div>
								<div class="form-check form-check-inline">
									<input 
									:disabled="!checkPermission('node_type', 'nav_nodes')"
									class="form-check-input" type="radio" id="inlineRadio1" value="lift" v-model="node.node_type">
									<!-- @change="node.lift = Boolean(this.$event.value)"> -->
									<label class="form-check-label" for="inlineRadio1">Lift</label>
								</div>
								<div class="form-check form-check-inline">
									<input 
									:disabled="!checkPermission('node_type', 'nav_nodes')"
									class="form-check-input" type="radio" id="inlineRadio2" value="stairs" v-model="node.node_type">
									<!-- @change="node.lift = Boolean(this.$event.value)"> -->
									<label class="form-check-label" for="inlineRadio2">Stairs</label>
								</div>
							</div>
							<!-- Active floors -->
							<div>
								<div class="form-check form-check-inline" v-for="(floor, index) in floors">
									<input 
									:disabled="!checkPermission('presence', 'nav_nodes')"
									class="form-check-input" 
									type="checkbox"
									:title="floor.label"
									v-model="node.presence[index]">
								</div>
							</div>
							<!-- UP Location -->
							<input 
							class="form-control"
							type="text" 
							:value="coordinatesToString(node.location_up)" 
							disabled readonly>
							<!-- UP Location -->
							<div>
								<!-- Only display the DOWN location if the node is a stair -->
								<input 
								v-if="node.node_type == 'stairs'"
								class="form-control"
								type="text" 
								:value="coordinatesToString(node.location_down)" 
								disabled readonly>
							</div>
							<!-- Delete Button -->
							<div>
								<button class="btn btn-sm btn-danger"
								:disabled="!checkPermission('building', 'nav_nodes')"
								@click="deleteNavNode(node)"
								>X</button>
							</div>
						</div>
						<!-- Insert a new node -->
						<div class="nav-list-row border-top border-primary-subtle my-1 py-1">
							<!-- Node label -->
							<span><input 
								:disabled="!checkPermission('building', 'nav_nodes')"
								type="text" style="width:95%" v-model="newNode.label" placeholder="New Node"></span>
							<!-- Lift or stair -->
							<div>
								<div class="form-check form-check-inline">
									<input 
									:disabled="!checkPermission('building', 'nav_nodes')"
									class="form-check-input" type="radio" id="inlineRadio1" value="lift" v-model="newNode.node_type">
									<!-- @change="node.lift = Boolean(this.$event.value)"> -->
									<label class="form-check-label" for="inlineRadio1">Lift</label>
								</div>
								<div class="form-check form-check-inline">
									<input 
									:disabled="!checkPermission('building', 'nav_nodes')"
									class="form-check-input" type="radio" id="inlineRadio2" value="stairs" v-model="newNode.node_type">
									<!-- @change="node.lift = Boolean(this.$event.value)"> -->
									<label class="form-check-label" for="inlineRadio2">Stairs</label>
								</div>
							</div>
							<!-- Active floors -->
							<div>
								<div class="form-check form-check-inline" v-if="newNode.presence" v-for="(floor, index) in floors">
									<input 
									:disabled="!checkPermission('building', 'nav_nodes')"
									class="form-check-input" 
									type="checkbox"
									:title="floor.label"
									v-model="newNode.presence[index]">
								</div>
							</div>
								<!-- UP Location -->
								<input 
								class="form-control"
								type="text" 
								value="-----" 
								disabled readonly>
								<!-- UP Location -->
							<div>
								<!-- Only display the DOWN location if the node is a stair -->
								<input 
								v-if="newNode.node_type == 'stairs'"
								class="form-control"
								type="text" 
								value="-----" 
								disabled readonly>
							</div>
							<!-- Add Button -->
							<div>
								<!-- Only enable if the new node is valid -->
								<button class="btn btn-sm btn-success"
								@click="addNewNavNode()"
								:disabled="!checkNodeValid(newNode) || !checkPermission('buildings', 'nav_nodes')"
								>+</button>
								<!--  -->
							</div>
						</div>
					</div>


					<!-- Display the map, if there is at least one floorplan to view-->
					<div class="mb-3 mt-5 position-relative" v-if="floors && floors.length > 0">
						<!-- Leaflet instance -->
						<FloorplanMap
						:floors="floors"
						:building="building"
						:spaces="spaces"
						:navigationNodes="navigationNodes"
						/>
					</div>
					

				</div>
			</div>
		</main>
	</NuxtLayout>
</template>

<script lang="ts">
import {createClient} from '@supabase/supabase-js';
import type { Building_Partial, Space_Partial, Floorplan, Nav_Node, Space_Type, Floorplan_Template, Nav_Node_Template } from '~/assets/types/supabase_types';
import { Building_Partial_Fields, Space_Partial_Fields } from "~/assets/types/supabase_types";
import { getSpaceTypes, getImageForSpaceType } from '~/utils/adminMapUtils'
import getPermissionsKey, { type PermissionsKey } from "~/assets/permissionsKey"
import type { UserProfile } from '~/assets/types/permissions';
import { update } from 'lodash';

	export default {
		data() {
			return {
				building: {} as Building_Partial,
				building_clean: {} as Building_Partial,
				floors: [] as Floorplan[],
				deleted_floors: [] as Floorplan[],
				floors_clean: [] as Floorplan[],
				floor_layers_object: {} as any,
				supabase: {} as any,
				newFloor: {
					label: "",
					url: "",
				} as Floorplan_Template,
				newNode: {
					building: "",
					label: "",
					node_type: "",
					presence: [] as boolean[],
					location_up: [0,0],
					location_down: [0,0],
				} as Nav_Node_Template,
				spaces: [] as Space_Partial[],
				spaces_clean: [] as Space_Partial[],

				navigationNodes: [] as Nav_Node[],
				navigationNodes_clean: [] as Nav_Node[],

				user: {} as UserProfile,
				permissionsKey: {} as PermissionsKey,
				permissionsKey_buildings: {} as PermissionsKey,
				permissionsKey_spaces: {} as PermissionsKey,
				permissionsKey_nav_nodes: {} as PermissionsKey,
				update_count: 0,
			}
		},
		created() {
			// Initialise the supabase client
			// const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
			// const supabaseKey = useRuntimeConfig().public.supabaseKey;
			// this.supabase = createClient(supabaseUrl, supabaseKey)

			
			this.supabase = adminSupabaseInit();
			getCurrentUserPermissions(this.supabase).then((user) => {
				this.user = user;
			});
			// Get the permissionsKeys for floorplans
			this.permissionsKey = getPermissionsKey("floorplans") as PermissionsKey;
			this.permissionsKey_buildings = getPermissionsKey("buildings") as PermissionsKey;
			this.permissionsKey_spaces = getPermissionsKey("spaces") as PermissionsKey;
			this.permissionsKey_nav_nodes = getPermissionsKey("nav_nodes") as PermissionsKey;

		},
		mounted() {
			// this.loadTestData();
		},
		computed: {
			buildingHasBeenChanged(){

				// Check if the building details (map size, entry floor) have changed
				if (this.checkBuildingChanges()) {
					return true;
				}
				
				// Check if the floors have changed
				if (this.checkFloorChanges()) {
					return true;
				}

				// Check if the spaces have changed
				if (this.checkSpaceChanges()) {
					return true;
				}

				// Check if the navigation nodes have changed
				if (this.checkNavNodeChanges()) {
					return true;
				}

				return false;

			},
			newFloorIsValid(){
				// Check the input fields of the new floor
				// Check that the label is not empty
				// And that a file has been selected
				return (this.newFloor.label != "") && (this.newFloor.url != "");
			},

			
		},
		watch: {
			// Watch for edits on the floorplan size
			building: {
				handler: function(){
					// Update the newNode object with the new default location
					this.newNode.location_up = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];
					this.newNode.location_down = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];
				},
				deep: true
			},
			floors: {
				handler: function(){
					// If the floors change
					// Re-validate all the nodes
					let _nodes = [] as Nav_Node_Template[];
					for (let i = 0; i < this.navigationNodes.length; i++) {
						_nodes[i] = this.validateNavigationNode(this.navigationNodes[i]);
					}
					
					// Copy the nodes to the navigationNodes array
					this.navigationNodes = JSON.parse(JSON.stringify(_nodes));
				},
				deep: true
			}
		},
		methods: {


			checkNodeValid(node: Nav_Node | Nav_Node_Template){

				// First, make sure there is a presence array
				if (!node.presence) {
					return false;
				}

				// Then, check the number of floors selected
				let floors_selected = 0;
				node.presence.forEach(floor => {
					if (floor) {
						floors_selected++;
					}
				});

				// Then, check the label and node type, and that the floors selected is at least 2
				return (node.label != "") && (node.node_type != "") && (floors_selected >= 2);
			},

			async getSpaces(){
				// Get the spaces in this building

				// Null the spaces array
				this.spaces = [];

				const { data: spaces, error } = await this.supabase
					.from('spaces')
					.select(Space_Partial_Fields)
					.eq('building', this.building.canonical)

					if (error) {
					console.error(error)
					alert(error.message)
					throw error
				}
				else {

					// Calculate the icon for each space
					
					let spaceStyles = await getSpaceTypes(this.supabase);
					// console.log("spaceStyles", spaceStyles);
					spaces.forEach((space:Space_Partial) => {
						space.icon = getImageForSpaceType(space, spaceStyles);
					});

					// console.log("spaces", spaces);

					this.spaces = JSON.parse(JSON.stringify(spaces));
					this.spaces_clean = JSON.parse(JSON.stringify(spaces));
				}
			},

			async getNavigationNodes(){
				// Get the navigation nodes in this building
				// Null the nodes array
				this.navigationNodes = [];
				let _nodes = [] as Nav_Node_Template[];
				const { data: nodes, error } = await this.supabase
					.from('nav_nodes')
					.select('*')
					.eq('building', this.building.canonical)

					if (error) {
					console.error(error)
					alert(error.message)
					throw error
				}
				else {
					// console.log("nodes", nodes);   
					// Validate all the nodes
					
					for (let i = 0; i < nodes.length; i++) {
						_nodes[i] = this.validateNavigationNode(nodes[i]);
					}
					
					// Copy the nodes to the navigationNodes array
					this.navigationNodes = JSON.parse(JSON.stringify(_nodes));
					this.navigationNodes_clean = JSON.parse(JSON.stringify(_nodes));
				}

				// Set up the empty "new node" object
				this.setUpNewNode();


			},

			setUpNewNode(){
				// Set up the empty "new node" object
				this.newNode = {
					label: "",
					node_type: "",
					building: this.building.canonical,
					presence: [],
					location_up: [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2],
					location_down: [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2],
				} as Nav_Node_Template;

				// Update the locations to be the center of the map
				// this.newNode.location_up = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];
				// this.newNode.location_down = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];

				// Set the presence array to the correct length
				this.newNode = this.validateNavigationNode(this.newNode);

			},

			validateNavigationNode(node: Nav_Node | Nav_Node_Template): Nav_Node_Template {
				// Takes in a lift or stair, checks it has the correct number of floors
				// Trims the presence array to the correct number of floors if too many
				// filles the presence array with 0s if too few

				// If the presence array is not present, create it
				if (!node.presence) {
					node.presence = [];
				}

				// Check the presence array is the correct length
				if (node.presence.length != this.floors.length) {
					// If it's too long, trim it
					if (node.presence.length > this.floors.length) {
						node.presence = node.presence.slice(0, this.floors.length);
					}
					// If it's too short, fill it with 0s
					else {
						let difference = this.floors.length - node.presence.length;
						for (let i = 0; i < difference; i++) {
							node.presence.push(false);
						}
					}
				}

				return node;

			},

			swapFloors(A: number, B: number){
				// Takes in the index of two floors, swaps them in the array
				let temp = this.floors[A];
				this.floors[A] = this.floors[B];
				this.floors[B] = temp;
				this.setFloorLevels();
			},

			setEntryFloor(newEntryFloor: number, init=false){

				// Set the entry floor to the new value
				this.building.entry_floor = newEntryFloor;

				// Set all floors to entryFloor = false
				this.floors.forEach((floor, index) => {
					floor.isEntry = false;
				});

				// Set the entry floor to true by checking newEntryfloor
				this.floors[newEntryFloor].isEntry = true;

				// If this is the initial call, repeat for the clean copy of the floors
				// So we can compare them properly
				if (init) {
					this.floors_clean.forEach((floor, index) => {
						floor.isEntry = false;
					});
					this.floors_clean[newEntryFloor].isEntry = true;
				}
			},

			setFloorLevels(){
				// When the list is rearranged, the level of the floor will update to match the index
				// This function will update the level of each floor to match the index
				this.floors.forEach((floor, index) => {
					floor.level = index;
				});
				
			},

			async uploadFloorImage(floor: number){

				let input_id;
				let floor_label;
				
				if (floor === -1) {
					// This condition means a new floor is being added
					input_id = "newFloorSVGInput";
					floor_label = this.newFloor.label;
				}
				else{
					// Otherwise, get the floor input based on the index
					input_id = "floorSVGInput_" + floor;
					floor_label = this.floors[floor].label;
				}
				// Get the file
				let file_input = document.getElementById(input_id) as HTMLInputElement;
				
				// Make TS happy by checking the file input is not null
				if (!file_input || !file_input.files) {
					throw "File input not found";
				}
				// Extract the file
				const file = file_input.files[0];
				// Get the file name
				let fileName = file_input.name;
				// Get the file extension
				let fileExtension = fileName.split('.').pop();

				// Create a new file name
				// Replace any spaces in the floor label with underscores
				// Replace any special characters with nothing
				floor_label = floor_label.replace(/[^a-zA-Z0-9]/g, '');
				floor_label = floor_label.replace(" ", "_");
				let newFileName = this.building.canonical + "_" + floor_label + "." + fileExtension;
				
				// Build the new url for the file
				let newUrl = this.supabase.storageUrl + "/object/public/floorplans/" + newFileName;
				// Upsert the image
				const {data, error} = await upsertImage(this.supabase, 'floorplans', `${this.building.canonical + "_" + floor_label}.${fileExtension}`, file)
				
				if (error) {
					console.error(error)
					alert(error.message)
					throw error
				}

				return newUrl;

			},

			async addNewFloor(){
				// Get the file from the input 
				// @ts-ignore
				let file = document.getElementById("newFloorSVGInput").files[0];
				// Upload the file to the storage bucket
				try {
					// Set the url of the new floor
					this.newFloor.url = await this.uploadFloorImage(-1)
					// Set the building UUID
					this.newFloor.building = this.building.canonical;
					
					// Add the new floor to the floors array
					this.floors.push(this.newFloor as Floorplan);
					// Check if this is the first floor added
					// If it is, set this as the entry floor
					if (this.floors.length == 1) {
						this.setEntryFloor(0);
					}

					// Remap the floor levels to automatically include this floor
					this.setFloorLevels();

					// Reset the new floor object
					this.newFloor = {
						label: "",
						url: "",
					} as Floorplan_Template
					// Reset the new floor input
					// @ts-ignore
					document.getElementById("newFloorSVGInput").value = "";
				}
				catch (error) {
					console.log(error);
					alert("Error uploading file");

				}

			},

			deleteFloor(floorIndex: number){

				// Add it to the deleted_floors array
				// This will let us track later if it needs to be deleted from the database
				this.deleted_floors.push(this.floors[floorIndex]);
				// Delete the floor at the given index
				// Remove it from the floors array
				this.floors.splice(floorIndex, 1);

			},

			addNewNavNode(){
				// Add the new node to the navigationNodes array
				this.navigationNodes.push(this.newNode as Nav_Node);
				// Set up the new node object
				this.setUpNewNode();
			},

			deleteNavNode(node: Nav_Node){
				this.navigationNodes.splice(this.navigationNodes.indexOf(node), 1)
			},

			coordinatesToString(coordinates: number[][] | number[]): string {
				// Takes in an array of coordinates, returns a string
		
				// Check if the coordinates are nested
				if (Array.isArray(coordinates[0])) {
					
					// If they are, return a string of the first set of coordinates
					// @ts-ignore
					return "[[" + coordinates[0][0] + ", " + coordinates[0][1] + "], [" + coordinates[1][0] + ", " + coordinates[1][1] + "]]";
				}
				// If they're not, return a string of the coordinates
				return "[" + coordinates[0] + ", " + coordinates[1] + "]";
			},


			// This function is called when the user clicks the "Save" button
			// It will save the current state of the building, floorplans, navnodes and spaces to the database
			async updateBuilding() {

				
				// Get user access token
				const access_token = await getSessionAccessToken(this.supabase);

				// Check if the building details have changed
				if (this.checkBuildingChanges()) {

					const {data:building_update_response, error:building_update_error} = await updateTable(access_token, "buildings", 
					{
						floorplans_published: this.building.floorplans_published,
						internal_map_size: this.building.internal_map_size,
						entry_floor: this.building.entry_floor,
					},
					{
						col: "canonical",
						eq: this.building.canonical
					});

					// If there is an error, log it
					if (building_update_error) {
						console.error("Error updating building details: " + this.building.canonical)
						console.error(building_update_error)
						alert(building_update_error.message)
						throw building_update_error
					}

					// Set the clean building to the current building
					this.building_clean = JSON.parse(JSON.stringify(this.building));

					// Alert the user that the building has been updated
					alert(this.building.display_name + " updated successfully")

					// Increment the update count
					this.update_count++;

				}

				// Check if the relevant floor details have changed
				let floorEquivalence = (f: Floorplan, cf: Floorplan) => {

					if (f.label != cf.label) {
						// console.log("Label mismatch")
						// console.log(`${f.label} != ${cf.label}`)
						return false
					}
					if (f.url != cf.url) {
						// console.log("URL mismatch")
						// console.log(`${f.url} != ${cf.url}`)
						return false
					}
					if (f.level != cf.level) {
						// console.log("Level mismatch")
						// console.log(`${f.level} != ${cf.level}`)
						return false
					}

					return true;
				}

				// Cycle through the floors
				for (let i = 0; i < this.floors.length; i++) {
					// Check if the floor has changed
					// Since the order of the floors is mutable,
					// We need to compare them by their id property
					let floor = this.floors[i];
					
					let deleted_floor = this.deleted_floors.find(f => f.id == floor.id);
					let clean_floor = this.floors_clean.find(f => f.id == floor.id);

					// Copy the floor to a new variable with only the properties we want to update
					let floor_update_vehicle = {
						label: floor.label,
						url: floor.url,
						level: floor.level,
						building: this.building.canonical,
					} as Floorplan_Template;

					// Check if the floor has a new image
					// We can check for the floor url to have the prefix "blob:"
					if (floor.url.startsWith("blob:")) {
						// console.log("Uploading new floor")
						// Upload the new floor image
						// Set the url of the new floor
						floor_update_vehicle.url = await this.uploadFloorImage(i)
						// console.log("New floor url: " + floor_update_vehicle.url)
					}

					// Check if the clean_floor is undefined - then the floor is new
					if (clean_floor == undefined) {
						console.log("Uploading new floor")
						console.log(floor_update_vehicle)
						// Insert the new floor into the database
						// const { data:floor_insert_response, error:floor_insert_error } = await this.supabase
						// 	.from('floorplans')
						// 	.insert(floor_update_vehicle)
						// // If there is an error, log it
						// if (floor_insert_error) {
						// 	console.error("Error inserting new floor: " + floor.id)
						// 	console.error(floor_insert_error)
						// 	alert(floor_insert_error.message)
						// 	throw floor_insert_error
						// }
						const {data:floor_update_response, error:floor_update_error} = await insertToTable(access_token, "floorplans", floor_update_vehicle);

						if (floor_update_error) {
							console.error("Error inserting new floor: " + floor.id)
							console.error(floor_update_error)
							alert(floor_update_error.message)
							throw floor_update_error
						}
							
						alert(floor.label + " added successfully")
						
					}
					// Check if the floor has changed
					else if (!floorEquivalence(floor, clean_floor)) {

						// console.log("Updating existing floor")
						// // console.log(floor_update_vehicle)
						// console.log("floor", JSON.parse(JSON.stringify(floor_update_vehicle)))
						// console.log("clean_floor", JSON.parse(JSON.stringify(clean_floor)))

						// Update the floor in the database
						// const { data:floor_update_response, error:floor_update_error } = await this.supabase
						// 	.from('floorplans')
						// 	.update(floor_update_vehicle)
						// 	.eq('id', floor.id)
						// 	.select()

						const { data:floor_update_response, error:floor_update_error } = await updateTable(access_token, "floorplans", 
						floor_update_vehicle, 
						{
							col: "id", 
							eq: floor.id
						});

						// If there is an error, log it
						if (floor_update_error) {
							console.error("Error updating floor: " + floor.id)
							console.error(floor_update_error)
							alert(floor_update_error.message)
							throw floor_update_error
						}
						else {
							// console.log("floor_update_response", floor_update_response)
							alert(floor.label + " updated successfully")
						}
					}
					// Check if the floor is deleted
					// A floor that was created and deleted in the same session will also be
					// In the deleted_floors array, so we'll check for that
					else if (deleted_floor != undefined && floor.id == deleted_floor.id) {
						
						console.log("Deleting existing floor")
						console.log(floor_update_vehicle)

						// Delete the floor from the database
						const { data:floor_delete_response, error:floor_delete_error } = await removeFromTable(access_token, "floorplans", 
						{
							col: "id", 
							eq: floor.id
						});

						// If there is an error, log it
						if (floor_delete_error) {
							console.error("Error deleting floor: " + floor.id)
							console.error(floor_delete_error)
							alert(floor_delete_error.message)
							throw floor_delete_error
						}

					}

					
				}
				// Set the clean floors to the current floors
				this.floors_clean = JSON.parse(JSON.stringify(this.floors));
				
				// Cycle through the spaces
				for (let i = 0; i < this.spaces.length; i++) {
					// Check if the space has changed
					if (this.checkSpaceChanges(i)) {
						
						console.log("Updating " + this.spaces[i].name)

						let space_update_vehicle = {
							floor: this.spaces[i].floor,
							location_internal: this.spaces[i].location_internal,
						}
						// Update the space in the database
						const { data:space_update_response, error:space_update_error } = await updateTable(access_token, "spaces",
						space_update_vehicle,
						{
							col: "canonical",
							eq: this.spaces[i].canonical
						});
							// .from('spaces')
							// .update(space_update_vehicle)
							// .eq('canonical', this.spaces[i].canonical)
							// .select()
						// If there is an error, log it
						if (space_update_error) {
							console.warn("Error updating space: " + this.spaces[i].name)
							console.error(space_update_error)
							alert(space_update_error.message)
							throw space_update_error
						}
						else {
							// console.log("space_update_response", space_update_response)
							alert(this.spaces[i].name + " updated successfully")
						}
					}
				}

				// Set the clean spaces to the current spaces
				this.spaces_clean = JSON.parse(JSON.stringify(this.spaces));

				// Check if the navigation nodes have changed
				if (this.checkNavNodeChanges()) {
					// Update the navigation nodes in the database
					// First, delete all the nodes for this building
					const { data:delete_response, error:navNode_delete_error } = await this.supabase
						.from('nav_nodes')
						.delete()
						.eq('building', this.building.canonical)
					// If there is an error, log it
					if (navNode_delete_error) {
						console.error(navNode_delete_error)
						alert(navNode_delete_error.message)
						throw navNode_delete_error
					}

					// Create a new array of nodes without UUIDs to insert
					let nodes_update_vehicle = [] as Nav_Node_Template[];
					
					this.navigationNodes.map(node => {
						nodes_update_vehicle.push(JSON.parse(JSON.stringify({
							label: node.label,
							node_type: node.node_type,
							presence: node.presence,
							location_up: node.location_up,
							location_down: node.location_down,
							building: node.building,
						})));
					});

					// console.log("nodes_update_vehicle", nodes_update_vehicle)

					// Then, insert the new nodes
					const { data:insert_response, error:navNode_insert_error } = await this.supabase
						.from('nav_nodes')
						.insert(nodes_update_vehicle)
					// If there is an error, log it
					if (navNode_insert_error) {
						console.error(navNode_insert_error)
						alert(navNode_insert_error.message)
						throw navNode_insert_error
					}
					else {
						alert("Navigation nodes updated successfully")
					}

					// Set the clean nodes to the current nodes
					this.navigationNodes_clean = JSON.parse(JSON.stringify(this.navigationNodes));
				}

				// Call the getBuilding function to refresh the building object and all the dependent objects
				this.getBuilding(this.building.canonical);
				// Remove the map, if it exists
				// this.removeMap();

			},
			
			handleFloorImageSelect(floor: number) { 
				// Get the file from the input specified by the floor number
				// Set the image of the floor to the file to preview

				// Get the file
				let input_id = "floorSVGInput_" + floor;
				let file_input = document.getElementById(input_id) as HTMLInputElement;
				// Make TS happy by checking the file input is not null
				if (!file_input || !file_input.files) {
					throw "File input not found";
				}
				const file = file_input.files[0];
				// Set the floor image to the blob URL of the file
				this.floors[floor].url = URL.createObjectURL(file);
			},

			handleNewFloorImageSelect() { 
				// Get the file from the input
				// Set the image of the floor to the file to preview

				// Get the file
				let file_input = document.getElementById("newFloorSVGInput") as HTMLInputElement;
				// Make TS happy by checking the file input is not null
				if (!file_input || !file_input.files) {
					throw "File input not found";
				}
				const file = file_input.files[0];
				// Set the floor image to the file
				this.newFloor.url = URL.createObjectURL(file);
			},

			// This function is called when the user clicks the "Cancel" button
			// It will revert the building to the state it was in when the page was loaded
			cancelChanges() {

				// Call the getBuilding function to refresh the building object and all the dependent objects
				this.getBuilding(this.building.canonical);

			},

			// This function fetches the building from the database based on it's canonical name
			async getBuilding(canonical: string){
				
				// For testing: Set canonical to "arts-building"
				// canonical = "arts-building";
				// console.log("Fetching floorplans for: " + canonical);

				// Get the relevant building fields from the database
				// Since we are using the canonical name, we should only get one result
				let { data: bld, error } = await this.supabase
					.from('buildings')
					.select(Building_Partial_Fields)
					// .select('canonical, display_name, UUID')
					.eq('canonical', canonical)
				if (error) {
					console.error(error)
					alert(error.message)
					throw error
				}
				else {
					// Deep copy the building object to the vue instance
					this.building = JSON.parse(JSON.stringify(bld[0]));
					// console.log("Building", this.building);
					// Deep copy the building object so we have comparison data
					this.building_clean = JSON.parse(JSON.stringify(this.building));
					
					// Call the getFloors and getSpaces functions
					this.getSpaces(this.building.canonical);
					// Floors need to be awaited because we use the floor count to validate the navigation nodes
					await this.getFloorplans();
					this.getNavigationNodes();

				}
				
			},

			async getFloorplans(){

				// Null the floors arrays
				this.floors = [];
				this.floors_clean = [];
				this.floor_layers_object = {};
				this.deleted_floors = [];

				// Fetch the floorplans for the building from the database
				let { data: flr, error } = await this.supabase
					.from('floorplans')
					.select('*')
					.eq('building', this.building.canonical)
				if (error) {
					console.error(error)
					alert(error.message)
					throw error
				}
				else {

					// console.log("Floorplans", flr);
					// load the floors into the vue instance
					this.floors = JSON.parse(JSON.stringify(flr));
					this.floors_clean = JSON.parse(JSON.stringify(flr));

					// If there is only one floor, don't try to sort the floors
					if (this.floors.length > 1) {
						// Sort the floors by level
						this.floors.sort((a, b) => (a.level > b.level) ? 1 : -1)
						this.floors_clean.sort((a, b) => (a.level > b.level) ? 1 : -1)
					}

					// If there are no floors, don't try to set the entry floor
					if (this.floors.length > 0) {
						// Set the entry floor
						this.setEntryFloor(this.building.entry_floor, true);
					}
				}
			},

			// Check if the building details (map size, entry floor) have changed
			checkBuildingChanges(){
				// Dump the building and building_clean to JSON and compare
				if (JSON.stringify(this.building) != JSON.stringify(this.building_clean)) {
					return true;
				}

				return false;
			},
				
			// Check if the floors have changed
			checkFloorChanges(){
				// Dump the floors and floors_clean to JSON and compare
				if (JSON.stringify(this.floors) != JSON.stringify(this.floors_clean)) {
					return true;
				}

				return false;
			},

			// Check if the spaces have changed
			checkSpaceChanges(i: number | null = null){

				// If i is null, check all the spaces
				if (i == null) {
					// Dump the spaces and spaces_clean to JSON and compare
					if (JSON.stringify(this.spaces) != JSON.stringify(this.spaces_clean)) {
						return true
					}
					return false;
				}
				// If i is not null, check only the space at index i
				else {
					// Dump the space and space_clean to JSON and compare
					// console.log("Space:", this.spaces[i])
					// console.log("Space_clean:", this.spaces_clean[i])
					if (JSON.stringify(this.spaces[i]) != JSON.stringify(this.spaces_clean[i])) {
						return true
					}
					return false;
				}
			},

			// Check if the navigation nodes have changed
			checkNavNodeChanges(){
				// Dump the navigationNodes and navigationNodes_clean to JSON and compare
				if (JSON.stringify(this.navigationNodes) != JSON.stringify(this.navigationNodes_clean)) {
					return true
				}
				return false;
			},

			checkPermission(permission: string, table: string = "floorplan"): boolean{
				// If the user is an admin, they have all permissions on this page
				if (this.user.is_admin){
					return true;
				}

				if (table === "buildings"){
					// Check if the user has the permission to perform an action on the building
					// @ts-ignore
					return userHasPermission(this.user, this.permissionsKey_buildings, permission);
				}

				if (table === "spaces"){
					// Check if the user has the permission to perform an action on the building
					// @ts-ignore
					return userHasPermission(this.user, this.permissionsKey_spaces, permission);
				}

				if (table === "nav_nodes"){
					// Check if the user has the permission to perform an action on the building
					// @ts-ignore
					return userHasPermission(this.user, this.permissionsKey_nav_nodes, permission);
				}

				// Else, check if the user has the permission to perform an action
				// @ts-ignore
				return userHasPermission(this.user, this.permissionsKey, permission);
			},

		},
	}


</script>

<style>

.floors-list-row {
	display: grid;
	/* padding-top: 2rem; */
	grid-template-columns:   6rem auto auto 6rem 4rem;
	grid-template-rows: auto;
	row-gap: 1rem;
}

.spaces-list-row {
	display: grid;
	/* padding-top: 2rem; */
	grid-template-columns:  auto 18rem 18rem;
	grid-template-rows: auto;
	row-gap: 1rem;
	column-gap: 2rem;
}

.spaces-list-space {
	display: grid;
	grid-template-columns:  2rem auto;
	grid-template-rows: auto;
	column-gap: 1rem;
	text-align: start;
	align-content: center;
}

.nav-list-row {
	display: grid;
	/* padding-top: 2rem; */
	grid-template-columns:  8rem 10rem auto 8rem 8rem 2rem;
	grid-template-rows: auto;
	row-gap: 1rem;
	column-gap: 1rem;
}

.show-this{
	border-color: black;
	border-width: 1px;
	border-style: solid;
}


.map-section{
	/* Define the grid to give enough room for the map */
	display: grid;
	grid-template-columns: 1fr 3fr;
	grid-template-areas: "input map";
	grid-template-rows: auto;
}

.space-name-toast {
	transition: all 0.2s ease-in-out;
}

</style>