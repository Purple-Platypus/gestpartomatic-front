<template>
    <v-card
        id="todo-list"
        class="fill-height cursor-pointer todo-list"
        outlined
        @dblclick.self.native="addTodo"
        v-click-outside="hideAll"
    >
        <v-card-title class="text-body-2 font-weight-light text-uppercase">
            <h2 class="mr-8 text-body-2 font-weight-light">
                Ma liste perso
            </h2>

            {{ todosList.length }}

            <v-spacer></v-spacer>

            <v-tooltip v-if="!showDone" bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
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

            <v-tooltip v-if="doneTodos.length" bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="ml-2"
                        icon
                        small
                        @click="toggleShowDone"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon
                            :color="showDone ? 'primary' : 'grey'"
                            size="20px"
                        >
                            mdi-{{ showDone ? 'archive' : 'archive-off' }}
                        </v-icon>
                    </v-btn>
                </template>
                <span
                    >Afficher les tâches
                    {{ showDone ? 'en cours' : 'terminées' }}</span
                >
            </v-tooltip>
        </v-card-title>

        <v-card-text class="pa-0" v-if="showDone">
            <div v-for="doneTodo in doneTodos" :key="doneTodo.id">
                <todo-list-item-done :todoId="doneTodo.id" :key="doneTodo.id" />

                <v-divider />
            </div>
        </v-card-text>

        <v-card-text class="pa-0" v-else>
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
                @close="hideCreateForm"
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
                        ref="todoListFormUpdate"
                        @close="hideUpdateForm"
                    />
                    <todo-list-item
                        v-else
                        :todoId="todo.id"
                        :key="todo.id"
                        @dblclick="showUpdateForm(todo.id)"
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
import TodoListItemDone from './TodoListItemDone.vue';
import TodoListFormCreate from './TodoListFormCreate.vue';
import TodoListFormUpdate from '../todos/TodoListFormUpdate.vue';

export default {
    name: 'todo-list',
    components: {
        draggable,
        TodoListItem,
        TodoListItemDone,
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
            showDone: false,
            isVisibleAddForm: false,
            visibleUpdateForm: null
        };
    },
    computed: {
        todosList: {
            get() {
                return this.sortTodosList(this.activeTodos);
            },
            set(updatedList) {
                const updatedTodosRanking = updatedList.map((todo, index) => {
                    return {
                        id: todo.id,
                        data: { rank: index }
                    };
                });
                this.updateTodosRanking(updatedTodosRanking);
            }
        },
        ...mapGetters('todos', ['activeTodos', 'doneTodos'])
    },
    async fetch() {
        this.$store.dispatch('todos/init');
    },
    methods: {
        handleShortkey(e) {
            switch (e.key) {
                case '+':
                    this.addTodo();
                    break;
                case 'Escape':
                    this.hideAll();
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
        toggleShowDone() {
            this.showDone = !this.showDone;
        },
        addTodo() {
            this.isVisibleAddForm = true;
            this.hideUpdateForm();
        },
        showUpdateForm(todoId) {
            this.visibleUpdateForm = todoId;
            this.hideCreateForm();
        },
        hideAll() {
            this.hideCreateForm();
            this.hideUpdateForm();
        },
        hideCreateForm() {
            this.isVisibleAddForm = false;
        },
        hideUpdateForm() {
            this.visibleUpdateForm = null;
        },
        handleUndone() {
            console.log('plop');
            this.showDone = this.doneTodos > 0;
        },
        ...mapActions('todos', ['updateTodosRanking'])
    },
    watch: {
        doneTodos(doneTodos) {
            if (!doneTodos.length) {
                this.showDone = false;
            }
        }
    }
};
</script>

<style scoped>
.ghost {
    background-color: #eeeeee;
}
</style>
