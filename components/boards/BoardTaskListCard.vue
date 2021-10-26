<template>
    <v-card class="elevation-0 task-card" outlined>
        <v-card-title class="pa-2 font-weight-bold text-body-2">
            {{ task.title }}
        </v-card-title>
        <v-card-text
            v-if="task.description"
            class="pb-2"
            v-html="md(task.description)"
        />
        <v-card-actions v-if="task.tags.length">
            <v-chip
                v-for="tagId in task.tags"
                :key="tagId"
                class="mr-1 px-2"
                :color="tags[tagId].color"
                x-small
            >
                {{ tags[tagId].label }}
            </v-chip>
        </v-card-actions>
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
        ...mapState('boards', ['tasks', 'tags'])
    }
};
</script>

<style>
.v-application .task-card p {
    margin-bottom: 0.25rem;
}
</style>
