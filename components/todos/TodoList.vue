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

            <v-tooltip v-if="!showArchive" bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="mr-2"
                        icon
                        small
                        @click="switchSort"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="sortDisplay[sortType].color"
                            size="20px"
                        >
                            mdi-{{ sortDisplay[sortType].icon }}
                        </v-icon>
                    </v-btn>
                </template>
                <span>Trier</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        small
                        @click="toggleShowArchive"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="showArchive ? 'primary' : 'grey'"
                            size="20px"
                        >
                            mdi-{{ showArchive ? 'archive' : 'archive-off' }}
                        </v-icon>
                    </v-btn>
                </template>
                <span
                    >Afficher les tâches
                    {{ showArchive ? 'en cours' : 'terminées' }}</span
                >
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
                        <kbd class="ml-2">
                            +
                        </kbd>
                    </v-col>
                </v-row>
            </v-container>

            <todo-list-form-create
                v-else
                ref="todoListFormCreate"
                @close="dismissCreateForm"
            ></todo-list-form-create>

            <v-divider></v-divider>

            <draggable
                :disabled="sortType != 'none'"
                v-model="todosList"
                ghostClass="ghost"
                dragClass="elevation-4"
            >
                <div v-for="todo in todosList" :key="todo.id">
                    <todo-list-form-update
                        v-if="visibleUpdateForm == todo.id"
                        :todoId="todo.id"
                        @close="visibleUpdateForm = null"
                    />
                    <todo-list-item
                        v-else
                        :todoId="todo.id"
                        :key="todo.id"
                        @dblclick="toggleUpdateForm(todo.id)"
                    ></todo-list-item>

                    <v-divider />
                </div>
            </draggable>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable';
import ShortkeysEmitter from '../commons/mixins/ShortkeysEmitter.mixin';
import TodoListItem from './TodoListItem.vue';
import TodoListFormCreate from './TodoListFormCreate.vue';
import TodoListFormUpdate from '../todos/TodoListFormUpdate.vue';
import messages from '~/assets/messages.json';

export default {
    name: 'todo-list',
    components: {
        draggable,
        TodoListItem,
        TodoListFormCreate,
        TodoListFormUpdate
    },
    mixins: [ShortkeysEmitter],
    data() {
        return {
            sortType: 'none',
            sortDisplay: {
                none: { color: 'grey', icon: 'calendar-remove' },
                asc: { color: 'primary', icon: 'sort-calendar-ascending' },
                desc: { color: 'primary', icon: 'sort-calendar-descending' }
            },
            showArchive: false,
            isVisibleAddForm: false,
            visibleUpdateForm: null
        };
    },
    computed: {
        todosList: {
            get() {
                if (this.showArchive) {
                    return this.archivedTodos;
                } else {
                    return this.sortTodosList(this.activeTodos);
                }
            },
            set(list) {
                const newTodosSorting = list.map((todo, index) => {
                    return {
                        id: todo.id,
                        rank: index
                    };
                });
                this.resetRanking(newTodosSorting);
            }
        },
        ...mapGetters('todos', ['activeTodos', 'archivedTodos'])
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
        handleShortkey(e) {
            switch (e.key) {
                case '+':
                    this.addTodo();
                    break;
                case 'Escape':
                    this.dismissAll();
                    break;
            }
        },
        switchSort() {
            switch (this.sortType) {
                case 'none':
                    this.sortType = 'asc';
                    break;
                case 'asc':
                    this.sortType = 'desc';
                    break;
                default:
                    this.sortType = 'none';
                    break;
            }
        },
        sortTodosList(todosList) {
            const sortFunction = this.getFilter();
            return todosList.sort(sortFunction);
        },
        getFilter() {
            switch (this.sortType) {
                case 'asc':
                    return (a, b) => {
                        return '' + a.deadline > '' + b.deadline;
                    };
                case 'desc':
                    return (a, b) => {
                        return '' + a.deadline < '' + b.deadline;
                    };
                default:
                    return (a, b) => {
                        return a.rank > b.rank;
                    };
            }
        },
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
        },
        ...mapActions('todos', ['resetRanking'])
    }
};
</script>

<style scoped>
.ghost {
    background-color: #eeeeee;
}
</style>
