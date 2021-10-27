<template>
    <v-navigation-drawer
        class=" elevation-0"
        fixed
        hide-overlay
        right
        stateless
        temporary
        width="400px"
        v-model="isVisible"
    >
        <v-card-title>
            <h2 class="text-h4 font-weight-light">
                {{ task.title }}
            </h2>
        </v-card-title>

        <v-divider />

        <v-card-text v-html="md(task.description)"></v-card-text>

        <v-divider />

        <v-card-text>
            <v-chip-group column>
                <v-chip v-for="assignee in assigneesList" :key="assignee.id">
                    {{ assignee.nickname || assignee.username }}
                </v-chip>
            </v-chip-group>

            <v-chip-group column>
                <v-chip
                    v-for="tag in tagsList"
                    :key="tag.id"
                    :color="tag.color"
                    small
                >
                    {{ tag.label }}
                </v-chip>
            </v-chip-group>
        </v-card-text>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import Markdown from '../../commons/mixins/Markdown.mixin';

export default {
    name: 'task-detail',
    components: {},
    mixins: [Markdown],
    props: {
        taskId: Number,
        isVisible: Boolean
    },
    data() {
        return {};
    },
    computed: {
        task() {
            return this.tasks[this.taskId];
        },
        assigneesList() {
            const assigneesList = this.task.assignees.map(assigneeId => {
                return this.users[assigneeId];
            });
            return assigneesList;
        },
        tagsList() {
            const tagsList = this.task.tags.map(tagId => {
                return this.tags[tagId];
            });
            return tagsList;
        },
        ...mapState('users', ['users']),
        ...mapState('boards', ['tasks', 'tags'])
    },

    methods: {
        close() {
            if (this.isVisible) {
                this.$emit('close');
            }
        }
    }
};
</script>
