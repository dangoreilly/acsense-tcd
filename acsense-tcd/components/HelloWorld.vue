<template>
    <div>
        <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js"></script> -->

        <input style="margin:1rem" v-model="content">
        <div style="border-style:solid; border-width: 2px; border-color: black; margin-top: 1rem; padding:1rem;">{{content}}</div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      content: 'Hello World!'
    }
  },
  head(){
    script:[
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js"
        }
    ]
  }
}
</script>