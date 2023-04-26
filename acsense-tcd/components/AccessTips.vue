<template>

<div class="card access-tips-card">
    <div class="card-header">
        Access Tips | 
        <a class="small"> Submit a tip</a>
    </div>
    <div class="card-body">
        <ul class="list-group list-group-flush">
            <li 
            v-for="tip in tips" 
            class="list-group-item">
                {{ tip }}
            </li>
        </ul>
    </div>
</div>

</template>

<script lang="ts">

export default {
    props: {
        tips : {
            type: Array as () => string[],
            required: true,
        }
    }
}

</script>

<style>
.access-tips-card {
    height: 100%;
    position: relative;
    min-width: min(25rem, 90vw);
}

.access-button-position {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
}
</style>