<template>
    <div class="d-flex flex-column flex-shrink-0 py-3 px-3 border-end border-secondary-subtle bg-body-tertiary position-sticky admin-sidebar">
        <a href="/admin" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <!-- <svg
            class="bi bi-x-diamond-fill me-2" 
            viewBox="0 0 16 16" 
            xmlns="http://www.w3.org/2000/svg" 
            width="16px" 
            height="16" 
            fill="currentColor" >
                <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098l2.904 2.905z"/>
            </svg> -->
          <span class="fs-4 admin-sidebar-span">Admin Panel</span>
        </a>
        <hr>
        <ul class="nav nav-pills flex-column mb-auto">
            <!-- Highlight the active page by matching it to the activeTab prop -->
            <li v-for="tab in tabs">
                <NuxtLink
                :to="tab.key" 
                :class="tab.key == activeTab ? 'active-sidebar-tab active' : ''"
                class="nav-link link-body-emphasis">
                    <span class="admin-sidebar-span">
                        <i :class="tab.icon"></i>
                        {{ tab.name }}
                    </span>
                </NuxtLink>
            </li>
        </ul>
        <hr>
        <div>
            <a 
            href="#"
            @click="logout" 
            class="d-flex align-items-center link-body-emphasis text-decoration-none" 
            title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                </svg>
                <strong class="ps-3"><span class="admin-sidebar-span">{{currentUser ? currentUser.email : "??"}}</span></strong>
            </a>
        </div>
    </div>
</template>
    
<script>

    // import {createClient} from '@supabase/supabase-js';
    
    
    export default {
        props: {
            activeTab: {
                type: String,
                required: true,
            },
            supabase_client: {
                type: Object,
                required: true,
            },
            // session: {
            //     type: Object,
            //     required: true,
            // }
            
        },
        data() {
            return {
                tabs: [
                    {
                        name: 'Analytics',
                        key: 'analytics',
                        icon: 'bi bi-graph-up',
                    },
                    {
                        name: 'Buildings',
                        key: 'buildings',
                        icon: 'bi bi-building-gear',
                    },
                    {
                        name: 'Student Spaces',
                        key: 'spaces',
                        icon: 'bi bi-cup-hot',
                    },
    
                    // {
                    //     name: 'Floorplans',
                    //     key: 'floorplans',
                    //     icon: 'bi bi-columns',
                    // },
                    // {
                    //     name: 'Map',
                    //     key: 'map',
                    //     icon: 'bi bi-map',
                    // },
                    // {
                    //     name: 'Branding',
                    //     key: 'branding',
                    //     icon: 'bi bi-brush',
                    // },
                    {
                        name: 'Contributors',
                        key: 'contributors',
                        icon: 'bi bi-people',
                    },
                ],
                adminTabs: [
                    {
                        name: 'General Info',
                        key: 'general-info',
                        icon: 'bi bi-info-circle',
                    },
                    {
                        name: 'Audit Logs',
                        key: 'logs',
                        icon: 'bi bi-card-checklist',
                    },
                ],
                currentUser: null,
            }
        },
        created() {
            // Get the user ID for reporting
            this.getCurrentUser();
            // The user profile will also tell us whether to reveal the admin-only pages

        },
        mounted() {
            // Check the user permissions and set the tabs accordingly
            this.filterMenuItems();
        },
        methods: {
            async logout() {
                console.log("User logging out")
                const {error} =  await this.supabase_client.auth.signOut()
                if (error) {
                    console.log(error)
                }
                navigateTo('./login')
            },
    
            async getCurrentUser() {

                // // Wait for the session to be set
                // while (!this.session.user) {
                //     await new Promise(r => setTimeout(r, 100));
                // }
                // this.currentUser = this.session.user;

                // Get the current user and their permissions
                const _currentUser = await getCurrentUserPermissions();
                // Copy the user object to avoid reactivity issues
                this.currentUser = JSON.parse(JSON.stringify(_currentUser));
                
            },

            async filterMenuItems(){
                // If the current user is not an admin, add the "admin" tabs
                // Function is named "filter" because this was carried out backwards for a time

                // Pause to let the user load
                while (!this.currentUser) {
                    await new Promise(r => setTimeout(r, 100));
                }

                // if the user is an admin, show the admin tabs
                if (this.currentUser.is_admin) {
                    this.tabs = this.tabs.concat(this.adminTabs);
                }
            }
        }
    };
    
    
</script>


<style>
    i {
        margin-right: 0.5rem;
        font-size: larger;
    }
    
    .admin-sidebar {
        /* width: 60px; */
        width: 280px;
        transition: width 0.4s ease-in-out;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }
    .admin-sidebar-span {
        /* opacity: 0; */
        white-space: nowrap;
        transition: opacity 0.4s ease-in-out;
        /* display: none; */
    }
    .active-sidebar-tab {
        color: white !important;
    }
    
    /* .admin-sidebar:hover {
        width: 280px;
    } */
    /* .admin-sidebar:hover .admin-sidebar-span {
        opacity: 1;
        display: inline;
    } */
</style>