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
            <v-alert
                v-if="task.isArchived"
                class="ma-3"
                dense
                icon="mdi-archive"
                outlined
                text
                type="error"
            >
                Cette tâche est archivée.
            </v-alert>
            <v-hover v-if="!isVisibleTitleInput" v-slot="{ hover }">
                <v-card-title
                    class="d-flex flex-row justify-space-between flex-nowrap align-start"
                >
                    <h2
                        class="text-h4 font-weight-light"
                        v-html="md(task.title)"
                    ></h2>

                    <div class="d-flex flex-row flex-nowrap">
                        <v-btn v-if="hover" icon @click="showTitleInput">
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

            <v-card-title v-else>
                <v-text-field
                    autofocus
                    dense
                    outlined
                    hide-details
                    label="Titre"
                    v-model="updatedTask.title"
                />
                <v-btn icon @click="update">
                    <v-icon color="primary" size="20">
                        mdi-check-circle-outline
                    </v-icon>
                </v-btn>
                <v-btn icon @click="hideAll">
                    <v-icon size="20">
                        mdi-close-circle-outline
                    </v-icon>
                </v-btn>
            </v-card-title>

            <v-hover v-slot="{ hover }" v-if="!isVisibleDescriptionInput">
                <div
                    class="d-flex flex-row flex-nowrap align-start cursor-pointer"
                    @click="showDescriptionInput"
                >
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
            <div v-else class="d-flex flex-row flex-nowrap align-start">
                <v-card-text class="pt-0 pb-2 pr-2">
                    <v-textarea
                        auto-grow
                        autofocus
                        dense
                        hide-details=""
                        label="Description"
                        outlined
                        rows="3"
                        v-model="updatedTask.description"
                    />
                </v-card-text>
                <div class="d-flex flex-column">
                    <v-btn class="mr-4" icon small @click="update">
                        <v-icon color="primary" size="20">
                            mdi-check-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-btn class="mr-4" icon small @click="hideAll">
                        <v-icon size="20">
                            mdi-close-circle-outline
                        </v-icon>
                    </v-btn>
                </div>
            </div>

            <v-divider class="mx-4" />

            <v-hover v-slot="{ hover }">
                <div>
                    <task-assignees-list
                        v-model="assigneesList"
                        :isHover="hover"
                    >
                        Ajoutez des responsable pour cette tâche
                    </task-assignees-list>
                </div>
            </v-hover>

            <v-divider class="mx-4" />

            <div>
                <tags-list
                    v-model="taskTags"
                    @update="updateTag"
                    @create="createTag"
                    @remove="removeTag"
                >
                    Pas encore d'étiquette
                </tags-list>
            </div>

            <v-divider class="mx-4" />

            <v-card-actions>
                <v-btn
                    class="primary-bg"
                    :color="isHighPriority ? 'primary' : ''"
                    icon
                    @click="pin"
                >
                    <v-icon>
                        {{ isHighPriority ? 'mdi-pin' : 'mdi-pin-outline' }}
                    </v-icon>
                </v-btn>

                <date-picker-btn v-model="taskDeadline" />

                <v-btn icon>
                    <v-icon>
                        mdi-flag-outline
                    </v-icon>
                </v-btn>

                <v-spacer />

                <v-btn icon @click="archive">
                    <v-icon v-if="!updatedTask.isArchived">
                        mdi-archive
                    </v-icon>
                    <v-icon v-else>
                        mdi-archive-off
                    </v-icon>
                </v-btn>

                <task-remove-btn :taskId="taskId" @remove="remove" />
            </v-card-actions>
        </template>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import Markdown from '../../commons/mixins/Markdown.mixin';
import TaskAssigneesList from './assignees/TaskAssigneesList.vue';
import TagsList from './tags/TagsList.vue';
import TaskRemoveBtn from './TaskRemoveBtn.vue';
import DatePickerBtn from '../../commons/DatePickerBtn.vue';

export default {
    name: 'task-detail',
    components: { TaskAssigneesList, TagsList, TaskRemoveBtn, DatePickerBtn },
    mixins: [Markdown],
    props: {
        taskId: Number,
        isVisible: Boolean
    },
    data() {
        return {
            isVisibleTitleInput: false,
            isVisibleDescriptionInput: false,
            isRemoveDialogVisible: false
        };
    },
    computed: {
        task() {
            return this.tasks[this.taskId];
        },
        updatedTask() {
            const partialTask = (({
                id,
                title,
                description,
                priority,
                isArchived,
                deadline
            }) => ({
                id,
                title,
                description,
                priority,
                isArchived,
                deadline
            }))(this.task);
            return partialTask;
        },
        assigneesList: {
            get() {
                return this.task.assignees;
            },
            set(taskAssignees) {
                this.$emit('updateTask', {
                    id: this.taskId,
                    assignees: taskAssignees
                });
            }
        },
        taskTags: {
            get() {
                return this.task.tags;
            },
            set(taskTags) {
                this.$emit('updateTask', {
                    id: this.taskId,
                    tags: taskTags
                });
            }
        },
        taskDeadline: {
            get() {
                return this.task.deadline;
            },
            set(deadline) {
                this.$emit('updateTask', {
                    id: this.taskId,
                    deadline
                });
            }
        },
        isHighPriority() {
            return this.task.priority == 'HIGH';
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
        showTitleInput() {
            this.isVisibleTitleInput = true;
        },
        showDescriptionInput() {
            this.isVisibleDescriptionInput = true;
        },
        showRemoveDialog() {
            this.isRemoveDialogVisible = true;
        },
        hideRemoveDialog() {
            this.isRemoveDialogVisible = false;
        },
        hideAll() {
            this.isVisibleTitleInput = false;
            this.isVisibleDescriptionInput = false;
        },
        pin() {
            this.updatedTask.priority =
                this.updatedTask.priority == 'NORMAL' ? 'HIGH' : 'NORMAL';

            this.update();
        },
        update() {
            this.$emit('updateTask', this.updatedTask);
            this.hideAll();
        },
        remove(taskId) {
            this.hideRemoveDialog();
            this.close();
            this.$emit('removeTask', taskId);
        },
        archive() {
            this.updatedTask.isArchived = !this.updatedTask.isArchived;

            this.update();
        },
        createTag(tagData) {
            this.$emit('createTag', tagData);
        },
        updateTag(tagData) {
            this.$emit('updateTag', tagData);
        },
        removeTag(tagId) {
            this.$emit('removeTag', tagId);
        }
    }
};
</script>
