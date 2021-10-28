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
                        @click="showMembersModal"
                    >
                        <v-icon>
                            {{
                                board.isPrivate
                                    ? 'mdi-lock'
                                    : 'mdi-lock-open-outline'
                            }}
                        </v-icon>
                    </v-btn>

                    <board-task-list-members-modal
                        :is-visible="isMembersModalVisible"
                        @close="hideMembersModal"
                    />
                </v-card-title>

                <v-card-text class="pa-0 flex-grow-1 d-flex">
                    <draggable
                        class="d-flex task-list-row flex-nowrap"
                        :disabled="!isAdmin"
                        handle=".task-list-title"
                        v-model="taskLists"
                    >
                        <board-task-list
                            v-for="listId in taskLists"
                            :key="listId"
                            :list-id="listId"
                            @showAddTaskForm="showAddTaskForm"
                            @showTask="showTaskDrawer($event)"
                        />
                        <board-task-list-add slot="footer" />
                    </draggable>
                </v-card-text>
            </v-card>
        </v-col>
        <task-form-add
            :listId="addTaskListId"
            :isVisible="isAddTaskFormVisible"
            @close="hideAddTaskForm"
            @createTask="createTask"
        />
        <task-detail
            :taskId="detailTaskId"
            :isVisible="isDetailVisible"
            @close="hideTaskDrawer"
        />
    </v-row>
</template>

<script>
import draggable from 'vuedraggable';
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import BoardTaskList from '../../components/boards/BoardTaskList.vue';
import BoardTaskListAdd from '../../components/boards/BoardTaskListAdd.vue';
import BoardTaskListMembersModal from '../../components/boards/BoardTaskListMembersModal';
import TaskFormAdd from '../../components/boards/TaskFormAdd.vue';
import TaskDetail from '../../components/boards/tasks/TaskDetail.vue';

export default {
    components: {
        draggable,
        BoardTaskList,
        BoardTaskListAdd,
        BoardTaskListMembersModal,
        TaskFormAdd,
        TaskDetail
    },
    head: () => ({
        title: 'Kanban'
    }),
    data() {
        return {
            isMembersModalVisible: false,
            isAddTaskFormVisible: false,
            addTaskListId: null,
            isDetailVisible: false,
            detailTaskId: null
        };
    },
    computed: {
        taskLists: {
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
            .then(this.connectChannel)
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

            this.socket.on('addTask', res => {
                this.addTask(res);
            });
        },
        showMembersModal() {
            if (this.isAdmin) {
                this.isMembersModalVisible = true;
            }
        },
        hideMembersModal() {
            this.isMembersModalVisible = false;
        },
        showAddTaskForm(list) {
            this.addTaskListId = list.listId;
            this.isAddTaskFormVisible = true;
        },
        hideAddTaskForm() {
            this.addTaskListId = null;
            this.isAddTaskFormVisible = false;
        },
        createTask(createTaskData) {
            this.socket.emit('createTask', createTaskData, () => {
                this.hideAddTaskForm();
            });
        },
        showTaskDrawer(taskId) {
            this.detailTaskId = taskId;
            if (!this.isDetailVisible) {
                this.isDetailVisible = true;
            }
        },
        hideTaskDrawer() {
            this.detailTaskId = null;
            this.isDetailVisible = false;
        },
        ...mapMutations('boards', ['addTask']),
        ...mapActions('boards', ['getTags', 'getBoard', 'updateListsRanking'])
    }
};
</script>

<style>
.task-list-row {
    overflow-x: scroll;
}
</style>
