<template>
    <div>
        <v-container class="pa-0 cursor-pointer" @click="showTagsList">
            <v-card-subtitle
                class="py-1 d-flex flex-row flex-nowrap align-start justify-space-between"
            >
                <h3 class="text-overline">
                    étiquettes
                </h3>

                <v-btn v-if="isHover" icon small>
                    <v-icon size="20">
                        mdi-pencil-outline
                    </v-icon>
                </v-btn>
            </v-card-subtitle>

            <v-card-text
                v-if="!taskTags.length"
                class="pt-0 grey--text font-italic"
            >
                <slot></slot>
            </v-card-text>

            <v-card-text v-else class="py-0">
                <v-chip-group column>
                    <v-chip
                        v-for="tagId in taskTags"
                        :key="tagId"
                        :color="tags[tagId].color"
                        :dark="tags[tagId].isDark"
                        small
                    >
                        {{ tags[tagId].label }}
                    </v-chip>
                </v-chip-group>
            </v-card-text>
        </v-container>

        <v-expand-transition>
            <v-window
                v-if="isVisibleTagsList"
                v-model="visibleMenu"
                v-click-outside="hideTagsList"
            >
                <v-window-item value="list">
                    <v-card-title class="d-flex py-0">
                        <h3
                            class="flex-grow-1 text-caption font-weight-bold font-italic"
                        >
                            Choisissez des étiquettes
                        </h3>

                        <v-btn
                            class="flex-grow-0"
                            icon
                            small
                            @click="hideTagsList"
                        >
                            <v-icon>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-text class="py-0">
                        <v-chip-group column multiple v-model="taskTags">
                            <v-chip
                                v-for="tag in tagsList"
                                :key="tag.id"
                                :color="tag.color"
                                :dark="tag.isDark"
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
                </v-window-item>

                <v-window-item value="manager">
                    <v-card-title class="d-flex py-0">
                        <h3
                            class="flex-grow-1 text-caption font-weight-bold font-italic"
                        >
                            Gérez des étiquettes
                        </h3>

                        <v-btn
                            class="flex-grow-0"
                            icon
                            small
                            @click="hideTagsList"
                        >
                            <v-icon>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </v-card-title>

                    <tags-manager
                        @close="hideTagsManager"
                        @remove="remove"
                        @update="update"
                        @create="create"
                    />
                </v-window-item>
            </v-window>
        </v-expand-transition>
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
        isHover: {
            type: Boolean,
            default: false
        },
        value: Array
    },
    data() {
        return {
            isVisibleTagsList: false,
            visibleMenu: 'list'
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
        showTagsList() {
            this.isVisibleTagsList = true;
        },
        hideTagsList() {
            this.isVisibleTagsList = false;
        },
        showTagsManager() {
            this.visibleMenu = 'manager';
        },
        hideTagsManager() {
            this.visibleMenu = 'list';
        },
        create(tagData) {
            this.$emit('create', tagData);
        },
        update(tagData) {
            this.$emit('update', tagData);
        },
        remove(tagId) {
            this.$emit('remove', tagId);
        }
    }
};
</script>
