<template>
    <v-row justify="center" align="center">
        <v-col md="6">
            <v-card>
                <v-card-title>
                    <h1 class="text-h3 font-weight-light">
                        Testomatic
                    </h1>
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle-1 font-weight-light">
                        It's alive !
                    </span>
                </v-card-subtitle>

                <v-card-text>
                    <v-sheet
                        outlined
                        rounded
                        class="pt-4 pb-2 px-4 text-center"
                        :class="`elevation-${drag > 0 ? 4 : 0}`"
                        @dragenter="dragEnter"
                        @dragleave="dragLeave"
                        @dragover.prevent
                        @drop.prevent="dropFiles"
                    >
                        <template v-if="!busy">
                            <div class="text-h6 font-weight-light">
                                Déposez vos fichiers de test ici
                            </div>
                            <div class="text-caption">
                                ou
                            </div>
                            <div>
                                <generic-uploader
                                    @change="selectFiles"
                                    class="mt-1 mb-2"
                                    color="primary"
                                    depressed
                                    multiple
                                    text
                                >
                                    Sélectionnez des fichiers
                                </generic-uploader>
                            </div>
                        </template>
                        <v-row class="px-4 pt-6 pb-5" v-else>
                            <v-col cols="4" offset="4">
                                <p>
                                    {{ busyMessage }}
                                </p>
                                <v-progress-linear
                                    class="mb-3"
                                    color="primary"
                                    rounded
                                    height="6"
                                    :value="progress"
                                ></v-progress-linear>
                            </v-col>
                        </v-row>

                        <div class="mt-4 text-left" dense v-if="files.length">
                            <v-chip
                                class="ma-1"
                                :color="file.formatCheck ? '' : 'error'"
                                @click:close="removeFile(index)"
                                close
                                label
                                v-for="(file, index) in files"
                                :key="file.name"
                            >
                                {{ file.name }}
                            </v-chip>
                        </div>
                        <p class="mb-0 error--text" v-if="hasFormatErrors">
                            Merci de sélectionner uniquement des fichiers de
                            test (<code>*.spec.js</code> ou
                            <code>*.spec.ts</code>).
                        </p>
                    </v-sheet>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="sendFiles"
                        color="primary"
                        depressed
                        :disabled="isUploadDisabled"
                        :loading="loading.upload"
                    >
                        Lancer les tests
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import GenericUploader from '../../components/commons/GenericUploader.vue';
import messages from '~/assets/messages.json';

export default {
    components: { GenericUploader },
    data() {
        return {
            drag: 0,
            files: [],
            busy: false,
            busyMessage: 'Envoi des fichiers en cours',
            loading: { upload: false },
            testedFiles: []
        };
    },
    methods: {
        dragEnter() {
            this.drag++;
        },
        dragLeave() {
            this.drag--;
        },
        async sendFiles() {
            this.testedFiles = [];
            this.busy = true;

            let formData = new FormData();

            this.files.forEach(file => {
                formData.append('files[]', file, file.name);
            });

            await this.$axios
                .post('/api/upload/test', formData)
                .then(res => {
                    this.runTests(res.data);
                    this.busyMessage = 'Tests en cours...';
                })
                .catch(err => {
                    console.log(err);
                    this.$store.commit('snackbar/setSnackbar', {
                        text: messages.errors.generic,
                        color: 'error'
                    });
                    this.busy = false;
                });
        },
        dropFiles(event) {
            const droppedFiles = event.dataTransfer.files;
            this.selectFiles(droppedFiles);
            this.drag = 0;
        },
        selectFiles(selectedFiles) {
            [...selectedFiles].forEach(file => {
                file.formatCheck = this.checkFormat(file);

                this.files.push(file);
            });
        },
        removeFile(fileIndex) {
            this.files.splice(fileIndex, 1);
        },
        checkFormat(file) {
            return file.name.match(/\.spec\.(js|ts|mjs)$/);
        },
        async runTests(filesNames) {
            this.busyMessage = 'Tests en cours...';

            for (const name of filesNames) {
                await this.$axios
                    .post('/api/testrunner/', { name })
                    .then(res => {
                        this.handleTestResult(res.data);
                    })
                    .catch(err => {
                        console.log(err);
                        this.busy = false;

                        this.$store.commit('snackbar/setSnackbar', {
                            text: messages.errors.generic,
                            color: 'error'
                        });
                    });
            }
            this.endTest();
        },
        handleTestResult(result) {
            this.testsCount++;
            const fileName = result.file.substring(16);
            this.testedFiles.push(fileName);
        },
        endTest(result) {
            this.busy = false;
        }
    },
    computed: {
        isUploadDisabled() {
            return !this.files.length || this.busy || this.hasFormatErrors;
        },
        hasFormatErrors() {
            return this.files.some(file => {
                return !file.formatCheck;
            });
        },
        progress() {
            return Math.round(
                (this.testedFiles.length / this.files.length) * 100
            );
        }
    }
};
</script>
