<template>
    <div class="d-flex flex-column">
        <v-list-item :class="{ 'no-ellipsis': isFullContentVisible }">
            <v-list-item-icon
                class="ma-0 pr-4 align-self-center"
                @click="handleToggle"
            >
                <v-icon v-if="!isContentStroked" color="grey">
                    mdi-checkbox-blank-circle-outline
                </v-icon>
                <v-icon v-else color="grey">
                    mdi-checkbox-marked-circle-outline
                </v-icon>
            </v-list-item-icon>

            <v-list-item-content
                class="pt-2 pb-1"
                :class="{
                    'text-decoration-line-through': isContentStroked
                }"
                @dblclick="$emit('dblclick')"
                @click="toggleFullContent"
            >
                <v-list-item-title v-text="todo.title"></v-list-item-title>
                <v-list-item-subtitle
                    v-text="todo.description"
                    v-if="todo.description"
                >
                </v-list-item-subtitle>

                <v-list-item-subtitle
                    :class="
                        'text-caption  mt-1 ' +
                            (isLate ? 'error' : 'blue-grey') +
                            '--text'
                    "
                    v-if="todo.deadline"
                >
                    <v-icon :color="isLate ? 'error' : 'blue-grey'" small>
                        mdi-calendar
                    </v-icon>
                    {{ displayDeadline }}
                </v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>

        <v-progress-linear
            background-color="white"
            bottom
            class="progress--no-transition"
            :color="progress.color || 'primary'"
            :value="Math.floor(progress.value)"
        ></v-progress-linear>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TodoCountdown from './mixins/TodoCountdown.mixin';

import messages from '~/assets/messages.json';

export default {
    name: 'todolist--item',
    mixins: [TodoCountdown],
    props: {
        todoId: Number
    },
    data() {
        return {
            isContentStroked: false,
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
        isLate() {
            return new Date() > new Date(this.todo.deadline);
        },
        ...mapGetters('todos', ['todoById'])
    },
    mounted() {
        this.isContentStroked = this.todo.isArchived;
    },
    methods: {
        handleToggle() {
            this.toggleDisplay();

            if (this.progress.key) {
                this.stopCountdown();
            } else if (this.todo.isArchived) {
                this.setArchive(false);
            } else {
                this.setCountDown('primary', () => {
                    this.setArchive(true);
                });
            }
        },
        toggleDisplay() {
            this.isContentStroked = !this.isContentStroked;
        },
        setCountDown(color, callback) {
            const delay = 2000;
            const randomKey = Math.random()
                .toString(36)
                .substring(5);

            this.progress.value = 10000 / delay;
            this.progress.key = randomKey;
            this.progress.color = color;

            this.progress.countdown = window.setInterval(() => {
                this.progress.value += 2000 / delay;
            }, 20);

            window.setTimeout(() => {
                // Vérification qu'un nouveau timeout n'a pas été déclenché par click successifs
                if (this.progress.key == randomKey) {
                    callback();
                    this.stopCountdown();
                }
            }, delay);
        },
        async setArchive(status) {
            await this.$axios
                .$patch('/api/todos/' + this.todoId, {
                    isArchived: status
                })
                .then(res => {
                    this.$store.commit('todos/setArchive', {
                        todoId: this.todoId,
                        status
                    });
                })
                .catch(err => {
                    this.$store.commit('snackbar/setSnackbar', {
                        text: messages.errors.generic,
                        color: 'error'
                    });
                });
        },
        toggleFullContent() {
            this.isFullContentVisible = !this.isFullContentVisible;
        },
        async remove() {
            console.log('remove');
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
