<template>
    <div class="container table-container" 
    style="height:70vh; overflow-y: auto;">
        <table class="table table-hover">
            <thead>
                <tr class="sticky-header">
                    <th scope="col">Timestamp</th>
                    <th scope="col">User</th>
                    <th scope="col">Action</th>
                    <th scope="col">Target</th>
                    <th scope="col">Field</th>
                    <th scope="col" colspan="2">Old Value</th>
                    <th scope="col" colspan="2">New Value</th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="log in logs"
                @click="selection = log"
                style="cursor: pointer;"
                :class="{'bg-primary fw-semibold text-white row-hover': log == selection,'bg-success-subtle': log.action == 'create', 'bg-danger-subtle': log.action == 'delete'}"
                >
                    <td>{{ log.time }}</td>
                    <td>{{ log.user }}</td>
                    <td>{{ log.action }}</td>
                    <td>{{ log.target }}</td>
                    <td>{{ log.field }}</td>
                    <td colspan="2">{{ log.oldValue }}</td>
                    <td colspan="2">{{ log.newValue }}</td>
                </tr>
                
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    props: {
        // The selected log entry object
        logs: []
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
            this.$emit('update:selection', val);
        },
        deep: true,
        },
    },

}
</script>

<style>
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