<template>
    <v-row class="align-self-stretch">
        <v-col cols="12" class="d-flex" @click="hideTaskDrawer">
            <v-card class="flex-grow-1 d-flex flex-column" flat outlined>
                <v-card-title class="pa-2">
                    <h1 class="mb-4 text-h3 font-weight-light">
                        {{ board.name }}
                    </h1>

                    <v-spacer />

                    <v-tooltip v-for="guest in guests" :key="guest.id" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                                class="ml-1"
                                v-bind="attrs"
                                v-on="on"
                                size="32"
                            >
                                <v-img :src="guest.avatar" />
                            </v-avatar>
                        </template>
                        <span>{{ guest.nickname || guest.username }}</span>
                    </v-tooltip>

                    <v-btn
                        class="mr-2 ml-4"
                        icon
                        large
                        @click="showGuestsDialog"
                    >
                        <v-icon>
                            {{
                                board.isPrivate
                                    ? 'mdi-lock'
                                    : 'mdi-lock-open-outline'
                            }}
                        </v-icon>
                    </v-btn>

                    <board-guests-dialog
                        :is-visible="isVisibleGuestsDialog"
                        @close="hideGuestsDialog"
                    />
                </v-card-title>

                <v-card-subtitle
                    v-if="board.description"
                    class="px-3 pb-0 grey--text font-italic"
                >
                    {{ board.description }}
                </v-card-subtitle>

                <v-card-text class="pa-0 flex-grow-1 d-flex">
                    <draggable
                        class="d-flex task-list-row flex-nowrap"
                        :disabled="!isAdmin"
                        handle=".task-list-title"
                        v-model="tasksLists"
                    >
                        <tasks-list
                            v-for="listId in tasksLists"
                            :key="listId"
                            :list-id="listId"
                            @showCreateTaskForm="showCreateTaskForm"
                            @showTask="showTaskDrawer"
                            @updateTasksOrder="emitUpdateTasksRanks"
                        />
                        <tasks-list-create slot="footer" />
                    </draggable>
                </v-card-text>
            </v-card>
        </v-col>
        <task-form-create
            :listId="createTasksListId"
            :isVisible="isVisibleCreateTaskForm"
            @close="hideCreateTaskForm"
            @createTask="emitCreateTask"
            @createTag="emitCreateTag"
            @updateTag="emitUpdateTag"
            @removeTag="emitRemoveTag"
        />
        <task-detail
            :taskId="detailTaskId"
            :isVisible="isVisibleDetail"
            @close="hideTaskDrawer"
            @updateTask="emitUpdateTask"
            @removeTask="emitRemoveTask"
            @createTag="emitCreateTag"
            @updateTag="emitUpdateTag"
            @removeTag="emitRemoveTag"
        />
    </v-row>
</template>

<script>
import draggable from 'vuedraggable';
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import TasksList from '../../components/kanban/lists/TasksList.vue';
import TasksListCreate from '../../components/kanban/lists/TasksListCreate.vue';
import BoardGuestsDialog from '../../components/kanban/boards/BoardGuestsDialog.vue';
import TaskFormCreate from '../../components/kanban/tasks/TaskFormCreate.vue';
import TaskDetail from '../../components/kanban/tasks/TaskDetail.vue';

export default {
    components: {
        draggable,
        TasksList,
        TasksListCreate,
        BoardGuestsDialog,
        TaskFormCreate,
        TaskDetail
    },
    head: () => ({
        title: 'Kanban'
    }),
    data() {
        return {
            isVisibleGuestsDialog: false,
            isVisibleCreateTaskForm: false,
            createTasksListId: null,
            isVisibleDetail: false,
            detailTaskId: null
        };
    },
    computed: {
        tasksLists: {
            get() {
                return this.board.lists;
            },
            set(newList) {
                const updatedListsRanking = newList.map((listId, index) => {
                    return {
                        id: listId,
                        data: { rank: index }
                    };
                });
                this.updateListsRanking(updatedListsRanking);
            }
        },

        ...mapState('auth', ['auth']),
        ...mapState('users', ['users']),
        ...mapState('boards', ['board', 'guests']),
        ...mapGetters('boards', ['isAdmin'])
    },
    async fetch() {
        await this.getTags();
        await this.getBoard(this.$route.params.id)
            .then(() => {
                this.connectChannel(this.$route.params.id);
            })
            .catch(err => {
                this.$nuxt.error(err);
            });
    },
    methods: {
        connectChannel(boardId) {
            this.socket = this.$nuxtSocket({
                withCredentials: true
            });

            this.socket.emit('watchBoard', boardId);

            this.socket.on('createTask', res => {
                this.addTask(res);
            });

            this.socket.on('updateTask', res => {
                this.addTask(res);
            });

            this.socket.on('createTag', res => {
                this.addTag(res);
            });

            this.socket.on('updateTag', res => {
                this.addTag(res);
            });

            this.socket.on('removeTag', res => {
                this.purgeTag(res);
            });

            this.socket.on('updateTasksOrder', res => {
                this.updateTasksOrder(res);
            });

            this.socket.on('removeTask', res => {
                this.removeTask(res);
            });
        },
        showGuestsDialog() {
            if (this.isAdmin) {
                this.isVisibleGuestsDialog = true;
            }
        },
        hideGuestsDialog() {
            this.isVisibleGuestsDialog = false;
        },
        showCreateTaskForm(list) {
            this.createTasksListId = list.listId;
            this.isVisibleCreateTaskForm = true;
        },
        hideCreateTaskForm() {
            this.createTasksListId = null;
            this.isVisibleCreateTaskForm = false;
        },
        showTaskDrawer(taskId) {
            this.detailTaskId = taskId;
            if (!this.isVisibleDetail) {
                this.isVisibleDetail = true;
            }
        },
        hideTaskDrawer() {
            this.detailTaskId = null;
            this.isVisibleDetail = false;
        },
        emitCreateTask(createTaskData) {
            this.socket.emit('createTask', createTaskData, () => {
                this.hideCreateTaskForm();
            });
        },
        emitUpdateTask(updateData) {
            this.socket.emit('updateTask', {
                boardId: this.board.id,
                updateData
            });
        },
        emitRemoveTask(taskId) {
            this.socket.emit('removeTask', {
                boardId: this.board.id,
                taskId
            });
        },
        emitUpdateTasksRanks(changeOrderData) {
            this.socket.emit('updateTasksOrder', {
                boardId: this.board.id,
                changeOrderData
            });
        },
        emitCreateTag(tagData) {
            this.socket.emit('createTag', {
                boardId: this.board.id,
                tagData: tagData
            });
        },
        emitUpdateTag(tagData) {
            this.socket.emit('updateTag', {
                boardId: this.board.id,
                tagId: tagData.tagId,
                tagData: tagData.tagData
            });
        },
        emitRemoveTag(tagId) {
            this.socket.emit('removeTag', {
                boardId: this.board.id,
                tagId
            });
        },
        ...mapMutations('boards', [
            'addTask',
            'addTag',
            'purgeTag',
            'updateTasksOrder',
            'removeTask'
        ]),
        ...mapActions('boards', ['getTags', 'getBoard', 'updateListsRanking'])
    }
};
</script>

<style>
.task-list-row {
    overflow-x: scroll;
}
</style>
