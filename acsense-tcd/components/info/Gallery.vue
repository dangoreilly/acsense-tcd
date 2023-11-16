<template>
<div class="container gallery">
    <h3 class="border-3 border-bottom mb-2">Gallery</h3>
    <!-- Grid Layout -->
    <div class="row row-cols-1 row-cols-md-3 gy-4">
        <div 
        v-for="i in galleryImages"
        class="col themed-grid-col">

            <!-- Gallery card -->
            <div 
            class="border border-2 p-1 galleryPictureCard"
            @click="highlightThis(i)"
            >
            <!-- If the card is clicked, the class of the image is updated -->
            <!-- to turn it into a modal -->
                <img 
                :src="i.url" 
                class="card-img galleryPictureImg"
                :alt="i.alt">
                <div v-if="i.caption" class="card-body p-2">
                    <p class="card-text">{{ i.caption }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for blowing up the gallery pictures -->
    <!-- Including it in the gallery component is much simpler than -->
    <!-- creating a distinct component, since it doesn't interact -->
    <!-- with any other data -->

    <div 
    class="modal modal-xl show" 
    tabindex="-1" 
    @click.self="modalVisible=false"
    aria-modal="true" 
    role="dialog" 
    :style="modalVisible ? 'display: block;' : 'display: none;'">

        <div class="modal-dialog modal-dialog-centered"
        style="max-height: 90vh;">
            <div class="modal-content">

                <!-- Image with close button in top right corner -->
                <div class="modal-body">
                    <button 
                    type="button" 
                    class="btn-close position-absolute top-0 end-0 m-4 border-pill border bg-light"  
                    style="width: 2rem; height: 2rem;"
                    @click="modalVisible = false" 
                    aria-label="Close">
                    </button>
                    <img :src="modalPicture.url" class="ing-fluid modalPictureImg" :alt="modalPicture.alt">
                </div>
                <!-- Caption -->
                <div v-if="modalPicture.caption" class="modal-footer">
                    <p class="text-center">{{ modalPicture.caption }}</p>
                </div>

            </div>
        </div>

    </div>

</div>
</template>
    
    
<script>
    
    // If the screen size is larger than a small tablet, then we will
    // open the modal for the gallery pictures. Otherwise, we will just
    // open the image in a new tab
    const isLargeScreen = useMediaQuery("(min-width: 768px)").value

    
    export default {
        props: {
            images: {
                type: Array,
                required: true,
            }
        },
        data() {
            return {
                galleryImages: [],
                modalPicture: {},
                modalVisible: false,
            }
        },
        created() {
            // Map the image array to the gallery image array
            // setting the highlighted property to false
            this.galleryImages = this.images.map((image) => {
                return {
                    url: image.url,
                    alt: image.alt,
                    caption: image.caption,
                    highlighted: false,
                }
            })

            
        },
        methods: {
            highlightThis(image) {
                // Set all images to not highlighted
                this.galleryImages.forEach((i) => {
                    i.highlighted = false
                })

                // Set the clicked image to highlighted
                image.highlighted = true
                this.modalPicture = image

                // Show the modal
                this.openModal()
            },
            openModal() {

                // If the screen is large, make the modal visible
                if (isLargeScreen) {
                    this.modalVisible = true
                    return
                }

                // else, just open the image in a new tab
                window.open(this.modalPicture.url, '_blank')
                
            },
            closeModal() {
                this.modalVisible = false
            }
        }
    }
    
    </script>
    
    <style>
    .gallery{
        /* margin-top: 1rem;  */
        margin-bottom: 3rem;
    }
    
    .galleryPictureCard {
        border-bottom-right-radius: 0.5rem;
        border-top-left-radius: 0.5rem;
        margin:auto;
        cursor: pointer;
        box-shadow: 10px 10px 15px rgba(0,0,0,0.15);
        
    }
    .galleryPictureCard * {
        pointer-events: hover;
    }

    .galleryPictureImg{
        border-bottom-right-radius: 0.5rem;
        border-top-left-radius: 0.5rem;
        height:20rem; 
        overflow:hidden; 
        object-fit:cover;
    }

    .modalPictureImg{
        border-top-right-radius: 0.5rem;
        border-top-left-radius: 0.5rem;
        height: 100%;
        width: 100%; 
        max-height: 90vh;

        overflow:auto; 
        /* object-fit: contain; */ 
    }
    .modal-dialog {
        width: min(90%, 80rem);
    }

    .modal-content {
        align-items: center;
        margin-left: auto;
        margin-right: auto;
        width: fit-content;
    }

    </style>