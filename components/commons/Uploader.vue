<template>
    <div>
        <input
            :accept="accept"
            @change="handleUpload($event)"
            class="d-sr-only"
            ref="inputCSV"
            type="file"
        />
        <v-btn
            @click="activateUploader"
            :color="color"
            :depressed="depressed"
            :outlined="outlined"
            :small="small"
        >
            <v-icon left>mdi-upload</v-icon>
            <slot></slot>
        </v-btn>
    </div>
</template>

<script>
export default {
    props: ['accept', 'color', 'depressed', 'left', 'outlined', 'small'],
    methods: {
        activateUploader() {
            this.$refs.inputCSV.click();
        },
        handleUpload(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                this.$emit('change', event.target.result);
            };
            reader.readAsText(file);
        }
    }
};
</script>
