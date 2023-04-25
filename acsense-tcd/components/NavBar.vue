<template>

<nav class="navbar fixed-top navbar-info-page bg-primary-subtle">

  <div class="container-fluid">

    <a class="navbar-brand">Acsense</a>

    <form class="d-flex" role="search">

        <!-- <input 
        class="form-control me-2" 
        type="search" 
        placeholder="Search" 
        @focusin="searchIsActive = true"
        @focusout="searchIsActive = false"
        aria-label="Search"> -->

        <!-- <a 
        class="btn btn-outline-success button-collapse-horiz" 
        :style="searchIsActive ? 'width: fit-content' : 'width: 0;'"
        type="submit">
            Search
        </a> -->

        <div class="input-group mb-3">
            <input 
            class="form-control"
            type="search" 
            placeholder="Search" 
            v-model="searchBoxContent"
            aria-label="Search">
            
            <a 
            class="input-group-text" 
            :class="searchIsActive ? 'bg-success text-white' : ' text-secondary'"
            type="submit" 
            id="button-addon2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            </a>
        </div>

    </form>

  </div>

</nav>

</template>

<script lang="ts">

export default {
    data() {
        return {
            // searchIsActive: false,
            searchBoxContent: ''
        }
    },
    watch: {
        searchIsActive: function (val) {
            console.log(`searchIsActive: ${val}`)
        }
    },
    computed: {
        searchIsActive: function (): boolean {
            return this.searchBoxContent.length > 0
        }
    }
}
</script>

<style>

.container-fluid {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
}

.navbar-main-info-page {
    position: fixed !important;
    top: 0;
    padding: 0.5rem 0;
    left: 0;
    right: 0;
    z-index: 100;
    /* box-shadow: 5px 10px rgba(0, 0, 0, 0.2); */
}

.button-collapse-horiz {
    overflow: hidden;
    /* max-width: 0; */
    transition: width 0.2s ease-out;
}

</style>