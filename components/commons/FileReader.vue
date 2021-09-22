<template>
    <uploader
        :color="color"
        :depressed="depressed"
        :multiple="multiple"
        :outlined="outlined"
        :small="small"
        @change="handleUpload"
    >
        <slot></slot>
    </uploader>
</template>

<script>
import Uploader from './Uploader.vue';

export default {
    components: { Uploader },
    props: ['accept', 'color', 'depressed', 'multiple', 'outlined', 'small'],
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
