<!-- Parse the AdditionalInfo and display it -->
<template>
<div class="mx-3 p-3">
    <h3>Further Information & Links</h3>
    <div v-html="parsedContent"></div>
</div>
</template>

<script lang="ts">
export default {
    props:{
        info: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            parsedContent: '',
        }
    },
    mounted() {
        this.parsedContent = mdParser(this.info);
    },
}
</script>

<style>
</style>