<!-- Admin page for displaying logs -->
<!-- Includes a sidebar, a detail view for logs, and a scrollable list of logs -->
<!-- TODO: Add export, delete functionality -->
<template>
<main class="d-flex flex-nowrap" style="height:100vh">
    <AdminSidebar/>
    <div class="activityArea">
        <!-- Title and action buttons -->
        <div class="container-fluid border-bottom border-2 border-black mb-3 d-flex justify-content-between">
            <h1 class="display-6 d-flex">Logs</h1>
            <div class="">
                <button class="btn btn-primary me-2">Export</button>
                <button class="btn btn-danger">Delete</button>
            </div>

        </div>
        <div>
            <p>This is the list of admin actions. Clicking a log entry expands the details into the details pane</p>
        </div>
        <AdminAuditLogDetail
        :selectedLog="selectedLog"/>
        
        

        <AdminAuditLogs
        :logs="logs"
        @update:selection="selectedLog = $event"
        />
    </div>
</main>
</template>

<script>
import Logs from 'assets/example-audit-logs'

export default {
    data(){
        return {
            logs: Logs,
            selectedLog: {},
        }
    },
    mounted() {
        // Set the first log entry as the selected log
        this.selectedLog = this.logs[0];
    },
}
</script>

<style>
body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
}

.activityArea {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;
    background-color: #F5F5F5;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

}
</style>