<template>
    <generic-uploader
        :color="color"
        :depressed="depressed"
        :multiple="multiple"
        :outlined="outlined"
        :small="small"
        @change="handleUpload"
    >
        <slot></slot>
    </generic-uploader>
</template>

<script>
import GenericUploader from './GenericUploader.vue';

export default {
    components: { GenericUploader },
    props: {
        accept: String,
        color: String,
        depressed: Boolean,
        multiple: Boolean,
        outlined: Boolean,
        small: Boolean
    },
    methods: {
        handleUpload(files) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = event => {
                this.$emit('change', event.target.result);
            };
            reader.readAsText(file);
        }
    }
};
</script>
