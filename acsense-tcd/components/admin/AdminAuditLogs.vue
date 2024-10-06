<template>
    <div class="g-0 table-container" 
    :style="orientation == 'horizontal' ? 'height:60vh;' : 'height:90vh;' ">
        <table class="table table-hover">
            <thead>
                <tr class="sticky-header">
                    <th scope="col">Timestamp</th>
                    <th scope="col">User</th>
                    <th scope="col">Action</th>
                    <th scope="col">Target</th>
                    <!-- Show more detail if in horizontal view -->
                    <!-- <th v-if="orientation == 'horizontal'" scope="col">Field</th> -->
                    <th v-if="orientation == 'horizontal'" scope="col" colspan="2">Old Value</th>
                    <th v-if="orientation == 'horizontal'" scope="col" colspan="2">New Value</th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="log in logs"
                @click="selection = log"
                style="cursor: pointer;"
                :class="{'bg-primary fw-semibold text-white row-hover': log == selection,'bg-success-subtle': log.action == 'create', 'bg-danger-subtle': log.action == 'delete'}"
                >
                    <td>{{ log.created_at }}</td>
                    <td>{{ log.user }}</td>
                    <td>{{ log.action }}</td>
                    <td>{{ log.subject }}</td>
                    <!-- Show more detail if in horizontal view -->
                    <!-- <td v-if="orientation == 'horizontal'">{{ log.field }}</td> -->
                    <td v-if="orientation == 'horizontal'" colspan="2">{{ 
                            log.action == "UPDATE" ? 
                            JSON.stringify(log.data?.old) : 
                            "N/A" 
                        }}</td>
                    <td v-if="orientation == 'horizontal'" colspan="2">{{ 
                        log.action == "UPDATE" ? 
                        JSON.stringify(log.data?.new) : 
                        JSON.stringify(log.data) 
                        }}</td>
                </tr>
                
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import type { Audit_Log } from '~/assets/types/supabase_types';


export default {
    props: {
        // The selected log entry object
        logs: {
            type: Array as () => Audit_Log[],
            required: true,
        },
        orientation: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            selection: {}, // The selected log entry object
        }
    },

    // Emit the selected log entry to the parent component
    emits: ['update:selection'],
    watch: {
        selection: {
        handler: function (val) {
            // @ts-ignore
            this.$emit('update:selection', val);
        },
        deep: true,
        },
    },
    // methods: {
    //     // Emit the selected log entry to the parent component
    //     selectLog(log: Audit_Log) {
    //         this.$emit('update:selection', log);
    //     }
    // }

}
</script>

<style>
.table-container {
    overflow-y: auto;
    overflow-x: hidden;
}
table {
    width: 100%; 
    white-space: nowrap; 
    table-layout: fixed;
    overflow-y: scroll;
    height: 100%;  
    border-collapse: separate; /* Don't collapse */
    border-spacing: 0;
}

thead, th, .sticky-header {
    position: sticky;
    top: 0;
    background-color: var(--bs-gray-100);
    z-index: 1;
    border-style: solid;
    border-bottom-width: 0.5rem;
    border-color: black;
}

td {
    overflow: hidden; 
    text-overflow: ellipsis

}
body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
}
</style>