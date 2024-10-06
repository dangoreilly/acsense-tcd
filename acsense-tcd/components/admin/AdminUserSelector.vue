<template>
    <div class="d-flex flex-column flex-shrink-0 py-3 px-3 border-end border-secondary-subtle bg-body-tertiary position-sticky user-selection-sidebar">
        <ul class="nav nav-pills flex-column mb-auto">
            <!-- Highlight the active page by matching it to the activeUser -->
            <li v-for="user in users" style="max-width: 100%;">
                <div
                @click="changeUser(user)"
                class="nav-link link-body-emphasis text-decoration-none user-selection"
                :class="{'bg-yellow-300': user.email === activeUser.email}"
                style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
                :title="user.display_name">
                    <span>{{user.email}}</span>
                </div>
            </li>
        </ul>
    </div>
    </template>
    
    <script>
    import {createClient} from '@supabase/supabase-js';
    
    
    export default {
        data() {
            return {
                activeUser: {},
                users: [
                    {
                        email: 'loading users...',
                    },
                ]
            }
        },
        created() {
            this.getListOfUsers()
        },
        computed: {
            
        },
        methods: {
    
            async getListOfUsers() {
                
                const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
                const supabaseKey = useRuntimeConfig().public.supabaseKey;
                this.supabase = createClient(supabaseUrl, supabaseKey)
    
                // Select All users from supabase
                // Assign them the users array

                let { data: users, error } = await this.supabase
                    .from('contributors')
                    .select('email')
                if (error) {
                    console.log(error)
                    throw error
                }
                else {
                    this.users = sortArrayOfObjectsByKey(users, "email");;
                    this.changeUser(this.users[0]);
                }
            },

            changeUser(user) {
                this.activeUser = user;
                this.$emit('activeUserChanged', this.activeUser.email);
                console.log("Changing user to " + this.activeUser.email);
            },
        }
    };
    
    // useHead({
    //     title: 'Acsense Admin - Contributors',
    //     meta: [
    //         {
    //             name: 'description',
    //             content: 'Acsense Admin page'
    //         }
    //     ],
    //     // link: [
    //     //     {
    //     //         rel: 'stylesheet',
    //     //         href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css'
    //     //     }
    //     // ]
    // })
    
    </script>
    
    
    <style>
    .user-selection-sidebar{
        width: 250px; 
        overflow-y: auto;
        transition: width 0.4s ease-in-out;
    }
    .user-selection-sidebar:hover {
        width: 400px;
    }

    .user-selection {
        cursor: pointer;
    } 
    .user-selection:hover {
        background-color: #e9ecef;
    }
    .active-user-selection {
        background-color: #6bb5ff;
    }
    </style>