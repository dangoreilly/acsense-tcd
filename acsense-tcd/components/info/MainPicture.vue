<template>
<div 
class="mainPictureCard"
v-viewer="v_viewerOptions">
    <img
    :src="imgSrc" 
    class="card-img mainPictureImg" 
    :alt="imgAlt">
</div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
  import { directive as viewer } from "v-viewer"

export default {
    props:{
        mainSrc: String,
        mainAlt: String,
    },
    computed:{
        // If no mainSrc is provided, use a default image
        imgSrc(){
            if(!this.mainSrc){
                return "../images/info_page_default_image.jpg";
            }
            else{
                return this.mainSrc;
            }
        },
        // If no mainAlt is provided, use a default image
        imgAlt(){
            if(!this.mainAlt){
                return "Photo showing the fellows' square of Trinity College Dublin. No building in particular is focused on";
            }
            else{
                return this.mainAlt;
            }
        },
    },
	data(){
		return{
			v_viewerOptions: {
				movable: true,
				toolbar: {
					zoomIn: {
						show: 3,
						size: 'large',
					},
					zoomOut: {
						show: 3,
						size: 'large',
					},
					oneToOne: 0,
					reset: {
						show: 3,
						size: 'large',
					},
					prev: 0,
					play: 0,
					next: 0,
					rotateLeft: {
						show: 3,
						size: 'large',
					},
					rotateRight: {
						show: 3,
						size: 'large',
					},
					flipHorizontal: 0,
					flipVertical: 0,
				},
				navbar: false
			} 
		}
	},
	directives: {
    	viewer: viewer({
			// debug: true,
			toolbar: {
				zoomIn: 3,
				zoomOut: 3,
				oneToOne: 0,
				reset: 3,
				prev: 0,
				play: {
					show: 4,
					size: 'large',
				},
				next: 0,
				rotateLeft: 3,
				rotateRight: 3,
				flipHorizontal: 0,
				flipVertical: 0,
			},
			navbar: false
    	})	
	},

    // created(){
    //     // If no mainSrc is provided, use a default image
    //     this.initImage();
    // },

    // updated(){
    //     // If no mainSrc is provided, use a default image
    //     this.initImage();
    // },
    // methods:{

    //     initImage(){
    //         if(!this.mainSrc){
    //             this.imgSrc = "../images/info_page_default_image.jpg";
    //             this.imgAlt = "Photo showing the fellows' square of Trinity College Dublin. No building in particular is focused on";
    //         }
    //     },

    // }

}
</script>

<style>
.mainPictureImg{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.3), -5px -5px 15px rgba(0,0,0,0.1);
	max-height: 300px;
	object-fit: cover;
	cursor: zoom-in;
}

@media screen and (max-width: 992px){
	.mainPictureImg{
		max-height: 100%;
		object-fit: cover;
	}
}
</style>