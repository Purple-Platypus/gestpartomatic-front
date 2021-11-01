<template>
    <v-card class="pa-2 elevation-0 task-card" outlined>
        <v-card-title class=" pa-0 font-weight-bold text-body-2">
            <a
                v-html="md(task.title)"
                class="text--grey"
                @click.stop="showDetail"
            ></a>
            <v-spacer />
            <span v-if="task.assignees.length">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-avatar
                            v-for="assigneeId in task.assignees"
                            :key="assigneeId"
                            class="ml-n2 outlined-avatar"
                            left
                            size="20"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-img :src="usersById[assigneeId].avatar"></v-img>
                        </v-avatar>
                    </template>
                    <span>
                        {{ assigneesNames }}
                    </span>
                </v-tooltip>
            </span>
        </v-card-title>

        <v-card-text
            v-if="task.description"
            class="py-0"
            v-html="md(task.description)"
        />

        <v-card-actions v-if="task.tags.length" class="px-0 pb-0">
            <v-chip
                v-for="tagId in task.tags"
                :key="tagId"
                class="mr-1 px-2"
                :color="tags[tagId].color"
                :dark="tags[tagId].isDark"
                x-small
            >
                {{ tags[tagId].label }}
            </v-chip>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Markdown from '../../commons/mixins/Markdown.mixin';

export default {
    name: 'tasks-list-card',
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
        assigneesNames() {
            const names = this.task.assignees.map(assigneeId => {
                return (
                    this.usersById[assigneeId].nickname ||
                    this.usersById[assigneeId].username
                );
            });

            if (names.length === 1) {
                return names[0];
            } else {
                const lastName = names.pop();
                return names.join(', ') + ' et ' + lastName;
            }
        },
        ...mapState('users', ['usersById']),
        ...mapState('boards', ['tasks', 'tags'])
    },
    methods: {
        showDetail() {
            this.$emit('show');
        }
    }
};
</script>

<style>
.v-application .task-card p {
    margin-bottom: 0.125rem;
}
.outlined-avatar {
    outline: 2px solid #fff;
}
</style>
