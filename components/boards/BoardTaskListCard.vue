<template>
    <v-card class="elevation-0" outlined>
        <v-card-title class="pa-2 font-weight-bold text-body-2">
            {{ task.title }}
        </v-card-title>
        <v-card-text class="pb-2" v-html="md(task.description)"></v-card-text>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Markdown from '../commons/mixins/Markdown.mixin';

export default {
    name: 'board-task-list-card',
    mixins: [Markdown],
    props: {
        taskId: Number
    },
    data() {
        return {};
    },
    computed: {
        task() {
            return this.tasks[this.taskId];
        },
        ...mapState('boards', ['tasks'])
    }
};
</script>

<style scoped>
.col-kanban {
    min-width: 400px !important;
    max-width: 400px !important;
}
</style>
