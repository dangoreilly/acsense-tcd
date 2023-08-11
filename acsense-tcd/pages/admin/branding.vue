<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'branding'">
        <!-- Header -->
        <div class="border-bottom border-2 border-black mb-3 d-flex">
            <!-- Title -->
            <h1 class="display-6 d-flex align-items-end">
                Branding     
            </h1>

            <!-- Construction Badge -->
            <div class="d-flex align-items-center m-3 fs-5">
                <span class="badge rounded-pill text-bg-warning">
                    Outline Only
                </span>
            </div>

        </div>
        <!-- Main Matter -->
        <!-- Use a ContentDoc as a quick way to insert a summary -->
        <ContentDoc path="/branding" />
    </NuxtLayout>
</template>

<script setup>

definePageMeta({
  middleware: ['auth'],
});

</script>

<style>

</style>