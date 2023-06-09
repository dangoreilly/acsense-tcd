<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'logs'">
        <!-- Header -->
        <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
            <!-- Div to contain construction badge -->
            <div class="d-flex">
                <!-- Title -->
                <h1 class="display-6 d-flex align-items-end">
                    Logs
                </h1>

                <!-- Construction Badge -->
                <div class="d-flex align-items-center m-3 fs-5">
                    <span class="badge rounded-pill text-bg-success">
                        Demonstration
                    </span>
                </div>

            </div>

            <!-- Buttons -->
            <div class="">
                <!-- Change View -->
                <button
                title="Change View" 
                class="btn btn-secondary me-2">
                    <!-- Rotate the icon to show the change in orientation -->
                    <i 
                    class="bi bi-layout-split m-0"
                    @click="changeView"
                    :style="viewOrientation == 'vertical' ? 'display:inline-block; transform: rotate(90deg);' : ''"
                    ></i>
                </button>
                <!-- Download as CSV -->
                <button 
                title="Download Logs"
                class="btn btn-secondary">
                    <i class="bi bi-download m-0"
                    @click="downloadLogs"
                    ></i>
                </button>
            </div>

        </div>
        <!-- Display panes as rows if viewOrientation is horizontal -->
        <!-- Display panes as cols if viewOrientation is vertical -->
        <div 
        class="d-flex flex-nowrap" 
        :style="viewOrientation == 'vertical' ? 'flex-direction: row;' : 'flex-direction: column;'">
            <AdminAuditLogDetail
            :selectedLog="selectedLog"
            :orientation="viewOrientation"/>

            <AdminAuditLogs
            :logs="logs"
            :orientation="viewOrientation"
            @update:selection="selectedLog = $event"/>
        
        </div>
    </NuxtLayout>
</template>

<script>
import Logs from 'assets/example-audit-logs'

export default {
    data(){
        return {
            logs: Logs,
            selectedLog: {},
            viewOrientation: 'horizontal',
        }
    },
    mounted() {
        // Set the first log entry as the selected log
        this.selectedLog = this.logs[0];
    },
    methods: {
        // Flip the view orientation
        changeView() {
            if (this.viewOrientation == 'horizontal') {
                this.viewOrientation = 'vertical';
            } else {
                this.viewOrientation = 'horizontal';
            }
        },
        // Convert the logs to a CSV and download it
        downloadLogs() {
            // Convert the logs to a CSV
            let csv = this.logsToCSV(this.logs);
            // Create a blob from the CSV
            let blob = new Blob([csv], {type: 'text/csv'});
            // Create a URL from the blob
            let url = window.URL.createObjectURL(blob);
            // Create a link element to download the blob
            let link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${this.generateTimestamp()}_logs.csv`);
            // Click the link to download the blob
            link.click();
        },
        // Convert the logs to a CSV
        logsToCSV(logs) {
            // Create the header row
            let csv = 'Date,User,Action,Target,Old Value,New Value\n';
            // Add each log entry to the CSV
            logs.forEach(log => {
                csv += `${log.date},${log.user},${log.action},${log.target},${log.oldValue},${log.newValue}\n`;
            });
            return csv;
        },
        // Generate a timestamp string for the current time
        generateTimestamp() {
            let date = new Date();
            let timestamp = `${date.getFullYear()}${date.getMonth()}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
            return timestamp;
        }
    }
}

definePageMeta({
  layout: false,
});
</script>

