<template>
    <v-sheet class="pa-2" outlined>
        <tag-form-add />

        <v-divider class="my-2" />

        <v-container>
            <v-row v-for="tag in tags" :key="tag.id">
                <v-col class="py-0">
                    <v-chip :color="tag.color">
                        {{ tag.label }}
                    </v-chip>
                </v-col>

                <v-col class="flex-grow-0 d-flex py-0">
                    <v-btn icon>
                        <v-icon>
                            mdi-circle-edit-outline
                        </v-icon>
                    </v-btn>
                    <v-btn icon @click="showRemoveModal(tag.id)">
                        <v-icon>
                            mdi-close-circle-outline
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

        <div class="text-right">
            <v-btn depressed @click="close">
                Retour
            </v-btn>
        </div>

        <v-dialog
            v-if="removedTag"
            v-model="isRemoveModalVisible"
            max-width="500"
        >
            <v-card>
                <v-card-title class="text-h5 font-weight-light">
                    Supprimer une étiquette
                </v-card-title>

                <v-card-text>
                    L'étiquette
                    <v-chip :color="removedTag.color" small>
                        {{ removedTag.label }}
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
    </v-sheet>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TagFormAdd from './TagFormAdd.vue';

export default {
    name: 'task-tags-manager',
    components: { TagFormAdd },
    data() {
        return {
            isRemoveModalVisible: false,
            removedTag: null
        };
    },
    computed: {
        ...mapState('boards', ['tags'])
    },
    methods: {
        add(tagId) {
            this.tags.push(tagId);
        },
        remove() {
            this.$emit('remove', this.removedTag.id);
            this.hideRemoveModal();
        },
        showRemoveModal(tagId) {
            this.removedTag = this.tags[tagId];
            this.isRemoveModalVisible = true;
        },
        hideRemoveModal() {
            this.removedTag = null;
            this.isRemoveModalVisible = false;
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>
