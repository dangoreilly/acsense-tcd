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
            

        <!-- Cards to divide permissions into Building, Spaces, Map, General categories -->
        <div class="card-grid">
            <!-- Buildings -->
            <div class="card">
                <div class="card-header">
                    Buildings
                </div>
                <div class="card-body">
                    <!-- Switches for all the building permissions -->
                    <div class="form-check" v-for="permission in modifiedPermissions.buildings">
                        <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :id="permission.key"
                        v-model="permission.value"
                        :disabled="disabled || modifiedPermissions.isAdmin">
                        <label class="form-check-label" :for="permission.key" :title="permission.key">
                            {{ permission.label }}
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
                    <div class="form-check" v-for="permission in modifiedPermissions.spaces">
                        <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :id="permission.key"
                        v-model="permission.value"
                        :disabled="disabled || modifiedPermissions.isAdmin">
                        <label class="form-check-label" :for="permission.key" :title="permission.key">
                            {{ permission.label }}
                        </label>
                    </div>
                </div>
            </div>
            <!-- Map Misc -->
            <div class="card">
                <div class="card-header">
                    Map Misc
                </div>
                <div class="card-body">
                    <!-- Switches for all the building permissions -->

                </div>
            </div>
            <!-- General -->
            <div class="card">
                <div class="card-header">
                    General Info
                </div>
                <div class="card-body">
                    <!-- Switches for all the building permissions -->

                </div>
            </div>
        </div>
        <div class="card mt-3" v-if="modified">
            <div class="card-boid">
                <div class="row">
                    <div class="col bg-success-subtle">
                        <!-- Permissions that have been added -->
                        <p v-for="p in addedPermissions">
                            ++ {{ p }}
                        </p>
                    </div>
                    <div class="col bg-danger-subtle">
                        <!-- Permissions that have been removed -->
                        <p v-for="p in removedPermissions">
                            -- {{ p }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <!-- <div class="row bg-info text-center my-1" v-if="getAdminChanged()">
                        <span v-if="getAdminChanged() == 1" class="fs-5 bg-danger">Admin status granted</span>
                        <span v-if="getAdminChanged() == 2" class="fs-5 bg-warn">Admin status revoked</span> 
                </div> -->
                <div class="row">
                    <div class="col d-grid">
                        <span>{{ addedPermissions.length }} permissions granted</span>
                        <span>{{ removedPermissions.length }} permissions revoked</span>
                    </div>
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
import type { PermissionsArray } from '~/assets/types/permissions';


export default {
    props: {
        permissions: {
            // The permissions array to be edited
            type: Object as () => PermissionsArray,
            required: true
        },
        // For the view-only mode
        disabled: {
            type: Boolean,
            default: false
        }
        
    },
    data() {
        return {
            modifiedPermissions: {} as PermissionsArray,
            modified: false,
            addedPermissions: [] as string[],
            removedPermissions: [] as string[]
        }
    },
    watch: {
        permissions: {
            handler: function() {
                // Update the modifiedPermissions array when the permissions array changes
                this.refreshPermissions()
            },
            deep: true
        },
        modifiedPermissions: {
            handler: function() {
                // Update the modified flag when the modifiedPermissions array changes
                this.modifyPermissions()
            },
            deep: true
        }
    },
    mounted() {
        // Copy the permissions array to the modifiedPermissions array
        this.refreshPermissions()
    },
    methods: {
        // Count number of permissions that added compared to the original permissions
        getRemovedPermissions() {
            // Count the number of permissions that are true in the modifiedPermissions array but not in the permissions array

            // If the permissions object is not defined, return an empty array
            // This is is to prevent loading errors
            if (this.permissions.email == undefined) {
                console.log("Permissions object not defined")
                return [];
            }

            let count = 0;
            let list = []
            
            // Loop through the categories of permissions
            // Updating the user object with the new values
            // buildings
            for (let i = 0; i < this.modifiedPermissions.buildings.length; i++) {
                let old_val = this.permissions.buildings[i].value
                let new_val = this.modifiedPermissions.buildings[i].value

                if (old_val && !new_val) {
                    count++;
                    list.push(this.modifiedPermissions.buildings[i].label)
                }
            }
            // spaces
            for (let i = 0; i < this.modifiedPermissions.spaces.length; i++) {
                let old_val = this.permissions.spaces[i].value
                let new_val = this.modifiedPermissions.spaces[i].value
                
                if (old_val && !new_val) {
                    count++;
                    list.push(this.modifiedPermissions.spaces[i].label)
                }
            }
            // map_misc
            for (let i = 0; i < this.modifiedPermissions.map_misc.length; i++) {
                let old_val = this.permissions.map_misc[i].value
                let new_val = this.modifiedPermissions.map_misc[i].value
                
                if (old_val && !new_val) {
                    count++;
                    list.push(this.modifiedPermissions.map_misc[i].label)
                }
            }
            // general
            for (let i = 0; i < this.modifiedPermissions.general.length; i++) {
                let old_val = this.permissions.general[i].value
                let new_val = this.modifiedPermissions.general[i].value
                
                if (old_val && !new_val) {
                    count++;
                    list.push(this.modifiedPermissions.general[i].label)
                }
            }

            return list;
        },
        // Count number of permissions that removed compared to the original permissions
        getAddedPermissions() {
            // Count the number of permissions that are true in the permissions array but not in the modifiedPermissions array

            // If the permissions object is not defined, return an empty array
            // This is is to prevent loading errors
            if (this.permissions.email == undefined) {
                return [];
            }

            let count = 0;
            let list = []


            // Loop through the categories of permissions
            // Updating the user object with the new values
            // buildings
            for (let i = 0; i < this.modifiedPermissions.buildings.length; i++) {
                let old_val = this.permissions.buildings[i].value
                let new_val = this.modifiedPermissions.buildings[i].value

                if (!old_val && new_val) {
                    count++;
                    list.push(this.modifiedPermissions.buildings[i].label)
                }
            }
            // spaces
            for (let i = 0; i < this.modifiedPermissions.spaces.length; i++) {
                let old_val = this.permissions.spaces[i].value
                let new_val = this.modifiedPermissions.spaces[i].value
                
                if (!old_val && new_val) {
                    count++;
                    list.push(this.modifiedPermissions.spaces[i].label)
                }
            }
            // map_misc
            for (let i = 0; i < this.modifiedPermissions.map_misc.length; i++) {
                let old_val = this.permissions.map_misc[i].value
                let new_val = this.modifiedPermissions.map_misc[i].value
                
                if (!old_val && new_val) {
                    count++;
                    list.push(this.modifiedPermissions.map_misc[i].label)
                }
            }
            // general
            for (let i = 0; i < this.modifiedPermissions.general.length; i++) {
                let old_val = this.permissions.general[i].value
                let new_val = this.modifiedPermissions.general[i].value
                
                if (!old_val && new_val) {
                    count++;
                    list.push(this.modifiedPermissions.general[i].label)
                }
            }

            return list;
        },

        // TODO: Figure out how to handle admin status changes

        // getAdminChanged() {
        //     // Because admin status is different from the other permissions, we need a separate function to check if it has changed
        //     // Check if the admin status has changed
        //     // 0 -> Admin status not changed
        //     // 1 -> Admin status granted
        //     // 2 -> Admin status revoked
        //     let adminStatus = 0 
        //     if (this.permissions.isAdmin && !this.modifiedPermissions.isAdmin) {
        //         adminStatus = 2
        //     } else if (!this.permissions.isAdmin && this.modifiedPermissions.isAdmin) {
        //         adminStatus = 1
        //     };

        //     return adminStatus;
        // },

        // updateAdminStatus() {
        //     // Confirm the user wants to change the admin status
        //     if(window.confirm(`Are you sure you want to ${this.permissions.isAdmin ? "revoke" : "grant"} admin rights on ${this.modifiedPermissions.email}? Admins have full access to all features, including creating/removing other admins`)) {
        //         this.modifiedPermissions.isAdmin = !this.permissions.isAdmin;
        //     } else {
        //         this.modifiedPermissions.isAdmin = this.permissions.isAdmin;
        //     }
        // },

        permissionsChanged() {
            // console.log(this.removedPermissions)
            return this.addedPermissions.length + this.removedPermissions.length > 0;
            return false
        },

        modifyPermissions() {
            // Update the modifications arrays, update the permissionsChanged flag
            console.log('Permissions modified')

            this.addedPermissions = this.getAddedPermissions();
            console.log(JSON.parse(JSON.stringify(this.addedPermissions)))

            this.removedPermissions = this.getRemovedPermissions();
            console.log(JSON.parse(JSON.stringify(this.removedPermissions)))

            this.modified = this.permissionsChanged();
        },
        updatePermissions() {
            // Emit an event to publish the modified permissions back to the parent
            // First, check if the permissions have *actually* changed
            if (this.permissionsChanged()) {
                this.$emit('permissions-updated', this.modifiedPermissions);
            }
            // Otherwise, we're probably just doing the initial load
        },
        refreshPermissions() {
            // Copy the permissions array to the modifiedPermissions array
            this.modifiedPermissions = JSON.parse(JSON.stringify(this.permissions));
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