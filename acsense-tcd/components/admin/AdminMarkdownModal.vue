<template>

<div 
class="modal fade"
:class="{ 'show': modalOpen }"
:style="modalOpen ? 'display: block;' : 'display: none;'" 
tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Markdown Styling</h5>
                <button type="button" class="btn-close" @click="$emit('modalClose')"></button>
            </div>
            <div class="modal-body">
                <p>Markdown is a system for formatting text using, well, text. Markdown comes in different flavours, and the markdown we've enabled on this admin panel are quite constrained.</p>
                <p>This is to allow for text to be formatted to maximise accessibility, while maintaining consistency between pages</p>
                <p>Here are some examples of markdown styling allowed:</p>
                <ul>
                    <li>**Bold text**</li>
                    <li>*Italic text*</li>
                    <li>~~Strikethrough text~~ </li>
                    <li>* Bullet point list item</li>
                    <li>1. Numbered list item</li>
                    <li>[Link text](https://www.example.com)</li>
                </ul>
                <p>Use this styling sparingly. The layout of each page and section should be predictable. All information should be in the place and style that the user expects it to be.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="$emit('modalClose')">Close</button>
            </div>
        </div>
    </div>
</div>

</template>

<script lang="ts">
export default {
    props: {
        modalOpen: {
            type: Boolean,
            required: true,
        },
    },
}

</script>