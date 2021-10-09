<template>
    <v-col class="col-kanban">
        <v-sheet outlined rounded>
            <v-card class="grey lighten-5" flat>
                <v-card-title
                    class="py-1 px-2 text-body-2 font-weight-light text-uppercase"
                >
                    <h2 class="mr-8 text-body-2 font-weight-light">
                        {{ list.name }}
                    </h2>
                </v-card-title>

                <v-card-text class="px-2 pb-2">
                    <board-task-list-card
                        v-for="todoId in list.todosList"
                        :key="todoId"
                        :todo-id="todoId"
                    >
                        {{ todoId }}
                    </board-task-list-card>
                </v-card-text>
            </v-card>
        </v-sheet>
    </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';
import ShortkeysEmitter from '../commons/mixins/ShortkeysEmitter.mixin';
import BoardTaskListCard from './BoardTaskListCard.vue';

export default {
    name: 'board-task-list',
    components: {
        draggable,
        BoardTaskListCard
    },
    mixins: [ShortkeysEmitter],
    props: {
        listId: Number
    },
    data() {
        return {};
    },
    computed: {
        list() {
            return this.lists[this.listId];
        },
        ...mapState('boards', ['lists'])
    }
};
</script>

<style scoped>
.col-kanban {
    min-width: 400px !important;
    max-width: 400px !important;
}
</style>
