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
    props: {
        accept: String,
        color: String,
        depressed: Boolean,
        multiple: Boolean,
        outlined: Boolean,
        small: Boolean,
        text: String
    },
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
