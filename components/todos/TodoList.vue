<template>
    <v-card
        id="todo-list"
        class="fill-height cursor-pointer todo-list"
        outlined
        @click.self.native="addTodo"
        v-click-outside="dismissAll"
    >
        <v-card-title class="text-body-2 font-weight-light text-uppercase">
            <h2 class="mr-8 text-body-2 font-weight-light">
                Ma liste perso
            </h2>

            {{ todosList.length }}

            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        x-small
                        @click="toggleShowArchive"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="showArchive ? 'green' : 'grey lighten-1'"
                        >
                            mdi-checkbox-marked-circle-outline
                        </v-icon>
                    </v-btn>
                </template>
                <span>Afficher les tâches terminées</span>
            </v-tooltip>
        </v-card-title>

        <v-card-text class="pa-0">
            <v-container class="pa-0" v-if="!isVisibleAddForm">
                <v-row
                    class="py-2 align-center cursor-pointer"
                    @click="addTodo"
                >
                    <v-col class="flex-grow-0 pl-6">
                        <v-icon color="primary">
                            mdi-plus
                        </v-icon>
                    </v-col>

                    <v-col
                        class="flex-grow-1 text-body-1 font-weight-light primary--text"
                    >
                        Ajouter une tâche
                    </v-col>
                </v-row>
            </v-container>

            <todo-list-form-create
                v-else
                ref="todoListFormCreate"
                @close="dismissCreateForm"
            ></todo-list-form-create>

            <v-divider></v-divider>

            <template v-for="(todo, index) in todosList">
                <todo-list-form-update
                    v-if="visibleUpdateForm == todo.id"
                    :todoId="todo.id"
                    :key="todo.id"
                    @close="visibleUpdateForm = null"
                />
                <todo-list-item
                    v-else
                    :todoId="todo.id"
                    :key="todo.id"
                    @dblclick="toggleUpdateForm(todo.id)"
                ></todo-list-item>

                <v-divider :key="'todo-list-divider-' + index" />
            </template>
        </v-card-text>
    </v-card>
</template>

<script>
import TodoListItem from './TodoListItem.vue';
import TodoListFormCreate from './TodoListFormCreate.vue';
import TodoListFormUpdate from '../todos/TodoListFormUpdate.vue';
import messages from '~/assets/messages.json';

export default {
    name: 'todo-list',
    components: { TodoListItem, TodoListFormCreate, TodoListFormUpdate },
    data() {
        return {
            showArchive: false,
            isVisibleAddForm: false,
            visibleUpdateForm: null
        };
    },
    computed: {
        todosList: function() {
            if (this.showArchive) {
                return this.$store.getters['todos/userTodos'];
            } else {
                return this.$store.getters['todos/userTodos'].filter(
                    todo => !todo.isArchived
                );
            }
        }
    },
    async fetch() {
        await this.$axios
            .$get('/api/todos')
            .then(res => {
                this.$store.dispatch('todos/init', res);
            })
            .catch(err => {
                this.$store.commit('snackbar/setSnackbar', {
                    text: messages.errors.generic,
                    color: 'error'
                });
            });
    },
    methods: {
        toggleShowArchive() {
            this.showArchive = !this.showArchive;
        },
        addTodo() {
            this.isVisibleAddForm = true;
            this.dismissUpdateForm();
            this.$nextTick().then(() => {
                this.$refs.todoListFormCreate.$refs.todoListForm.$refs.inputDescription.focus();
            });
        },
        async sendTodo() {
            const createPayload = {
                rank: this.todosList.length
            };
            await this.$axios
                .$post('/api/todos', createPayload)
                .then(res => {
                    this.$store.commit('todos/add', res);
                })
                .catch(err => {
                    this.$store.commit('snackbar/setSnackbar', {
                        text: messages.errors.generic,
                        color: 'error'
                    });
                });
        },
        toggleUpdateForm(todoId) {
            this.visibleUpdateForm = todoId;
            this.dismissCreateForm();
        },
        dismissAll() {
            this.dismissCreateForm();
            this.dismissUpdateForm();
        },
        dismissCreateForm() {
            this.isVisibleAddForm = false;
        },
        dismissUpdateForm() {
            this.visibleUpdateForm = null;
        }
    }
};
</script>
