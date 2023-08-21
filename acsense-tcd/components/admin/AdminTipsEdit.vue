<template>

    <div>
        <div class="card-body">
            <ul class="list-group list-group-flush">
                <li 
                v-for="tip in tips" 
                class="list-group-item">
                    <input type="text" v-model="tip" />
                </li>
            </ul>
        </div>
    </div>
    
    </template>
    
    <script>
    
    export default {
        props: {
            tips : {
                type: Array,
                required: true,
            }
        },
    }
    
    </script>
    
    <style>

    </style>