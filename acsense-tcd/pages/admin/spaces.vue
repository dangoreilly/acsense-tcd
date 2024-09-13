<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'spaces'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <!-- Sidebar for space selection -->
            <AdminEntitySelector 
            @activeEntityChanged="getStudentSpace($event)"
            :updateCount="updateCount"
            entityType="space"
            :permissions="user"
            :supabase_client="supabase"/>
            <!-- Main section for editing -->
            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Space Management | 
                        <!-- Input for canonical, only if the user is the superadmin -->
                        <div v-if="checkPermission('canonical')" class="ms-2">
                            <!-- The field should only be editable if the building is unpublished -->
                            <input type="text" 
                            id="canonical"
                            :class="space.published ? 'bg-yellow-100' : 'bg-white'"
                            class="form-control fs-5 border font-monospace border-success" 
                            v-model="space.canonical"
                            title="Change the page URL. This can only be done while the building is unpublished"
                            :disabled="space.published">
                        </div>
                        <span class=" p-1 ms-2 border font-monospace border-success bg-yellow-100 fs-4" v-else>
                            <NuxtLink
                            :to="'/space/' + space.canonical"
                            class="link-dark text-decoration-none">
                                {{ space.canonical }}
                            </NuxtLink>
                        </span>
                    </h1>

                    <!-- Publish switch -->
                    <!-- <div class="form-check form-switch form-check-reverse d-flex align-items-center m-3 fs-5">
                        <label class="form-check-label me-1" for="publishedSwitched">{{ space.published ? "Published" : "Unpublished" }}</label>
                        <input 
                        class="form-check-input m-1" 
                        type="checkbox" 
                        role="switch" 
                        id="publishedSwitch">
                    </div> -->
                    <!-- <div class="d-flex align-items-center m-3 fs-5">
                        <input type="checkbox" class="btn-check" id="publishedSwitch" v-model="space.published">
                        <label class="btn" :class="space.published ? 'btn-danger' : 'btn-success'" for="publishedSwitch">
                            {{ space.published ? "Unpublish" : "Publish" }}
                        </label>
                    </div> -->

                    <div class="d-flex align-items-center m-3 fs-5">
                        <!-- <div class="form-check form-switch form-check-reverse">
                            <label class="form-check-label me-1 bg-green-100 px-1" for="publishedSwitched">{{ space_clean.published ? "Published" : "Publish?" }}</label>
                            <input 
                            class="form-check-input m-1" 
                            type="checkbox" 
                            role="switch" 
                            v-model="space.published"
                            @input="confirmChangePublishStatus()"
                            id="publishedSwitch">
                        </div> -->
                        <button 
                        type="button" 
                        :disabled="!checkPermission('published')"
                        class="btn me-2" 
                        :class="space.published ? 'btn-danger' : 'btn-outline-success'"
                        @click="confirmChangePublishStatus()">
                            {{ space.published ? "Unpublish" : "Publish" }}
                        </button>
                        
                        <div class="btn-group" role="group">
                            <button 
                            type="button" 
                            class="btn" 
                            :class="spaceHasBeenChanged ? 'btn-success' : 'btn-outline-secondary'"
                            @click="updateSpace()"
                            :disabled="!spaceHasBeenChanged">
                                Save Changes
                            </button>

                            <button 
                            type="button" 
                            class="btn"
                            :class="spaceHasBeenChanged ? 'btn-warning' : 'btn-outline-secondary'"
                            @click="cancelChanges()"
                            :disabled="!spaceHasBeenChanged">
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Main Matter -->
                <!-- Only render if the space has loaded -->
                <div class="mainMatter-admin px-2" v-if="space.name">

                    <!-- Two columns -->
                    <!-- Column 1 contains input boxes -->
                    <!-- Column 2 contains a modal preview -->
                    <!-- The input boxes are paired to the components to allow for live editing -->

                    <!-- Space type and parent building -->
                    <div class="row border-bottom mb-1 pb-2">
                        <!-- Space Type -->
                        <div class="col d-flex flex-column">
                            <label for="spaceType" class="form-label">Space Type</label>
                            <select 
                            :disabled="!checkPermission('type')"
                            class="form-select" 
                            id="spaceType" 
                            @change="updateSpaceIcon()"
                            v-model="space.type">
                                <option disabled value="">Select Space Type</option>
                                <option 
                                v-for="_type in space_types"
                                :key="_type.category"
                                :value="_type.category">
                                {{ _type.category }}
                                </option>
                            </select>
                        </div>
                        <!-- Building, if any -->
                        <div class="col d-flex flex-column">
                            <label for="spaceType" class="form-label">Building</label>
                            <select 
                            :disabled="!checkPermission('building_uuid')"
                            class="form-select" 
                            id="spaceType" 
                            @change="updateSpaceIcon()"
                            v-model="space.building">
                                <option value="">~No building~</option>
                                <option 
                                v-for="build in buildings"
                                :key="build.display_name"
                                :value="build.canonical">
                                {{ build.display_name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- <Summary> -->
                    <div class="row border-b">
                        <!-- Input -->
                        <div class="col d-flex flex-column">
                            <!-- Space Name -->
                            <div class="mb-3">
                                <label for="TitleInput" class="form-label">Space Name</label>
                                <input id="TitleInput" type="text" class="form-control" 
                                :disabled="!checkPermission('name')"
                                v-model="space.name">
                            </div>

                            <!-- Aka -->
                            <div class="mb-3">
                                <label for="AkaInput" class="form-label">AKA <small>(optional)</small></label>
                                <input id="AkaInput" type="text" class="form-control" 
                                :disabled="!checkPermission('aka')"
                                v-model="space.aka">
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
                                v-model="space.primary_image_alt">
                            </div>

                            <div class="mb-3">
                                <div class="form-check form-switch">
                                    <input disabled class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="space.primary_image_panorama">
                                    <label class="form-check-label" for="flexSwitchCheckDefault">Primary image is a panorama</label>
                                </div>
                            </div>
                        </div>

                        <!-- Preview -->
                        <div class="col">
                            <!-- Name -->
                            <div class="info-page-title" style="grid-area: title;">
                                <h1>{{space.name}}</h1>
                                <p v-if="space.aka" id="aka" style="display:block"><b>Also Known as:</b> {{space.aka}}</p>
                                <p class="d-block pb-0 mb-0">
                                    <em>{{space.type}}</em> 
                                    <span v-if="space.building != null"> 
                                        &#8212; 
                                        <a href="#"> {{ building_display_name }}</a>
                                    </span>
                                </p>
                                
                                <!-- Pill link to highlight the building on the map -->
                                <a class="btn badge rounded-pill text-bg-warning text-decoration-none mb-1"
                                href="#">
                                Highlight on map</a>
                            </div>

                            <!-- Primary Image -->
                            <div class="mb-3">
                                <LazyPanoramaViewer v-if="space.primary_image_panorama"
                                :mainSrc="space.primary_image_url" 
                                :mainAlt="space.primary_image_alt" 
                                />
                                <MainPicture v-else
                                :mainSrc="space.primary_image_url"
                                :mainAlt="space.primary_image_alt"
                                />
                            </div>    
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="row border-bottom mb-3 pb-2">
                        <!-- Input -->
                        <div class="col">
                            <label for="descInput" class="form-label">Description</label>
                            <textarea class="form-control" id="descInput" rows="4" 
                            :disabled="!checkPermission('description')"
                            v-model="space.description"></textarea>
                        </div>
                        <!-- Preview -->
                        <div class="col" id="description" style="grid-area: desc; justify-self: start;">
                            <h3>Description</h3>
                            <p>{{space.description}}</p>
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
                                    v-model="space.opening_times.weekday.open" />
                                </div>
                                <div class="col">
                                    <label for="weekDay-open">Opening Time</label>
                                    <input type="time" id="weekDay-open" class="form-control"
                                    v-model="space.opening_times.weekday.times[0]" 
                                    :disabled="!space.opening_times.weekday.open || !checkPermission('opening_times')"/>
                                </div>
                                <div class="col">
                                    <label for="weekDay-open">Closing Time</label>
                                    <input type="time" id="weekDay-open" class="form-control"
                                    v-model="space.opening_times.weekday.times[1]" 
                                    :disabled="!space.opening_times.weekday.open || !checkPermission('opening_times')"/>
                                </div>
                            </div>
                            <!-- Saturdays -->
                            <div class="row">
                                <div class="col">
                                    <label for="sat-checkbox">Saturday</label>
                                    <input type="checkbox" id="sat-checkbox" class="form-check-input form-control"
                                    :disabled="!checkPermission('opening_times')"
                                    v-model="space.opening_times.sat.open" />
                                </div>
                                <div class="col">
                                    <label for="sat-open">Opening Time</label>
                                    <input type="time" id="sat-open" class="form-control"
                                    v-model="space.opening_times.sat.times[0]" 
                                    :disabled="!space.opening_times.sat.open || !checkPermission('opening_times')"/>
                                </div>
                                <div class="col">
                                    <label for="sat-close">Closing Time</label>
                                    <input type="time" id="sat-close" class="form-control"
                                    v-model="space.opening_times.sat.times[1]" 
                                    :disabled="!space.opening_times.sat.open || !checkPermission('opening_times')"/>
                                </div>
                            </div>
                            <!-- Sundays -->
                            <div class="row">
                                <div class="col">
                                    <label for="sunday-checkbox">Sunday & Public Holidays</label>
                                    <input type="checkbox" id="sunday-checkbox" class="form-check-input form-control"
                                    :disabled="!checkPermission('opening_times')"
                                    v-model="space.opening_times.holidays.open" />
                                </div>
                                <div class="col">
                                    <label for="sunday-open">Opening Time</label>
                                    <input type="time" id="sunday-open" class="form-control"
                                    v-model="space.opening_times.holidays.times[0]" 
                                    :disabled="!space.opening_times.holidays.open || !checkPermission('opening_times')"/>
                                </div>
                                <div class="col">
                                    <label for="sunday-close">Closing Time</label>
                                    <input type="time" id="sunday-close" class="form-control"
                                    v-model="space.opening_times.holidays.times[1]" 
                                    :disabled="!space.opening_times.holidays.open || !checkPermission('opening_times')"/>
                                </div>
                            </div>

                            <!-- Note -->
                            <div class="mt-3">
                                <label for="timeNoteInput" class="form-label">Note <small>(optional)</small></label>
                                <input id="timeNoteInput" type="text" class="form-control" 
                                :disabled="!checkPermission('opening_times')"
                                v-model="space.opening_times.note">
                            </div>
                        </div>

                        <div class="col">
                            <Timebox
                                :times="space.opening_times"/>
                        </div>
                    </div>

                    <!-- Facilities -->
                    <div class="border-bottom mb-3 pb-2">
                        <!-- Seating -->
                        <div class="row mb-3">
                            <!-- Input -->
                            <div class="col">
                                <div class="form-check">
                                    <input 
                                    :disabled="!checkPermission('seating')"
                                    class="form-check-input" type="checkbox" v-model="space.seating" id="SeatingAvailable">
                                    <label class="form-check-label" for="SeatingAvailable">
                                        Seating Available?
                                    </label>
                                </div>
                                <textarea  
                                    :disabled="!checkPermission('seating_note')"
                                    class="form-control" id="descInput" rows="2" placeholder="Default text" 
                                v-model="space.seating_note"></textarea>
                            </div>
                            <!-- Preview -->
                            <div class="col">
                                <AdminFacility 
                                :facility="'seating'"
                                :available="space.seating"
                                :note="space.seating_note"/>
                            </div>
                        </div>

                        <!-- Sockets -->
                        <div class="row mb-3">
                            <!-- Input -->
                            <div class="col">
                                <div class="form-check">
                                    <input 
                                    :disabled="!checkPermission('outlets')"
                                    class="form-check-input" type="checkbox" v-model="space.outlets" id="OutletsAvailable">
                                    <label class="form-check-label" for="OutletsAvailable">
                                        Plug Sockets Available?
                                    </label>
                                </div>
                                <textarea 
                                    :disabled="!checkPermission('outlets_note')"
                                    class="form-control" id="descInput" rows="2" placeholder="Default text" 
                                v-model="space.outlets_note"></textarea>
                            </div>
                            <!-- Preview -->
                            <div class="col">
                                <AdminFacility 
                                :facility="'outlets'"
                                :available="space.outlets"
                                :note="space.outlets_note"/>
                            </div>
                        </div>

                        <!-- Food and Drink -->
                        <div class="row mb-3">
                            <!-- Input -->
                            <div class="col">
                                <div class="form-check">
                                    <input 
                                    :disabled="!checkPermission('food_drink_allowed')"
                                    class="form-check-input" type="checkbox" v-model="space.food_drink_allowed" id="FoodAllowed">
                                    <label class="form-check-label" for="FoodAllowed">
                                        Food and Drink Allowed?
                                    </label>
                                </div>
                                <textarea 
                                    :disabled="!checkPermission('food_drink_allowed_note')"
                                    class="form-control" id="descInput" rows="2" placeholder="Default text" 
                                v-model="space.food_drink_allowed_note"></textarea>
                            </div>
                            <!-- Preview -->
                            <div class="col">
                                <AdminFacility 
                                :facility="'food_drink_allowed'"
                                :available="space.food_drink_allowed"
                                :note="space.food_drink_allowed_note"/>
                            </div>
                        </div>

                        <!-- Kettle -->
                        <div class="row mb-3">
                            <!-- Input -->
                            <div class="col">
                                <div class="form-check">
                                    <input  
                                    :disabled="!checkPermission('kettle')"
                                    class="form-check-input" type="checkbox" v-model="space.kettle" id="kettle">
                                    <label class="form-check-label" for="kettle">
                                        Kettle Available?
                                    </label>
                                </div>
                                <textarea  
                                    :disabled="!checkPermission('kettle_note')"
                                    class="form-control" id="descInput" rows="2" placeholder="Default text" 
                                v-model="space.kettle_note"></textarea>
                            </div>
                            <!-- Preview -->
                            <div class="col">
                                <AdminFacility 
                                :facility="'kettle'"
                                :available="space.kettle"
                                :note="space.kettle_note"/>
                            </div>
                        </div>

                        <!-- Microwave -->
                        <div class="row mb-3">
                            <!-- Input -->
                            <div class="col">
                                <div class="form-check">
                                    <input  
                                    :disabled="!checkPermission('microwave')"
                                    class="form-check-input" type="checkbox" v-model="space.microwave" id="microwave">
                                    <label class="form-check-label" for="microwave">
                                        Microwave Available?
                                    </label>
                                </div>
                                <textarea  
                                    :disabled="!checkPermission('microwave_note')"
                                    class="form-control" id="descInput" rows="2" placeholder="Default text" 
                                v-model="space.microwave_note"></textarea>
                            </div>
                            <!-- Preview -->
                            <div class="col">
                                <AdminFacility 
                                :facility="'microwave'"
                                :available="space.microwave"
                                :note="space.microwave_note"/>
                            </div>
                        </div>

                        <!-- Wheelchair -->
                        <div class="row mb-3">
                            <!-- Input -->
                            <div class="col">
                                <div class="form-check">
                                    <input  
                                    :disabled="!checkPermission('wheelchair')"
                                    class="form-check-input" type="checkbox" v-model="space.wheelchair" id="wheelchair">
                                    <label class="form-check-label" for="wheelchair">
                                        Wheelchair Accessible?
                                    </label>
                                </div>
                                <textarea  
                                    :disabled="!checkPermission('wheelchair_note')"
                                    class="form-control" id="descInput" rows="2" placeholder="Default text" 
                                v-model="space.wheelchair_note"></textarea>
                            </div>
                            <!-- Preview -->
                            <div class="col">
                                <AdminFacility 
                                :facility="'wheelchair'"
                                :available="space.wheelchair"
                                :note="space.wheelchair_note"/>
                            </div>
                        </div>

                    </div>
                    <!-- Infobox -->
                    <div class="row mt-3 border-bottom">
                        <div class="col">
                            <!-- Sensory -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input  
                                    :disabled="!checkPermission('sense_exp_display')"
                                    class="form-check-input" type="checkbox" v-model="space.sense_exp_display" id="SenseDisplay">
                                    <label class="form-check-label" for="SenseDisplay">
                                        Sensory Experience
                                    </label>
                                </div>
                                <textarea  
                                :disabled="!checkPermission('sense_exp')"
                                class="form-control" id="descInput" rows="4" 
                                v-model="space.sense_exp"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Youtube link</small></label> -->
                                    <input  
                                    :disabled="!checkPermission('sense_exp_video')"
                                    id="videolink" type="text" class="form-control"
                                    :class="{'is-invalid': space.sense_exp_video != null && space.sense_exp_video.length > 0 && extractYoutubeID(space.sense_exp_video) == null}"
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    v-model="space.sense_exp_video">
                                    <div class="invalid-feedback"
                                    :style="{'display:block' : space.sense_exp_video != null && space.sense_exp_video.length > 0 && extractYoutubeID(space.sense_exp_video) == null}">
                                    Youtube link format is invalid
                                    </div>
                                </div>
                            </div>
                            <!-- Wayfinding -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input  
                                    :disabled="!checkPermission('wayfinding_display')"
                                    class="form-check-input" type="checkbox" v-model="space.wayfinding_display" id="WayfindDisplay">
                                    <label class="form-check-label" for="WayfindDisplay">
                                        Wayfinding
                                    </label>
                                </div>
                                <textarea   
                                    :disabled="!checkPermission('wayfinding')"
                                    class="form-control" id="descInput" rows="4" 
                                v-model="space.wayfinding"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Youtube link</small></label> -->
                                    <input   
                                    :disabled="!checkPermission('wayfinding_video')"
                                    id="videolink" type="text" class="form-control"
                                    :class="{'is-invalid': space.wayfinding_video != null && space.wayfinding_video.length > 0 && extractYoutubeID(space.wayfinding_video) == null}"
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    v-model="space.wayfinding_video">
                                    <div class="invalid-feedback"
                                    :style="{'display:block' : space.wayfinding_video != null && space.wayfinding_video.length > 0 && extractYoutubeID(space.wayfinding_video) == null}">
                                    Youtube link format is invalid
                                    </div>
                                </div>
                            </div>
                            <!-- Physical -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input   
                                    :disabled="!checkPermission('phys_access_display')"
                                    class="form-check-input" type="checkbox" v-model="space.phys_access_display" id="PhysicalDisplay">
                                    <label class="form-check-label" for="PhysicalDisplay">
                                        Physical Experience
                                    </label>
                                </div>
                                <textarea   
                                :disabled="!checkPermission('phys_access')"
                                class="form-control" id="descInput" rows="4" 
                                v-model="space.phys_access"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Youtube link</small></label> -->
                                    <input   
                                    :disabled="!checkPermission('phys_access_video')"
                                    id="videolink" type="text" class="form-control"
                                    :class="{'is-invalid': space.phys_access_video != null && space.phys_access_video.length > 0 && extractYoutubeID(space.phys_access_video) == null}"
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    v-model="space.phys_access_video">
                                    <div class="invalid-feedback"
                                    :style="{'display:block' : space.phys_access_video != null && space.phys_access_video.length > 0 && extractYoutubeID(space.phys_access_video) == null}">
                                    Youtube link format is invalid
                                    </div>
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
                                <div v-for="(tip, index) in space.tips" :key="index" class="input-group mb-2">
                                    <input   
                                    :disabled="!checkPermission('tips')"
                                    type="text" class="form-control" v-model="space.tips[index]" placeholder="New Tip">
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
                        <div class="col" v-if="space.tips && space.tips.length > 0">
                            <AccessTips :tips="space.tips" entity="space"/>
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
                                :disabled="!checkPermission('further_info_display')"
                                class="form-check-input" type="checkbox" v-model="space.further_info_display" id="furtherInfoDisplay">
                                <label class="form-check-label" for="furtherInfoDisplay">
                                    Further Information
                                </label>
                            </div>
                            <textarea   
                            :disabled="!checkPermission('further_info')"
                            class="form-control" id="descInput" rows="4" 
                            v-model="space.further_info"></textarea>
                        </div>
                        <!-- Display -->
                        <div class="col">
                            <div
                            v-if="space.further_info_display">
                                <AdditionalInfo 
                                :info="space.further_info"/>
                            </div>
                        </div>
                    </div>

                    <!-- Map Preview-->
                    <div class="map-section border-top border-1 border-black pt-3 mt-3" v-if="space.location">
                        <!-- Space type and location -->
                        <!-- Inputs -->
                        <div style="grid-area: 'input';" class="me-2"> 
                            <div>
                            <!-- Lat and long inputs -->
                                <div >
                                    <label for="lat" class="form-label">Lat // Lng</label>
                                    <input 
                                    type="text" 
                                    id="lat"
                                    class="form-control"
                                    placeholder="Latitude"
                                    v-model="space.location[0]" 
                                    disabled>
                                </div>
                                
                                <div class="mb-3">
                                    <!-- <label for="long" class="form-label">Longitude</label> -->
                                    <input 
                                    type="text" 
                                    id="long" 
                                    class="form-control"
                                    placeholder="Longitude"
                                    v-model="space.location[1]"  
                                    disabled>
                                </div>

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
                                    @click="centerViewOnSpace()">
                                        Space
                                    </button>
                                </div>
                            </div>
                            <!-- Space Type -->
                            <div class="my-3">
                                <label for="spaceType" class="form-label">Space Type</label>
                                <select  
                                :disabled="!checkPermission('type')"
                                class="form-select" 
                                id="spaceType" 
                                @change="updateSpaceIcon()"
                                v-model="space.type">
                                    <option disabled value="">Select Space Type</option>
                                    <option 
                                    v-for="_type in space_types"
                                    :key="_type.category"
                                    :value="_type.category">
                                    {{ _type.category }}
                                    </option>
                                </select>

                                <!-- Icon Display -->
                                <div class="mt-3 position-relative">
                                    <img 
                                    :src="getImageForSpaceType(space)" 
                                    style="width: 100%;">
                                    <!-- Button to reset the icon to defaults, if an override is in place -->
                                    <button
                                    v-if="space.icon_override && space.icon_override.length > 0" 
                                    :disabled="!checkPermission('icon_override')"
                                    type="button"
                                    class="badge rounded-pill text-bg-danger position-absolute bottom-0 start-0"
                                    @click="resetIconToTypeDefault">
                                        Reset
                                    </button>
                                </div>

                                <!-- Custom Icon -->
                                <div class="mt-3">
                                    <label for="IconOverrideInput" class="form-label"><small>Custom Icon</small></label>
                                    <input id="IconOverrideInput" type="file" class="form-control" 
                                    :disabled="!checkPermission('icon_override')"
                                    @change="handleCustomIconSelect">
                                </div>

                            </div>
                            <div>
                                <!-- Clickability toggle -->
                                <div class="form-check form-switch mb-3 border-top pt-3">
                                    <input 
                                    :disabled="!checkPermission('clickthrough')"
                                    class="form-check-input" type="checkbox" v-model="space.clickthrough" id="clickable">
                                    <label class="form-check-label" for="clickable">
                                        <em>Dummy Icon</em>
                                    </label>
                                </div>
                            </div>   
                        </div>
                        <!-- Map -->
                        <div>
                            <span class="fw-bold">{{hover.active ? hover.space : "Hover over a translucent space to see what it is"}}</span>
                            <div  id="space-placement-map" style="height: 700px; padding-top: 30px; grid-area: 'input';"></div>
                        </div>
                    </div>

                </div>

                <!-- <AdminMarkdownModal 
                :modalOpen="markdownModalOpen" 
                @modalClose="markdownModalOpen = false"
                /> -->

            </div>
        </main>
    </NuxtLayout>
</template>

<script>
import {createClient} from '@supabase/supabase-js';
import L from 'leaflet';
import '~/assets/css/leaflet.css'
import getPermissionsKey from "~/assets/permissionsKey"
import { userHasPermission } from '~/utils/getChanges';
import extractYoutubeID from '~/composables/extractYoutubeID';

const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ];

    export default {
        data() {
            return {
                space: {},
                space_clean: {},
                space_list: [],
                overlays: [],
                markdownModalOpen: false,
                supabase: {},
                space_types: [],
                buildings: [], 
                user: {},
                hover: {active: false, space: ""},
                updateCount: 0, // Dummy variable to force a re-render on the space selector
                map: {},
                center_marker: {},
                permissionsKey: {},
            }
        },
        created() {

            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)
            // Get the user's permissions
            this.getUserData();
            // Get the permissionsKey for Spaces
            this.permissionsKey = getPermissionsKey("spaces");
            // Grab all the space types
            this.getSpaceTypes();
            // Grab all the buildings
            this.getBuildingList();
            // Grab the spaces from the database
            this.getSpaces();
            // Grab the overlays from the database
            this.getOverlays();

            // this.mapInit();

        },
        mounted(){
            // On mount, update the space icon
            // this.updateSpaceIcon();
            // this.loadSpaceToMap();

        },
        computed: {
            infoBoxContent() {
                return setInfoBoxContent(this.space);
            },
            spaceHasBeenChanged() {
                // This function compares the current state of the space against the state it was in when the page was loaded
                // console.log("Checking if space has been changed")
                // console.log(this.space)
                // console.log(this.space_clean)
                return JSON.stringify(this.space) !== JSON.stringify(this.space_clean);
            },

            building_display_name(){
                // Get the display name of the building
                // This is used to display the building name in the space preview
                for (let i = 0; i < this.buildings.length; i++) {
                    if (this.buildings[i].canonical == this.space.building){
                        // console.log(this.buildings[i].display_name)
                        return this.buildings[i].display_name;
                    }
                }
                return "Unknown Building";
            }
        },
        // mounted() {
        // },
        methods: {
            checkPermission(permission){
                // If the user is an admin, they have all permissions on this page
                if (this.user.is_admin){
                    return true;
                }
                // Else, check if the user has the permission to perform an action
                return userHasPermission(this.user, this.permissionsKey, permission);
            },
            async getUserData(){

                this.user = await getCurrentUserPermissions();
            },

            handlePrimaryImageSelect(evt) { 
                // Get the file from the input
                // Set the primary image to the file to preview
                const file = evt.target.files[0];
                this.space.primary_image_url = URL.createObjectURL(file);

                // If the image is a panorama, the variable needs to be toggled to force a redraw
                if (this.space.primary_image_panorama){
                    this.space.primary_image_panorama = false;
                    // Timeout
                    setTimeout(() => {
                        this.space.primary_image_panorama = true;
                    }, 100);
                    this.space.primary_image_panorama = true;
                }
            },

            confirmChangePublishStatus(){
                // Confirm the user wants to change the publish status
                if (window.confirm(`Are you sure you want to ${this.space.published ? "unpublish" : "publish"} ${this.space.name}?`)){
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
                let dummySpace = JSON.parse(JSON.stringify(this.space_clean));
                dummySpace.published = !dummySpace.published;

                // Update the space in the database
                const { data, error } = await updateTable(
                    access_token, 
                    "spaces", 
                    dummySpace,
                    {col: "UUID", eq: this.space.UUID},
                )
                if(error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // If the update was successful, update the clean space object
                    this.space_clean.published = !this.space_clean.published;
                    this.space.published = JSON.parse(JSON.stringify(this.space_clean.published));
                    alert(this.space.name + " has been " + (this.space.published ? "published" : "unpublished"));
                    console.log(data)
                }

                // Update the dummy count to force a re-render
                this.updateCount += 1;

            },

            setDefaultOpenTimesIfNull(data){

                // let opening_times = {};
                if (!data.opening_times) {
                    return {
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
                }

                return data.opening_times;
            },

            handleCustomIconSelect(evt){
                // Get the file from the input
                // Set the iconOverride to the file to preview
                const file = evt.target.files[0];
                this.space.icon_override = URL.createObjectURL(file);

                this.updateSpaceIcon();

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
                let newUrl = this.supabase.storageUrl + "/object/public/primary-images/spaces/" + this.space.canonical + "." + extension;

                // Upload the file to the storage bucket
                const { data, error:upload_error } = await this.supabase.storage
                .from('primary-images')
                .upload(`spaces/${this.space.canonical}.${extension}`, file)
                if (upload_error) {
                    console.error(upload_error)
                    return error
                }
                
                // Clear the primary image input
                document.getElementById("PrimaryImageInput").value = "";

                return newUrl;

            },

            async uploadNewCustomIcon(){
                // Get the file object from the primary image upload input
                // Upsert to the storage bucket as the canonical name
                // TODO: Check if the file already exists under a different extension, and if so, delete it

                // Get the file
                let file = document.getElementById("IconOverrideInput").files[0];
                // Get the file extension
                let extension = file.name.split('.').pop();
                
                // Build the new url for the file
                let newUrl = this.supabase.storageUrl + "/object/public/icons/custom/" + this.space.canonical + "." + extension;

                // Upload the file to the storage bucket
                const { data, error:upload_error } = await this.supabase.storage
                .from('icons')
                .upload(`custom/${this.space.canonical}.${extension}`, file)

                if (upload_error) {
                    // if the file already exists, it's not an error
                    // We just need to update the existing file
                    if (upload_error.statusCode == "409"){
                        console.warn(upload_error)
                        // Update the file
                        const { data, error:update_error } = await this.supabase.storage
                        .from('icons')
                            .update(`custom/${this.space.canonical}.${extension}`, file, {
                                upsert: true
                            })

                        if (update_error) {
                            console.error(update_error)
                            alert(update_error.message)
                            return ""
                        }
                    }
                    else
                    {
                        console.error(upload_error)
                        alert(upload_error.message)
                        return ""
                    }
                }
                
                // Clear the icon input
                document.getElementById("IconOverrideInput").value = "";

                return newUrl;

            },

            // A schema error caused notes to be improperly initialised as "" instead of an empty string
            // This is purely aesthetic
            cleanUpNotes(){

                if (this.space.seating_note == '""' || this.space.seating_note == "\"\""){
                    this.space.seating_note = null;
                }
                if (this.space.outlets_note == '""' || this.space.outlets_note == "\"\""){
                    this.space.outlets_note = null;
                }
                if (this.space.food_drink_allowed_note == '""' || this.space.food_drink_allowed_note == "\"\""){
                    this.space.food_drink_allowed_note = null;
                }
                if (this.space.kettle_note == '""' || this.space.kettle_note == "\"\""){
                    this.space.kettle_note = null;
                }
                if (this.space.microwave_note == '""' || this.space.microwave_note == "\"\""){
                    this.space.microwave_note = null;
                }
                if (this.space.wheelchair_note == '""' || this.space.wheelchair_note == "\"\""){
                    this.space.wheelchair_note = null;
                }

            },

            // This function fetches the student space from the database based on it's canonical name
            async getStudentSpace(canonical){
                console.log("Fetching space: " + canonical);

                // Fetch the space from the database
                // Since we are using the canonical name, we should only get one result
                let { data: space, error } = await this.supabase
                    .from('spaces')
                    .select('*')
                    .eq('canonical', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // Set default opening times if null
                    space[0].opening_times = this.setDefaultOpenTimesIfNull(space[0])

                    // Update the space object with the new data
                    this.space = space[0];

                    // Clean up the notes
                    // this.cleanUpNotes();

                    // Deep copy the space object so we have comparison data
                    this.space_clean = JSON.parse(JSON.stringify(this.space));

                    console.log(space)

                    // Update the map to show the space
                    // Wait for the space_types and buildings list to have loaded first
                    while (!this.mapDataLoaded()) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    // Now we have the space types and buildings, we can load the space to the map
                    this.loadSpaceToMap();

                }
                
            },

            mapDataLoaded(){

                // Checks if the arrays for the map data have been populated
                // Returns true if all are populated, false otherwise
                if (this.space_types.length == 0) return false; 
                if(this.buildings.length == 0) return false;
                if(this.space_list.length == 0) return false;
                if(this.overlays.length == 0) return false;
                if(document.getElementById("space-placement-map") == null) return false;

                return true
                
            },

            async getBuildingList(){
                // Fetch the building list from the database
                let { data: buildings, error } = await this.supabase
                    .from('buildings')
                    .select('canonical, display_name, UUID, always_display, geometry')
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // Update the space object with the new data
                    // console.log("Buildings:")
                    console.log(buildings);
                    this.buildings = sortArrayOfObjectsByKey(buildings, "display_name");
                }
            },

            async getSpaces(){
                // Fetch the spaces list from the database, for dummy display
                let { data: spaces, error } = await this.supabase
                    .from('spaces')
                    .select('canonical, location, type, icon_override, name')
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    this.space_list = spaces;
                }

            },

            async getSpaceTypes(){
                // Fetch the space types from the database
                let { data: space_types, error } = await this.supabase
                    .from('space_styles')
                    .select('*')
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // Update the space object with the new data
                    // console.log("Space types:")
                    // console.log(space_types);
                    this.space_types = space_types;
                }
            },

            async getOverlays(){
                // Fetch the overlays from the database
                const { data: overlays_data, error: overlay_error} = await this.supabase
                .from('overlays')
                .select('*')

                if (overlay_error) {
                    console.log('An error occured while fetching overlays:');
                    console.log(overlay_error);
                }
                else {
                    this.overlays = overlays_data;
                }
            },

            getImageForSpaceType(space){
                // Get the image for the space type

                // First check if the space has a custom icon
                if (this.space.icon_override && this.space.icon_override.length > 0){
                    return this.space.icon_override;
                }
                // Else, Cycle through space types
                // When the category field matches the input, return the image
                // If there are no matches, return the placeholder image
                for (let i = 0; i < this.space_types.length; i++) {
                    if (this.space_types[i].category == space.type){
                        return this.space_types[i].icon;
                    }
                }    
                return '/images/red-dot.png';
            },

            async updateSpaceIcon(){
                // Update the space icon on the map
                // This function is called when the space type is changed
                // It will update the icon on the map to match the new space type
                let newIcon = L.icon({
                        iconUrl: this.getImageForSpaceType(this.space),
                        iconSize: [50, 50],
                        iconAnchor: [25, 25],
                        // popupAnchor: [0, -16],
                    });

                this.center_marker.setIcon(newIcon);
            },

            async loadSpaceToMap(){
                // Regenerate and Set up the basics of the map
                this.initMap();

                // Initialise the centre marker
                this.initCentreMarker();

                // Add the overlays to the map
                this.addOverlays();

                // Add the buildings to the map
                this.addBuildings();

                // Add the other spaces to the map
                this.addDummySpaces();
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
                let map = L.map('space-placement-map', {
                    zoomSnap: 0.25,
                    zoomDelta: 0.25,
                    maxZoom: 20,
                    renderer: L.canvas({padding: 1})
                }).fitBounds(campusBounds);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    maxZoom:20
                }).addTo(map);

                // Cheap debug
                map.on('click', function(e) {
                    let cheapDebugObject = {
                        latlng: e.latlng,
                        bounds: map.getBounds(),
                        zoom: map.getZoom(),
                        center: map.getCenter()
                    }
            
                    console.log(cheapDebugObject);
                    
                });

                this.map = map;

            },

            centerViewOnCampus(){
                // When called, update the map to be centred on the campus
                this.map.fitBounds(campusBounds);
            },

            centerViewOnSpace(){
                // When called, update the map to be centred on the space
                this.map.setView(this.space.location, 18);
            },

            initCentreMarker(){
                // Initialise the centre marker
                // This marker is used to set the space's location
                // It is not interactive

                // Get the icon for this space's type
                let iconURL = this.getImageForSpaceType(this.space);

                // Check the user has permission to move the marker
                let draggable = this.checkPermission('location');

                // Initialise the marker at the location of the space
                this.center_marker = L.marker(this.space.location, {
                    icon: L.icon({
                        iconUrl: iconURL,
                        iconSize: [50, 50],
                        iconAnchor: [25, 25],
                    }),
                    draggable: draggable,
                    zIndexOffset: 1000,
                }).addTo(this.map);

                // Update the view of the map to be centred on the space
                this.centerViewOnSpace();

                // Add event handlers to the map to update the space and marker location:
                // Keep the marker centred on the map

                // Avoid issues with 'this' binding
                let setMarker = this.updateSpaceLocation;

                // When the marker is dragged, update the space's location
                this.center_marker.on('dragend', function(e) {
                    setMarker();
                });

            },

            updateSpaceLocation(){
                // Update the space's location to match the marker
                this.space.location = [this.center_marker.getLatLng().lat, this.center_marker.getLatLng().lng];
            },

            setCenterOfMap(record){

                let center = this.map.getCenter();
                this.center_marker.setLatLng(center);
                // Update the space's location draw, but only record the change on movement end
                if (record)
                this.space.location = [center.lat, center.lng];
            },

            addOverlays() {
                // Go through each overlay and add it to the map
                this.overlays.forEach(overlay => {
                    L.imageOverlay(overlay.url, overlay.bounds).addTo(this.map);
                });
            },

            addBuildings() {

                 // Empty array to hold the layer groups
                let building_geojsons = [];
                // Go through each building and add it to the map
                this.buildings.forEach(building => {
                    try {
                        // Check if the building is always displayed
                        // And that the coordinates are not empty
                        // If it is, add it to the map
                        if (building.always_display && building.geometry.coordinates.length > 0){
                            // Convert building to a valid GeoJSON object
                            let building_geojson = {
                                "type": "Feature",
                                "geometry": {
                                    "coordinates": building.geometry.coordinates,
                                    "type": "Polygon"
                                }
                            }
                            
                            building_geojsons.push(building_geojson);
                        }
                    }
                    catch (error) {
                        console.error("Error adding " + building.canonical + " to map")
                        console.error(error)
                    }
                });

                var buildings_geojson_array = L.geoJSON(building_geojsons, {
                    style: {
                        fillColor: '#0087A2',
                        weight: 1,
                        opacity: 0,
                        color: '#FCE891',
                        dashArray: '0',
                        fillOpacity: 1,
                        noClip:true
                    }
                }).addTo(this.map);
            },

            addDummySpaces(){
                // Go through each space and add it to the map at an opacity of DUMMY_SPACE_OPACITY
                // Except for the currently active space

                const DUMMY_SPACE_OPACITY = 0.5;

                this.space_list.forEach(space => {

                    // Skip the current space
                    if (space.canonical == this.space.canonical) return;

                    // Create the icon object
                    // The className is used to make the icon fade in and out when the zoom changes
                    let myIcon = L.icon({
                        iconUrl: this.getImageForSpaceType(space), 
                        iconSize: [50, 50], 
                        iconAnchor: [25, 25],
                    });

                    // Create the marker object
                    let marker = L.marker(space.location, {
                        icon: myIcon, 
                        opacity: DUMMY_SPACE_OPACITY,})


                    // Localise a function to update hover text
                    let updateHoverText = (active, text) => {
                        this.hover.active = active;
                        this.hover.space = text;
                    }
                    // Add hover action to update the hover text
                    marker.on('mouseover', function(e) {
                        updateHoverText(true, space.name);
                    });
                    marker.on("mouseout", function(e) {
                        updateHoverText(false, "")
                    });

                    marker.addTo(this.map);

                });
            },
            // This function is called when the user clicks the "Save" button
            // It will save the current state of the building to the database
            async updateSpace() {


                // If the primary image has changed, upload it to the storage bucket
                if (document.getElementById("PrimaryImageInput").files.length > 0){
                    this.space.primary_image_url = await this.uploadNewPrimaryImage();
                }

                // If the custom icon has changed, upload it to the storage bucket
                if (document.getElementById("IconOverrideInput").files.length > 0){
                    this.space.icon_override = await this.uploadNewCustomIcon();
                }

                const access_token = await getSessionAccessToken(this.supabase);
                // Update the space in the database
                const { data, error } = await updateTable(
                    access_token, 
                    "spaces", 
                    this.space,
                    {col: "UUID", eq: this.space.UUID},
                )
                
                // If there is an error, log it
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    //TODO: Add a log entry
                    // TODO: Check the response from the database to see if the update was successful
                    // If the update was successful, update the clean space object
                    this.space_clean = JSON.parse(JSON.stringify(this.space));
                    alert(this.space.name + " updated successfully")
                    console.log(data)
                }

                // Update the dummy count to force a re-render
                this.updateCount += 1;
            },

            resetIconToTypeDefault(){
                // Reset the icon to the default for the space type
                // Clear the custom icon input
                document.getElementById("IconOverrideInput").value = "";
                // Remove the icon override from the space object
                this.space.icon_override = "";
                // Update the icon on the map
                this.updateSpaceIcon();
            },

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {

                // Clear the primary image input
                document.getElementById("PrimaryImageInput").value = "";
                // Clear the custom icon input
                document.getElementById("IconOverrideInput").value = "";

                // Deep copy the space_clean object back into the space object
                this.space = JSON.parse(JSON.stringify(this.space_clean));

                // Update the map to show the space
                this.loadSpaceToMap();
            },

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

.map-section{
    /* Define the grid to give enough room for the map */
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-areas: "input map";
    grid-template-rows: auto;
}

</style>