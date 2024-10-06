<template>
    <div>
        <!-- For testing, refresh button -->
        <!-- <button @click="refreshPermissions()">Refresh</button> -->
        <!-- <details>
        <summary>{{ modifiedPermissions.email }}</summary> -->
            <!-- <div class="row mb-5 align-items-center"> -->
                <!-- Email -->
                <!-- <div class="col-auto">
                    <label for="exampleFormControlInput1" class="col-form-label">Email address</label>
                </div>
                <div class="col">
                    <input disabled type="email" class="form-control" id="exampleFormControlInput1" :value="modifiedPermissions.email">
                </div>
                <div class="col">
                    <div class="form-check"> -->
                        <!-- Is an admin -->
                        <!-- <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="adminCheckbox" 
                        :value="modifiedPermissions.isAdmin"
                        @change="updateAdminStatus"
                        :disabled="disabled">
                        <label class="form-check-label" for="flexSwitchCheckDefault">Admin User</label>
                    </div>
                </div>
            </div> -->
            

        <!-- Admin status control -->
        <div class="mb-3">
            <!-- Badge to show admin status -->
            <!-- <small 
            v-if="modifiedPermissions.is_admin"
            class="d-inline-flex me-3 px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2">
            User is an admin
            </small> -->
            <!-- Add/remove admin status -->
            <div v-if="isSuperAdmin" class="mt-2">
                <button 
                class="btn btn-outline-danger"
                @click="updateAdminStatus">
                    {{ modifiedPermissions.is_admin ? "Remove admin status" : "Grant admin status" }}
                </button>

                <button 
                class="btn btn-warning ms-3"
                @click="resetPassword">
                Reset Password</button>

                <button 
                class="btn btn-danger ms-3"
                @click="deleteUser">
                Remove Contributor</button>
            </div>
            <div v-if="resetLink != ''" class="m-3">
                <p>Password Reset Request Set</p>
                <p><a :href="mailToLink">Click here to generate an email with link to reset their password</a></p>
                <p>Alternatively, Copy and paste the following link and send it to them. <strong>The link can only be clicked once, so do not click it yourself</strong></p>
                <p>{{ resetLink }}</p>
            </div>
        </div>

        <!-- Cards to divide permissions into Building, Spaces, Map, General categories -->
        <div class="card-grid" v-if="modifiedPermissions">
            <!-- Buildings -->
            <div class="card">
                <div class="card-header">
                    Buildings
                </div>
                <div class="card-body">
                    <!-- Switches for all the building permissions -->
                    <!-- General -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.general.name"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.general.name != user.buildings.general.name}"> 
                            Modify the name 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.general.aka"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.general.aka != user.buildings.general.aka}"> 
                            Modify the "aka" field 
                        </label>  
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.general.desc"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.general.desc != user.buildings.general.desc}"> 
                            Modify the description 
                        </label>  
                    </div>
                    <!-- Primary Image -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.primary_image.image"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.primary_image.image != user.buildings.primary_image.image}"> 
                            Upload new Primary Image 
                        </label>  
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.primary_image.alt"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.primary_image.alt != user.buildings.primary_image.alt}"> 
                            Modify Primary Image alt text 
                        </label>  
                    </div>
                    <!-- Tabs -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.tabs.physical"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.tabs.physical != user.buildings.tabs.physical}"> 
                            Modify the "Physical Access" tab in the infobox 
                        </label>   
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.tabs.wayfinding"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.tabs.wayfinding != user.buildings.tabs.wayfinding}"> 
                            Modify the "Wayfinding" tab in the infobox 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.tabs.sensory"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.tabs.sensory != user.buildings.tabs.sensory}"> 
                            Modify the "Sensory Information" tab in the infobox 
                        </label> 
                    </div>
                    <!-- Gallery -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.gallery.images"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.gallery.images != user.buildings.gallery.images}"> 
                            Upload/Delete Gallery images 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.gallery.captions"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.gallery.captions != user.buildings.gallery.captions}"> 
                            Modify Gallery Image captions 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.gallery.alt"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.gallery.alt != user.buildings.gallery.alt}"> 
                            Modify Gallery Image Alt Text 
                        </label> 
                    </div>
                    <!-- Times -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.times"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.times != user.buildings.times}"> 
                            Modify Opening Times box 
                        </label> 
                    </div>
                    <!-- Tips -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.tips"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.tips != user.buildings.tips}"> 
                            Add/Remove/Modify Access Tips 
                        </label> 
                    </div>
                    <!-- Further Information -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.further"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.further != user.buildings.further}"> 
                            Modify "Further Information & Links" section 
                        </label> 
                    </div>
                    <!-- Map -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.map.labels"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.map.labels != user.buildings.map.labels}"> 
                            Modify labels on map 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.buildings.map.location"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.buildings.map.location != user.buildings.map.location}"> 
                            Modify building shape/location on map 
                        </label> 
                    </div>
                </div>
            </div>

            <!-- Spaces -->
            <div class="card">
                <div class="card-header">
                    Spaces
                </div>
                
                <div class="card-body">
                    <!-- Switches for all the Student Spaces permissions -->
                    <!-- General -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.general.name"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.general.name != user.spaces.general.name}"> 
                            Modify the name 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.general.aka"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.general.aka != user.spaces.general.aka}"> 
                            Modify the "aka" field
                        </label>  
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.general.desc"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.general.desc != user.spaces.general.desc}"> 
                            Modify the description 
                        </label>  
                    </div>
                    <!-- Primary Image -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.primary_image.image"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.primary_image.image != user.spaces.primary_image.image}"> 
                            Upload new Primary Image 
                        </label>  
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.primary_image.alt"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.primary_image.alt != user.spaces.primary_image.alt}"> 
                            Modify Primary Image alt text 
                        </label>  
                    </div>
                    <!-- Tabs -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.tabs.physical"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.tabs.physical != user.spaces.tabs.physical}"> 
                            Modify the "Physical Access" tab in the infobox 
                        </label>   
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.tabs.wayfinding"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.tabs.wayfinding != user.spaces.tabs.wayfinding}"> 
                            Modify the "Wayfinding" tab in the infobox 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.tabs.sensory"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.tabs.sensory != user.spaces.tabs.sensory}"> 
                            Modify the "Sensory Information" tab in the infobox 
                        </label> 
                    </div>
                    <!-- Gallery -->
                    <!-- <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.gallery.images"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.gallery.images != user.spaces.gallery.images}"> 
                            Upload/Delete Gallery images 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.gallery.captions"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.gallery.captions != user.spaces.gallery.captions}"> 
                            Modify Gallery Image captions 
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.gallery.alt"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.gallery.alt != user.spaces.gallery.alt}"> 
                            Modify Gallery Image Alt Text 
                        </label> 
                    </div> -->
                    <!-- Facilities -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.facilities"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.facilities != user.spaces.facilities}"> 
                            Modify Facilities badges/notes 
                        </label> 
                    </div>
                    <!-- Times -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.times"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.times != user.spaces.times}"> 
                            Modify Opening Times box 
                        </label> 
                    </div>
                    <!-- Tips -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.tips"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.tips != user.spaces.tips}"> 
                            Add/Remove/Modify Access Tips 
                        </label> 
                    </div>
                    <!-- Further Information -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.further"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.further != user.spaces.further}"> 
                            Modify "Further Information & Links" section 
                        </label> 
                    </div>
                    <!-- Map -->
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.map.labels"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.map.labels != user.spaces.map.labels}"> 
                            Modify Space Type and icon
                        </label> 
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                        v-model="modifiedPermissions.spaces.map.location"
                        :disabled="disabled || modifiedPermissions.is_admin">
                        <label class="form-check-label"
                        :class="{'text-warning' : modifiedPermissions.spaces.map.location != user.spaces.map.location}"> 
                            Modify space location on map and building 
                        </label> 
                    </div>
                </div>
            </div>
            <!-- Map Misc -->
            <!-- TODO: Add permissions related to flyovers, overlays -->
            <div class="card" style="grid-column-end: span 2">
                <div class="card-header">
                    Map Misc
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" 
                                v-model="modifiedPermissions.map.overlays"
                                :disabled="disabled || modifiedPermissions.is_admin">
                                <label class="form-check-label"
                                :class="{'text-warning' : modifiedPermissions.map.overlays != user.map.overlays}"> 
                                    Add/Remove/Modify the static image Overlays on the main map 
                                </label> 
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" 
                                v-model="modifiedPermissions.map.jumps"
                                :disabled="disabled || modifiedPermissions.is_admin">
                                <label class="form-check-label"
                                :class="{'text-warning' : modifiedPermissions.map.jumps != user.map.jumps}"> 
                                    Add/Remove/Modify the flyover arrows on the main map 
                                </label> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card mt-3 border-0" v-if="permissionsChanged">
            <div class="card-body py-0 px-0">
                <!-- <div class="row rounded-2 px-0 mx-0">
                    <div class="col bg-success-subtle"> -->
                        <!-- Permissions that have been added -->
                        <!-- <p v-for="p in addedPermissions">
                            ++ {{ p }}
                        </p> -->
                    <!-- </div>
                    <div class="col bg-danger-subtle"> -->
                        <!-- Permissions that have been removed -->
                        <!-- <p v-for="p in removedPermissions">
                            -- {{ p }}
                        </p> -->
                    <!-- </div>
                </div>
            </div>
            <div class="card-footer"> -->
                <!-- <div class="row bg-info text-center my-1" v-if="getAdminChanged()">
                        <span v-if="getAdminChanged() == 1" class="fs-5 bg-danger">Admin status granted</span>
                        <span v-if="getAdminChanged() == 2" class="fs-5 bg-warn">Admin status revoked</span> 
                </div> -->
                <div class="row">
                    <!-- <div class="col d-grid">
                        <span>{{ addedPermissions.length }} permissions granted</span>
                        <span>{{ removedPermissions.length }} permissions revoked</span>
                    </div> -->
                    <div class="col d-grid">
                        <button class="btn btn-success mx-5" @click="updatePermissions">Save</button>
                    </div>
                    <div class="col d-grid">
                        <button class="btn btn-warning mx-5" @click="refreshPermissions">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- </details> -->
    </div>
</template>

<script lang="ts">
import type { PermissionsObject } from '~/assets/types/permissions';
import type { UserProfile } from '~/assets/types/permissions';
import { getChanges } from '~/utils/getChanges';


export default {
    props: {
        user: {
            // The permissions array to be edited
            type: Object as () => UserProfile,
            required: true
        },
        // For the view-only mode
        disabled: {
            type: Boolean,
            default: false
        },
        // Flag for if the operator is the superadmin
        isSuperAdmin: {
            type: Boolean,
            default: false
        },
        // To allow for updates
        sessionAccessToken: {
            type: String,
            default: "null",
        }
    },
    watch: {
        user: {
            handler: function() {
                // Update the modifiedPermissions array when the permissions array changes
                this.refreshPermissions()
            },
            deep: true
        }
    },
    data() {
        return {
            modifiedPermissions: {} as UserProfile,
            modified: false,
            resetLink: "",
            mailToLink: "",
        }
    },
    computed: {
        // Check if the permissions have been modified
        permissionsChanged() {
            return JSON.stringify(this.user) != JSON.stringify(this.modifiedPermissions);
        },
    },
    created() {
        // Copy the permissions array to the modifiedPermissions array
        this.refreshPermissions()
    },
    methods: {
        async resetPassword() {

            // Get the current session access token
            // const access_token:string = await getSessionAccessToken(this.supabase);

            let resetLink = "";
            let mailToLink = "";
            // Send a POST request to the api/create-user route with a string payload
            try {
                const data = await $fetch(`/api/create-user`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        jwt: this.sessionAccessToken,
                        data: this.user.email,
                    })

                })

                resetLink = data.recovery_email_data.properties?.action_link as string;
                mailToLink = makeInviteMail(data.recovery_email_data);
                console.log(data.recovery_email_data)
                // alert("User Creation Successful")
            }
            catch (error) {
                console.error("Error creating user", error)
                alert("Error creating user. See console for details")
            }

            this.resetLink = resetLink;
            this.mailToLink = mailToLink;

        },

        async deleteUser() {
            // Confirm the user wants to delete the user
            if(window.confirm(`Are you sure you want to remove ${this.modifiedPermissions.email} from the contributors list?`)) {
                // Send a DELETE request to the api/delete-user route with a string payload
                try {
                    const data = await $fetch(`/api/delete-user`, {
                        method: 'DELETE',
                        body: JSON.stringify({ 
                            jwt: this.sessionAccessToken,
                            data: this.user.email,
                        })

                    })

                    alert("User Deletion Successful")
                    // Emit an event to notify the parent component that the user has been deleted
                    this.$emit('user-deleted')

                }
                catch (error) {
                    console.error("Error deleting user", error)
                    alert("Error deleting user. See console for details")
                }
            }
        },

        updateAdminStatus() {
            // Confirm the user wants to change the admin status
            if(window.confirm(`Are you sure you want to ${this.modifiedPermissions.is_admin ? "revoke" : "grant"} admin rights on ${this.modifiedPermissions.email}? Admins have full access to all features, including creating/removing other contributors.`)) {
                this.modifiedPermissions.is_admin = !this.modifiedPermissions.is_admin;
            } else {
                this.modifiedPermissions.is_admin = this.modifiedPermissions.is_admin;
            }

            // Push the change to the server, ahead of the other permissions
            this.updatePermissions()
        },

        async updatePermissions() {
            // Push updates to the contributors profiles table via the /api/update/profiles route

            console.log("Updating permissions...")

            console.log(getChanges(this.user, this.modifiedPermissions))

            const { data, error } = await updateTable(
                this.sessionAccessToken, 
                "profiles", 
                this.modifiedPermissions,
                {col: "user_id", eq: this.user.user_id}
            )

            // Notify the parent component that the permissions have been updated
            this.$emit('permissions-updated')


        },
        
        async refreshPermissions() {
            // Wait for the user to be set
            while (!this.user || !this.user.email) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            // console.log("Refreshing permissions, user is set")
            // console.log(this.user)
            // console.log("Copying permissions")
            // Copy the permissions array to the modifiedPermissions array
            this.modifiedPermissions = JSON.parse(JSON.stringify(this.user));
            // console.log(this.modifiedPermissions)
        }
    }
}
</script>

<style>
.card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

</style>