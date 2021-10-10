<template>
    <div class="d-flex flex-column">
        <v-list-item
            :class="{
                'no-ellipsis': isFullContentVisible
            }"
            class="grey lighten-3"
        >
            <v-list-item-icon
                class="ma-0 pt-1 pr-4 align-self-center"
                @click="handleToggle"
            >
                <v-icon v-if="!todo.isDone" color="grey">
                    mdi-checkbox-blank-circle-outline
                </v-icon>
                <v-icon v-else color="grey">
                    mdi-checkbox-marked-circle-outline
                </v-icon>
            </v-list-item-icon>

            <v-list-item-content
                class="pt-2 pb-1 text-decoration-line-through"
                @dblclick="$emit('dblclick')"
                @click="toggleFullContent"
            >
                <v-list-item-title v-text="todo.title"></v-list-item-title>
                <v-list-item-subtitle
                    v-html="md(todo.description)"
                    v-if="todo.description"
                >
                </v-list-item-subtitle>

                <v-list-item-subtitle
                    class="text-caption  mt-1 blue-grey--text"
                    v-if="todo.deadline"
                >
                    <v-icon color="blue-grey" small>
                        mdi-calendar
                    </v-icon>
                    {{ displayDeadline }}
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-progress-linear
            background-color="grey lighten-3"
            bottom
            class="progress--no-transition"
            :color="progress.color || 'primary'"
            :value="Math.floor(progress.value)"
        ></v-progress-linear>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Markdown from '../commons/mixins/Markdown.mixin';
import TodoCountdown from './mixins/TodoCountdown.mixin';

export default {
    name: 'todolist--item',
    mixins: [TodoCountdown, Markdown],
    props: {
        todoId: Number
    },
    data() {
        return {
            isFullContentVisible: false
        };
    },
    computed: {
        todo() {
            return this.todoById(this.todoId);
        },
        displayDeadline() {
            const deadline = new Date(this.todo.deadline);
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            return deadline
                .toLocaleDateString('fr-fr', options)
                .replace(', ', ' à ');
        },
        ...mapGetters('todos', ['todoById'])
    },
    methods: {
        handleToggle() {
            if (this.progress.key) {
                this.stopCountdown();
            } else {
                this.setNotDone();
            }
        },
        async setNotDone() {
            const updatePayload = {
                isDone: false,
                rank: -1
            };
            this.$store.dispatch('todos/modify', {
                updatePayload,
                todoId: this.todoId
            });
        },
        toggleFullContent() {
            this.isFullContentVisible = !this.isFullContentVisible;
        }
    }
};
</script>

<style>
.progress--no-transition .v-progress-linear__determinate {
    transition: none;
}
.todo-content {
    min-height: 44px;
}
.description {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.no-ellipsis .v-list-item__title,
.no-ellipsis .v-list-item__subtitle {
    text-overflow: inherit;
    overflow: inherit;
    white-space: inherit;
}
</style>
