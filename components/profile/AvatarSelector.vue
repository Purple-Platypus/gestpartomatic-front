<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <v-img
                :src="avatar"
                @click="activateAvatarUpload"
                v-bind="attrs"
                v-on="on"
                :height="avatarSize"
                :width="avatarSize"
                contain
            >
            </v-img>
        </template>
        <span>Modifiez l'image</span>

        <input
            type="file"
            ref="inputAvatar"
            accept="image/*"
            @change="handleAvatarUpload($event)"
            class="d-sr-only"
        />

        <v-dialog v-model="showAvatarEditorModal" width="500" :eager="true">
            <v-card>
                <v-card-title class="headline mb-3">
                    Personalisez l'image
                </v-card-title>

                <v-card-text>
                    <div>
                        <img id="image" :src="avatar" />
                    </div>
                </v-card-text>

                <v-card-text>
                    <v-row>
                        <v-col>
                            <h2>
                                Aperçu
                            </h2>
                        </v-col>
                        <v-col>
                            <div class="preview preview--large"></div>
                        </v-col>
                        <v-col>
                            <div class="preview preview--small"></div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="cancel">
                        Annuler
                    </v-btn>
                    <v-btn color="primary" depressed @click="updateAvatar">
                        Terminer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-tooltip>
</template>

<script>
import Vue from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    name: 'avatar-selector',
    props: {
        src: String,
        'source-string': String,
        small: Boolean
    },
    data() {
        return {
            avatar: this.src,
            avatarSize: this.small ? 40 : 128,
            showAvatarEditorModal: false,
            croppedAvatar: '',
            noUpload: true,
            cropper: {}
        };
    },
    watch: {
        sourceString: function() {
            if (this.sourceString != '' && this.noUpload) {
                const generatedAvatar = this.generateAvatar(this.sourceString);
                this.avatar = generatedAvatar;
                this.$emit('change', generatedAvatar);
            }
        }
    },
    methods: {
        generateAvatar(sourceString) {
            var colors = [
                '#ff5722',
                '#e91e63',
                '#ce93d8',
                '#3f51b5',
                '#2196f3',
                '#00bcd4',
                '#009688',
                '#4caf50',
                '#8bc34a',
                '#cddc39',
                '#ffeb3b',
                '#ffc107',
                '#ff9800',
                '#795548',
                '#607d8b'
            ];

            const initial = sourceString
                .split(' ')[0]
                .charAt(0)
                .toUpperCase();

            const colorIndex = Math.round(Math.random() * 15);

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            canvas.width = 128;
            canvas.height = 128;

            context.fillStyle = colors[colorIndex];
            context.fillRect(0, 0, 128, 128);
            context.font = '80px Roboto';
            context.textAlign = 'center';
            context.fillStyle = '#FFF';
            context.fillText(initial, 64, 93);

            return canvas.toDataURL();
        },
        activateAvatarUpload() {
            this.$refs.inputAvatar.click();
        },
        handleAvatarUpload(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                this.avatar = event.target.result;
                this.showAvatarEditor();
            };
            reader.readAsDataURL(file);
        },
        showAvatarEditor() {
            this.showAvatarEditorModal = true;

            Vue.nextTick().then(() => {
                const image = document.getElementById('image');
                const that = this;
                Cropper.noConflict();
                this.cropper = new Cropper(image, {
                    aspectRatio: 1,
                    preview: '.preview',
                    ready() {
                        const croppedAvatar = this.cropper.getCroppedCanvas({
                            height: 128,
                            width: 128
                        });
                        that.avatar = croppedAvatar.toDataURL();
                    },
                    cropend() {
                        const croppedAvatar = this.cropper.getCroppedCanvas({
                            height: 128,
                            width: 128
                        });
                        that.avatar = croppedAvatar.toDataURL();
                    }
                });
            });
        },
        updateAvatar() {
            this.$emit('change', this.avatar);
            this.noUpload = false;
            this.closeModal();
            this.cropper.destroy();
        },
        cancel() {
            this.avatar = this.src;
            this.closeModal();
        },
        closeModal() {
            this.showAvatarEditorModal = false;
        }
    }
};
</script>

<style scoped>
img#image {
    display: block;
    max-width: 100%;
    max-height: 300px;
}

.preview {
    overflow: hidden;
}

.preview--large {
    height: 128px;
    width: 128px;
}

.preview--small {
    height: 40px;
    width: 40px;
}
</style>
