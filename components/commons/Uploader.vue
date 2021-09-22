<template>
    <div>
        <input
            :accept="accept"
            @change="handleUpload($event)"
            class="d-sr-only"
            :multiple="multiple"
            ref="fileInput"
            type="file"
        />
        <v-btn
            @click="activateUploader"
            :color="color"
            :depressed="depressed"
            :outlined="outlined"
            :small="small"
            :text="text"
        >
            <slot></slot>
        </v-btn>
    </div>
</template>

<script>
export default {
    props: [
        'accept',
        'color',
        'depressed',
        'multiple',
        'outlined',
        'small',
        'text'
    ],
    methods: {
        activateUploader() {
            this.$refs.fileInput.click();
        },
        handleUpload(event) {
            this.$emit('change', event.target.files);
        }
    }
};
</script>
