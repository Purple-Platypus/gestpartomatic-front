<template>
    <div>
        <v-container class="pa-0">
            <v-card-subtitle
                class="py-1 d-flex flex-row flex-nowrap align-start justify-space-between"
            >
                <h3 class="text-overline">
                    étiquettes
                </h3>
            </v-card-subtitle>

            <v-card-text>
                <v-card-text class="pa-0">
                    <v-chip-group column multiple v-model="taskTags">
                        <v-chip
                            v-for="tag in tagsList"
                            :class="{
                                'v-chip--outlined': !isSelected(tag.id),
                                'white--text': isSelected(tag.id) && tag.isDark
                            }"
                            active-class="selected-chip"
                            :key="tag.id"
                            :color="tag.color"
                            filter
                            :value="tag.id"
                            small
                        >
                            {{ tag.label }}
                        </v-chip>
                    </v-chip-group>

                    <div class="text-right">
                        <v-btn depressed @click="showTagsManager">
                            <v-icon left>
                                mdi-tune
                            </v-icon>
                            Gérer les étiquettes
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card-text>
        </v-container>

        <v-dialog v-model="isVisibleTagsManager" width="400px">
            <v-card>
                <v-card-title>
                    <h3 class="text-h5">
                        Gérez des étiquettes
                    </h3>
                </v-card-title>

                <v-divider />

                <tags-manager
                    class="pt-4"
                    @close="hideTagsManager"
                    @remove="remove"
                    @update="update"
                    @create="create"
                />

                <v-divider />

                <v-card-actions>
                    <v-spacer />
                    <v-btn text color="error" @click="hideTagsManager">
                        Fermer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TagsManager from './TagsManager.vue';

export default {
    name: 'tags-list',
    components: { TagsManager },
    props: {
        listId: Number,
        value: Array
    },
    data() {
        return {
            isVisibleTagsManager: false
        };
    },
    computed: {
        taskTags: {
            get() {
                return this.value;
            },
            set(tagsList) {
                this.$emit('input', tagsList);
            }
        },
        ...mapState('boards', ['tags']),
        ...mapGetters('boards', ['tagsList'])
    },
    methods: {
        showTagsManager() {
            this.isVisibleTagsManager = true;
        },
        hideTagsManager() {
            this.isVisibleTagsManager = false;
        },
        create(tagData) {
            this.$emit('create', tagData);
        },
        update(tagData) {
            this.$emit('update', tagData);
        },
        remove(tagId) {
            this.$emit('remove', tagId);
        },
        isSelected(tagId) {
            return this.taskTags.includes(tagId);
        }
    }
};
</script>

<style lang="scss"></style>
