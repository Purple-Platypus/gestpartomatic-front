<template>
    <div>
        <v-menu
            :close-on-content-click="false"
            :close-on-click="false"
            content-class="elevation-0"
            offset-y
            v-model="isVisible"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-container
                    class="pb-0 px-0 cursor-pointer"
                    v-bind="attrs"
                    v-on="on"
                >
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

                    <v-card-text class="pt-0">
                        <v-chip-group column>
                            <v-chip
                                v-for="tagId in taskTags"
                                :key="tagId"
                                :color="tags[tagId].color"
                                small
                            >
                                {{ tags[tagId].label }}
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-container>
            </template>

            <v-window v-model="visibleMenu">
                <v-window-item value="list">
                    <v-sheet class="pa-2" outlined rounded>
                        <v-chip-group column multiple v-model="taskTags">
                            <v-chip
                                v-for="tag in tagsList"
                                :key="tag.id"
                                :color="tag.color"
                                filter
                                :value="tag.id"
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

                            <v-btn color="error" text @click="hide">
                                Fermer
                            </v-btn>
                        </div>
                    </v-sheet>
                </v-window-item>

                <v-window-item value="manager">
                    <task-tags-manager @close="hideTagsManager" />
                </v-window-item>
            </v-window>
        </v-menu>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TaskTagsManager from './TaskTagsManager.vue';

export default {
    name: 'task-tags-list',
    components: { TaskTagsManager },
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
            isVisible: false,
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
        hide() {
            this.isVisible = false;
        },
        showTagsManager() {
            this.visibleMenu = 'manager';
        },
        hideTagsManager() {
            this.visibleMenu = 'list';
        }
    }
};
</script>
