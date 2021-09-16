<template>
    <uploader
        @change="handleUpload"
        :color="color"
        :depressed="depressed"
        :outlined="outlined"
        :small="small"
    >
        <slot></slot>
    </uploader>
</template>

<script>
import Papa from 'papaparse';
import Uploader from '../commons/Uploader.vue';

export default {
    components: { Uploader },
    props: ['color', 'depressed', 'outlined', 'small'],
    data() {
        return {};
    },
    methods: {
        handleUpload(fileContent) {
            Papa.parse(fileContent, {
                skipEmptyLines: true,
                header: true,
                transformHeader: this.formatTitle,
                transform: this.formatData,
                complete: this.computeStats
            });
        },
        formatTitle(title) {
            return title.toLowerCase().replaceAll(' ', '_');
        },
        formatData(data) {
            return data.trim();
        },
        computeStats(results) {
            const parsedGlun = results.data;
            this.$emit('input', parsedGlun);
        }
    }
};
</script>
