<template>
    <v-navigation-drawer
        class="elevation-0"
        fixed
        hide-overlay
        right
        stateless
        temporary
        width="400px"
        v-model="isVisible"
    >
        <template v-if="taskId">
            <v-hover v-slot="{ hover }">
                <v-card-title
                    class="d-flex flex-row justify-space-between flex-nowrap align-start"
                >
                    <h2
                        class="text-h4 font-weight-light"
                        v-html="md(task.title)"
                    ></h2>

                    <div class="d-flex flex-row flex-nowrap">
                        <v-btn v-if="hover" icon>
                            <v-icon>
                                mdi-pencil-outline
                            </v-icon>
                        </v-btn>

                        <v-btn icon @click="close">
                            <v-icon>
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
            </v-hover>

            <v-hover v-slot="{ hover }">
                <div class="d-flex flex-row flex-nowrap align-start">
                    <v-card-text
                        v-html="md(task.description || 'Pas de description')"
                        class="pb-2"
                        :class="{ 'grey--text font-italic': !task.description }"
                    />

                    <v-btn v-if="hover" class="mr-4" icon small>
                        <v-icon size="20">
                            mdi-pencil-outline
                        </v-icon>
                    </v-btn>
                </div>
            </v-hover>

            <v-divider class="mx-4" />

            <v-hover v-slot="{ hover }">
                <div>
                    <task-assignees-list
                        v-model="assigneesList"
                        :isHover="hover"
                    >
                        Ajoutez des responsable pour cette tâche
                    </task-assignees-list>

                    <!-- <v-card-subtitle
                        class="py-1 d-flex flex-row flex-nowrap align-start justify-space-between"
                    >
                        <h3 class="text-overline">
                            Responsables
                        </h3>

                        <v-btn v-if="hover" icon small>
                            <v-icon size="20">
                                mdi-pencil-outline
                            </v-icon>
                        </v-btn>
                    </v-card-subtitle>

                    <v-card-text class="pt-0">
                        <v-chip
                            v-for="assignee in assigneesList"
                            :key="assignee.id"
                            class="mr-4"
                            color="white"
                        >
                            <v-avatar left>
                                <v-img :src="assignee.avatar" />
                            </v-avatar>
                            {{ assignee.nickname || assignee.username }}
                        </v-chip>

                        <span
                            v-if="!assigneesList.length"
                            class="grey--text font-italic"
                        >
                            Pas encore de responsable
                        </span>
                    </v-card-text> -->
                </div>
            </v-hover>

            <v-divider class="mx-4" />

            <v-hover v-slot="{ hover }">
                <div>
                    <tags-list
                        v-model="taskTags"
                        :isHover="hover"
                        @update="updateTag"
                        @create="createTag"
                    >
                        Pas encore d'étiquette
                    </tags-list>
                </div>
            </v-hover>
        </template>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import Markdown from '../../commons/mixins/Markdown.mixin';
import TaskAssigneesList from './assignees/TaskAssigneesList.vue';
import TagsList from './tags/TagsList.vue';

export default {
    name: 'task-detail',
    components: { TaskAssigneesList, TagsList },
    mixins: [Markdown],
    props: {
        taskId: Number,
        isVisible: Boolean
    },
    computed: {
        task() {
            return this.tasks[this.taskId];
        },
        assigneesList: {
            get() {
                return this.task.assignees;
            },
            set(taskAssignees) {
                this.$emit('update', {
                    boardId: this.board.id,
                    updateData: {
                        id: this.taskId,
                        assignees: taskAssignees
                    }
                });
            }
        },
        taskTags: {
            get() {
                return this.task.tags;
            },
            set(taskTags) {
                this.$emit('update', {
                    boardId: this.board.id,
                    updateData: {
                        id: this.taskId,
                        tags: taskTags
                    }
                });
            }
        },
        ...mapState('users', ['usersById']),
        ...mapState('boards', ['board', 'tasks', 'tags'])
    },

    methods: {
        close() {
            if (this.isVisible) {
                this.$emit('close');
            }
        },
        createTag(tagData) {
            this.$emit('createTag', tagData);
        },
        updateTag(tagData) {
            this.$emit('updateTag', tagData);
        }
    }
};
</script>
