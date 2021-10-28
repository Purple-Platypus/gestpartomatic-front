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
                    class="pb-0 cursor-pointer"
                    v-bind="attrs"
                    v-on="on"
                >
                    <h3 class="text-body-2 font-weight-bold">
                        Étiquettes
                    </h3>

                    <p v-if="!taskTags.length" class="text-caption grey--text">
                        Ajoutez des étiquettes à cette tâche
                    </p>

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
                </v-container>
            </template>

            <v-window v-model="visibleMenu">
                <v-window-item value="list">
                    <v-sheet class="pa-2" outlined rounded>
                        <v-chip-group column multiple v-model="taskTags">
                            <v-chip
                                v-for="tag in tags"
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
import { mapState } from 'vuex';
import TaskTagsManager from './TaskTagsManager.vue';

export default {
    name: 'task-tags-list',
    components: { TaskTagsManager },
    props: {
        listId: Number
    },
    data() {
        return {
            isVisible: false,
            taskTags: [],
            visibleMenu: 'list'
        };
    },
    computed: {
        ...mapState('boards', ['tags'])
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
    },
    watch: {
        taskTags(list) {
            this.$emit('input', list);
        }
    }
};
</script>
