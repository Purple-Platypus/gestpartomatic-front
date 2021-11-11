<template>
    <v-card
        :color="task.isArchived ? 'grey lighten-2' : ''"
        class="pa-2 elevation-0 task-card cursor-grab"
        outlined
    >
        <v-card-title class=" pa-0 font-weight-bold text-body-2">
            <v-icon v-if="task.priority == 'HIGH'" class="pulse" left size="16">
                mdi-pin </v-icon
            ><v-icon v-if="task.isArchived" left size="16">
                mdi-archive
            </v-icon>
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

        <v-card-text v-if="task.description" class="py-0">
            <tasks-list-card-description
                :taskId="taskId"
                @update="updateDescription"
            />
        </v-card-text>

        <v-card-actions
            v-if="task.tags.length || task.deadline"
            class="px-0 pb-0"
        >
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

            <template v-if="task.deadline">
                <v-icon class="ml-2" small> mdi-calendar </v-icon>&nbsp;<span
                    class="text-caption grey--text text--darken-1"
                >
                    {{ deadline }}
                </span>
            </template>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Markdown from '../../commons/mixins/Markdown.mixin';
import TasksListCardDescription from './TasksListCardDescription.vue';

export default {
    name: 'tasks-list-card',
    mixins: [Markdown],
    components: { TasksListCardDescription },
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
        deadline() {
            return new Date(this.task.deadline).toLocaleDateString('fr-FR');
        },
        ...mapState('users', ['usersById']),
        ...mapState('boards', ['tasks', 'tags'])
    },
    methods: {
        showDetail() {
            this.$emit('show', this.taskId);
        },
        updateDescription(updatedDescription) {
            this.$emit('update', {
                id: this.taskId,
                description: updatedDescription
            });
        }
    }
};
</script>

<style lang="scss">
.v-application .task-card p {
    margin-bottom: 0.125rem;
}
.outlined-avatar {
    outline: 2px solid #fff;
}
.pulse {
    border-radius: 100%;
    animation: pulse 4s infinite;
}
@keyframes pulse {
    0% {
        transform: scale(0.95);
        background-color: rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.375);
    }

    35% {
        transform: scale(1);
        background-color: rgba(0, 0, 0, 0);
        box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
    }

    50% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }

    100% {
        transform: scale(0.95);
        background-color: rgba(0, 0, 0, 0);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}
</style>
