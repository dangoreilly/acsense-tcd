<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'logs'" :supabase_client="supabase">
        <!-- Header -->
        <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
            <!-- Div to contain construction badge -->
            <div class="d-flex">
                <!-- Title -->
                <h1 class="display-6 d-flex align-items-end">
                    Logs
                </h1>

                <!-- Construction Badge -->
                <!-- <div class="d-flex align-items-center m-3 fs-5">
                    <span class="badge rounded-pill text-bg-success">
                        Demonstration
                    </span>
                </div> -->

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
        v-if="logs.length > 0"
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

<script lang="ts">
// import Logs from 'assets/example-audit-logs'
import type { Audit_Log } from '~/assets/types/supabase_types';
import type { UserProfile } from '~/assets/types/permissions';
import type { ChangesObject } from '~/utils/getChanges';
import { createClient } from '@supabase/supabase-js';

export default {
    data(){
        return {
            logs: [] as Audit_Log[],
            selectedLog: {} as Audit_Log,
            viewOrientation: 'horizontal',
            supabase: {} as any,
            users: [] as UserProfile[]
        }
    },
    created() {
        // Set up supabase
        const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = useRuntimeConfig().public.supabaseKey;
        this.supabase = createClient(supabaseUrl, supabaseKey)

    },
    mounted() {
        this.getUsers();
        this.getLogs();
    },
    methods: {
        async getLogs() {
            // Get the logs from the server
            // Get the current session access token
            const access_token:string = await getSessionAccessToken(this.supabase);

            const { data: logs, error } = await permissionedFetch(access_token, "logs");

            if (error) {
                console.error("Error getting audit logs: ", error)
                // console.error(error)
                // alert(error.message)
                // throw error
            }
            else {
                // console.log("Logs:")
                // console.log(logs)
                this.logs = JSON.parse(JSON.stringify(logs));
                // Set the first log entry as the selected log
                this.selectedLog = this.logs[0];

                // await this.getUsers();
                // Then decode the users
                for (let i = 0; i < this.logs.length; i++) {
                    this.logs[i].user = await this.decodeUser(this.logs[i].user as string);
                }
            }

        },
        async getUsers(){
            // Get the current session access token
            const access_token:string = await getSessionAccessToken(this.supabase);

            const { data: users, error } = await permissionedFetch(access_token, "profiles");

            if (error) {
                console.error("Error getting user profiles: ", error)
                // console.error(error)
                // alert(error.message)
                // throw error
            }
            else {
                // console.log("Logs:")
                // console.log(logs)
                this.users = JSON.parse(JSON.stringify(users));
            }

            return users;
        },
        async decodeUser(userID: string): Promise<string> {
            // Entries in the audit log are stored as a string of the UUID of the user
            // We need to search the users table to find the email of the user
            // If the user has been deleted, we should show the UUID
            
            // First make sure the userID isn't null, and return an error if it is
            if (userID == null) {
                return "Error: User ID is null";
            }

            // Wait for the users to be loaded
            while (this.users.length == 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Search the users table for the user
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].user_id == userID) {
                    return this.users[i].email;
                }
            }
            // If the user is not found, return the UUID
            return userID;

        },
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
        logsToCSV(logs: Audit_Log[]) {
            // Create the header row
            let csv = 'Date,User,Action,Subject,New Value,Old Value\n';
            // Add each log entry to the CSV
            logs.forEach(log => {
                // If the log entry is an UPDATE, add the old and new values
                if (log.action == "UPDATE"){
                    // @ts-ignore
                    csv += `${log.created_at},${log.user},${log.action},${log.subject},${log.data?.new},${log.data?.old}\n`;
                } else {
                    csv += `${log.created_at},${log.user},${log.action},${log.subject},${log.data},\n`;
                }
                // csv += `${log.created_at},${log.user},${log.action},${log.target},${log.oldValue},${log.newValue}\n`;
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
</script>

