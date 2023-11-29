<template>

<div class="card access-tips-card">
    <div class="card-header">
        <h6 class="m-0">
            <strong>Access Tips | </strong>
            <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=jb6V1Qaz9EWAZJ5bgvvlK19m7VaqSzBAqvP3e08WnHFUMkVaUjkyWEc5WTNWMDY3OThNOU9ERVZRNS4u" target="_blank" class="small"> Submit a tip</a>
        </h6>
    </div>
    <div class="card-body">
        <!-- If there are tips, display them -->
        <ul v-if="tips.length > 0" class="list-group list-group-flush">
            <li 
            v-for="tip in tips" 
            class="list-group-item">
                {{ tip }}
            </li>
        </ul>
        <!-- Otherwise, Invite some -->
        <span v-else><em>This {{entity}} has no tips! Why don't you submit one?</em></span>
    </div>
</div>

</template>

<script lang="ts">

export default {
    props: {
        tips : {
            type: Array as () => string[],
            required: true,
        },
        entity : {
            type: String,
            required: true,
        }
    }
}

</script>

<style>
.access-tips-card {
    height: 100%;
    position: relative;
    /* min-width: min(25rem, 90vw); */
}

.access-button-position {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
}

@media screen and (max-width: 768px) {
    .access-tips-card {
        margin-left: 1rem;
        margin-right: 1rem;
    }
}
</style>