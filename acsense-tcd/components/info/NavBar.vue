<template>

<nav class="navbar fixed-top navbar-info-page bg-primary-subtle diagonal-gradiant">

    <div class="container-fluid" style="position: relative;">

        <a 
        class="navbar-brand nav-logo-base"
        :class="{'nav-logo-search ': searchIsActive}"
        style="font-family: 'Inter', sans-serif; cursor: pointer;"
        @click="$router.push('/')"
        >
            <strong>acsense</strong>
        </a>

        <form 
        class="d-flex me-3 search-base" 
        v-if="!searchBarDisabled"
        role="search"
        @submit.prevent="submitSearch()"
        :class="{'search-active': searchIsActive}">

            <div 
            class="input-group" >
                <input 
                class="form-control"
                type="search" 
                placeholder="Search" 
                @focusin="searchIsActive = true"
                @focusout="searchIsActive = false"
                v-model="searchBoxContent"
                aria-label="Search">
                
                <button 
                class="input-group-text" 
                :class="searchIsActive ? 'bg-success text-white' : ' text-secondary'"
                @click="submitSearch()"
                type="submit" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </button>
            </div>

        </form>

    </div>

</nav>

</template>

<script lang="ts">

export default {
    props: {
        searchBarDisabled: Boolean,
    },
    data() {
        return {
            searchIsActive: false,
            searchBoxContent: '',
        }
    },
    watch: {
        searchIsActive: function (val) {
            console.log(`searchIsActive: ${val}`)
        }
    },
    // computed: {
    //     searchIsActive: function (): boolean {
    //         return this.searchBoxContent.length > 0
    //     }
    // },
    methods: {
        submitSearch() {
            this.$router.push('/info/?search=' + this.searchBoxContent);
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

/* @media screen and (min-width: 1050px) {
    .container-fluid {
        padding-left: 0;
    }
} */
    

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

/* Styles for handling theme changes */
@media screen and (prefers-color-scheme: dark) {
    :root{
        --gradient-blue: #032830;
        --gradient-green: #0d503c;
    }
}
@media screen and (prefers-color-scheme: light) {
    :root{
        --gradient-blue: #9eeaf9;
        --gradient-green: #a6e9d5;
    }
}

.diagonal-gradiant {

    background-image: 
        linear-gradient(
            45deg,
            var(--gradient-blue),
            var(--gradient-green),
            var(--gradient-blue)
        ); 
}


/* Styles for handling search activation on mobile */
.nav-logo-base {
    position: relative; 
    transition: all 0.3s ease;
    left: 0;
}

.search-base{
    transition: all 0.3s ease; 
    position: absolute; 
    right:0;
    width: min(15rem, 40vw)
}

@media screen and (max-width: 500px) {
    
    .nav-logo-search{
    left: -50rem;
    }

    .search-active{
        width: calc(100% - 2rem);
    }
}

</style>