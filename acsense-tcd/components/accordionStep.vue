<!-- Quick and dirty component for handling collapsable accordion steps -->
<!-- Must be contained in <div class="accordion"><\div> -->
<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button 
            class="accordion-button"
            :class="isOpen ? '' : 'collapsed'"
            @click="isOpen = !isOpen">
                <slot name="AccordionStepHeader">Step Header</slot>
            </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse"
            :class="isOpen ? 'show' : ''">
            <div class="accordion-body">
                <slot name="AccordionStepBody">Step Body</slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
        }
    }
}
</script>