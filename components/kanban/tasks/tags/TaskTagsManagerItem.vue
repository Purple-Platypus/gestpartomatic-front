<template>
    <v-row>
        <template v-if="!isUpdated">
            <v-col class="py-1">
                <v-chip :color="tag.color" :dark="tag.isDark" small>
                    {{ tag.label }}
                </v-chip>
            </v-col>

            <v-col class="flex-grow-0 d-flex py-1 px-0">
                <v-btn icon @click="showUpdateForm" small>
                    <v-icon>
                        mdi-circle-edit-outline
                    </v-icon>
                </v-btn>
                <v-btn icon @click="showRemoveModal()" small>
                    <v-icon>
                        mdi-close-circle-outline
                    </v-icon>
                </v-btn>
            </v-col>
        </template>

        <tag-form-update v-else :tagId="tagId" @update="update" />

        <v-dialog v-model="isRemoveModalVisible" max-width="500">
            <v-card>
                <v-card-title class="text-h5 font-weight-light">
                    Supprimer une étiquette
                </v-card-title>

                <v-card-text>
                    L'étiquette
                    <v-chip :color="tag.color" :dark="tag.isDark" small>
                        {{ tag.label }}
                    </v-chip>
                    va être définitivement supprimée.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn depressed @click="hideRemoveModal">
                        Annuler
                    </v-btn>

                    <v-btn color="error" depressed @click="remove">
                        Supprimer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TagFormUpdate from './TagFormUpdate.vue';

export default {
    components: { TagFormUpdate },
    name: 'task-tags-manager-item',
    props: {
        tagId: Number,
        isUpdated: Boolean
    },
    data() {
        return {
            isRemoveModalVisible: false
        };
    },
    computed: {
        tag() {
            return this.tags[this.tagId];
        },
        ...mapState('boards', ['tags'])
    },
    methods: {
        update(tag) {
            this.$emit('update', {
                tagId: this.tagId,
                tagData: tag
            });
        },
        remove() {
            this.$emit('remove', this.tagId);
            this.hideRemoveModal();
        },
        showRemoveModal() {
            this.isRemoveModalVisible = true;
        },
        hideRemoveModal() {
            this.isRemoveModalVisible = false;
        },
        showUpdateForm() {
            this.$emit('showUpdate');
        },
        hideUpdateForm() {
            this.$emit('hideUpdate');
        }
    }
};
</script>
