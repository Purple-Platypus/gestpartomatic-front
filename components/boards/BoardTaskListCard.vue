<template>
    <v-card class="elevation-0" outlined>
        <v-card-title class="pa-2 font-weight-bold text-body-2">
            {{ todo.title }}
        </v-card-title>
        <v-card-text class="pb-2" v-html="md(todo.description)"></v-card-text>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Markdown from '../commons/mixins/Markdown.mixin';

export default {
    name: 'board-task-list-card',
    mixins: [Markdown],
    props: {
        todoId: Number
    },
    data() {
        return {};
    },
    computed: {
        todo() {
            return this.todos[this.todoId];
        },
        ...mapState('boards', ['todos'])
    }
};
</script>

<style scoped>
.col-kanban {
    min-width: 400px !important;
    max-width: 400px !important;
}
</style>
