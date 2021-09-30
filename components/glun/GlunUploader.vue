<template>
    <file-reader
        @change="handleUpload"
        :color="color"
        :depressed="depressed"
        :outlined="outlined"
        :small="small"
    >
        <slot></slot>
    </file-reader>
</template>

<script>
import Papa from 'papaparse';
import FileReader from '../commons/FileReader.vue';

export default {
    components: { FileReader },
    props: {
        color: String,
        depressed: Boolean,
        outlined: Boolean,
        small: Boolean
    },
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
