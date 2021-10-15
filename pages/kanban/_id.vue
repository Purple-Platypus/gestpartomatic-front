<template>
    <v-row class="align-self-stretch">
        <v-col cols="12" class="d-flex">
            <v-card class="flex-grow-1 d-flex flex-column" flat outlined>
                <v-card-title class="pa-2">
                    <h1 class="mb-4 text-h3 font-weight-light">
                        {{ board.name }}
                    </h1>
                </v-card-title>

                <v-card-text class="pa-2 flex-grow-1 d-flex">
                    <draggable
                        class="d-flex task-list-row flex-nowrap"
                        handle=".task-list-title"
                        tag=""
                        v-model="taskLists"
                    >
                        <board-task-list
                            v-for="listId in taskLists"
                            :key="listId"
                            :list-id="listId"
                        />
                        <board-task-list-add slot="footer" />
                    </draggable>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { get } from 'http';
import draggable from 'vuedraggable';
import { mapActions, mapState } from 'vuex';
import BoardTaskList from '../../components/boards/BoardTaskList.vue';
import BoardTaskListAdd from '../../components/boards/BoardTaskListAdd.vue';

export default {
    components: { draggable, BoardTaskList, BoardTaskListAdd },
    data() {
        return {};
    },
    head: () => ({
        title: 'Kanban'
    }),
    computed: {
        taskLists: {
            get() {
                return this.board.lists;
            },
            set(newList) {
                const updatedListsRanking = newList.map((listId, index) => {
                    return {
                        id: listId,
                        rank: index
                    };
                });
                this.updateListsRanking(updatedListsRanking);
            }
        },
        ...mapState('boards', ['board'])
    },
    mounted() {
        this.getBoard(this.$route.params.id);
    },
    methods: { ...mapActions('boards', ['getBoard', 'updateListsRanking']) }
};
</script>

<style>
.task-list-row {
    overflow: scroll;
}
</style>
