<!-- Component for showing the full detail of an entry in the audit log -->
<!-- Displays 3 columns with a header -->
<!-- The header shows the timestampe of the selected log entry -->
<!-- The first column shows the user, action, name and field in distinct rows -->
<!-- The second column shows the original value of the field being edited -->
<!-- The third column shows the new value of the field -->
<template>
<div>
    <!-- Change the height and flex direction depending on view orientation -->
    <!-- Change the background colour to show if an action is a create or delete -->
    <div class="detail-container position-sticky top-0"
    :class="{
        'bg-success-subtle': selectedLog.action == 'INSERT', 
        'bg-danger-subtle': selectedLog.action == 'DELETE',
        'detail-container-horz': orientation == 'horizontal',
        'detail-container-vert': orientation == 'vertical',
        }">

        <!-- Change the width depending on the view orientation -->
        <div 
        class="detail d-particulars d-col">
            <!-- Timestamp -->
            <div class="detail d-time">
                <label for="timestamp" class="form-label">
                    Timestamp
                </label>
                <input type="email" class="form-control" id="timestamp" :value="selectedLog.created_at" readonly>
            </div>
            <!-- User who carried out action -->
            <div class="detail d-user">
                <label for="user" class="form-label">
                    User
                </label>
                <input type="email" class="form-control" id="user" :value="selectedLog.user" readonly>
            </div>
            <!-- The building or setting that was changed -->
            <div class="detail d-item">
                <label for="target" class="form-label">
                    Subject
                </label>
                <input type="email" class="form-control" id="target" :value="selectedLog.subject" readonly>
            </div>
            <!-- Field that was changed -->
            <!-- <div class="detail d-field">
                <label for="field" class="form-label">
                    Field
                </label>
                <input type="email" class="form-control" id="field" :value="selectedLog.field" readonly>
            </div> -->
        </div>

        <!-- Change the width depending on the view orientation -->
        <div 
        v-if="selectedLog.action == 'UPDATE'"
        class="detail d-particulars d-col">
            <div class="detail d-oldValue">
                <label for="oldValue" class="form-label">
                    Old Value
                </label>
                <!-- <textarea class="form-control" id="oldValue" :value="selectedLog.data?.old" readonly></textarea> -->
                <div class="card">
                    <div class="card-body">
                        <span class="card-text">
                            <p v-for="key in Object.keys(selectedLog.data?.old as Object)">
                                {{ key }}: <br> 
                                {{ //@ts-ignore
                                    selectedLog.data.old[key] 
                                }}
                            </p>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Change the width depending on the view orientation -->
        <div 
        class="detail d-particulars d-col">
            <div class="detail d-newValue">
                <label for="newValue" class="form-label">
                    New Value
                </label>
                <!-- <textarea class="form-control" id="oldValue" :value="selectedLog.data?.new" readonly></textarea> -->
                <div class="card" style="max-height: 100%;">
                    <div class="card-body" style="overflow-y: auto;">
                        <span class="card-text" v-if="selectedLog.action == 'UPDATE'">
                            <p v-for="key in Object.keys(selectedLog.data?.new as Object)">
                                {{ key }}: <br> 
                                {{ //@ts-ignore
                                    selectedLog.data.new[key] 
                                }}
                            </p>
                        </span>
                        <div class="card-text" v-else>
                            <p v-for="key in Object.keys(selectedLog.data as Object)">
                                {{ key }}: <br> 
                                {{ //@ts-ignore
                                    selectedLog.data[key] 
                                }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import type { Audit_Log } from '~/assets/types/supabase_types'

export default {
    props: {
        // The selected log entry object
        selectedLog: {
            type: Object as () => Audit_Log,
            required: true
        },
        orientation: {
            type: String,
            required: true,
        },
    },
    // methods: {
    // }
}

</script>

<style>

/* Temp style to visualise sections */
.d-col {
    /* border: 1px solid black; */
    /* width: 33.3%; */
    flex-grow: 1;
    height: 100%;
    width: 100%;
    /* flex-direction: column;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start; */
    
}

.d-particulars {
    /* border: 1px solid red; */
    padding-left: 1rem;
}
.detail {
    /* border: 1px solid red; */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}
.d-row {
    flex-direction: row;
}

label.form-label {
    font-weight: bold;
    margin-top: 0.1rem;
    margin-bottom: 0;
    /* padding-left: 0.75rem; */
}
textarea.form-control {
    height: 100%;
    resize: none;
}

.d-oldValue, .d-newValue {
    height: calc(100% - 3rem);
}


.detail-container {
    display: flex;
    /* flex-direction: row; */
    justify-content:space-evenly;
    align-items: center;
    /* width: 100%; */
}

.detail-container-vert {
    height: 100%; 
    width:30vw; 
    flex-direction: column;
}
.detail-container-horz {
    height: 30vh; 
    width: 100%; 
    flex-direction: row;
}

</style>