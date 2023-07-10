<template>
<div class="card mb-3">

    <div class="card-header">
        <h6 class="m-0 text-decoration-none">
            <strong>{{ title }}</strong>
        </h6>
    </div>
    <div class="card-body">
       <slot></slot>
    </div>

</div>
</template>

<script lang="ts">
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
    },
}

</script>

<style>

</style>