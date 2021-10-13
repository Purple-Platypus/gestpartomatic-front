<template>
    <v-row class="align-self-stretch">
        <v-col cols="12" class="d-flex">
            <v-card class="align-stretch flex-grow-1" flat outlined>
                <v-card-title class="pa-2">
                    <h1 class="mb-4 text-h3 font-weight-light">
                        {{ board.name }}
                    </h1>
                </v-card-title>

                <v-card-text class="px-2">
                    <v-row>
                        <board-task-list
                            v-for="listId in board.lists"
                            :key="listId"
                            :list-id="listId"
                        />

                        <board-task-list-add />
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BoardTaskList from '../../components/boards/BoardTaskList.vue';
import BoardTaskListAdd from '../../components/boards/BoardTaskListAdd.vue';

export default {
    components: { BoardTaskList, BoardTaskListAdd },
    data() {
        return {};
    },
    head: () => ({
        title: 'Kanban'
    }),
    computed: {
        ...mapState('boards', ['board'])
    },
    mounted() {
        this.getBoard(this.$route.params.id);
    },
    methods: { ...mapActions('boards', ['getBoard']) }
};
</script>
