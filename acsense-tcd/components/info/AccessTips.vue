<template>

<div class="card access-tips-card" id="access-tips-box">
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
        },
        
        // An optional scroll amount to track the visibility of the element
        scrollAmount: {
            type: Number,
            default: 0,
            required: false,
        },
    },
    data() {
        return {
            activeInfoTab: 0,
            // tabs: [],
            elementHasBeenViewed: false,
            elementIsVisible: false,

        }
    },
    watch: {
        // Watch the scroll amount, every time it updates, check the visibility of the element
        scrollAmount() {

            // Check if this is a real scroll event or just an artifact of the page loading
            // Make sure the scroll amount is greater than 0
            if (this.scrollAmount == 0) {
                // Check if the element is in view
                return;
            }
            // Check if the element is in view
            // Get the element
            let el = document.getElementById('access-tips-box');
            // Check the element exists, otherwise return false
            if (!el) {
                console.log('Element does not exist');
                return false;
            }
            let boundingBox = el.getBoundingClientRect();
            // console.log(boundingBox);
            let boxIsInViewport = (
                boundingBox.top >= 0 &&
                boundingBox.left >= 0 &&
                boundingBox.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                boundingBox.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (boxIsInViewport)
                this.onElementVisibility();
        }
    },
    methods: {
        onElementVisibility() {
            // Check if the element is in view
            this.elementIsVisible = true;
            // console.log('Element is visible: ' + state);
            // Pause for 100ms to allow the element to be fully in view
            // await new Promise(r => setTimeout(r, 100));
            // Check if the element has been viewed before
            if (!this.elementHasBeenViewed) {
                this.elementHasBeenViewed = true;
                // console.log('AccessTips has been viewed!');
                // Send an event to the server
                plausibleEvent('AccessTipsViewed');
            }
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