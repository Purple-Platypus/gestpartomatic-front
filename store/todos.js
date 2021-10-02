import Vue from 'vue';
import messages from '~/assets/messages.json';

export const state = () => ({
    todosList: [],
    todos: {}
});

export const mutations = {
    add(state, todo) {
        state.todosList.push(todo.id);
        Vue.set(state.todos, todo.id, todo);
    },
    setArchive(state, { todoId, status }) {
        Vue.set(state.todos[todoId], 'isArchived', status);
    },
    update(state, updatedTodo) {
        const updatedId = updatedTodo.id;
        Vue.set(state.todos, updatedId, updatedTodo);
    },
    setRanking(state, sortedIds) {
        sortedIds.forEach((id, index) => {
            state.todos[id].rank = index;
        });
    },
    delete(state, todoId) {
        const deletedIndex = state.todosList.indexOf(todoId);
        Vue.delete(state.todosList, deletedIndex);
        Vue.delete(state.todos, todoId);
    }
};

export const actions = {
    init(context, todosList) {
        todosList.forEach(todo => {
            context.commit('add', todo);
        });
    },
    async create({ commit }, createPayload) {
        await this.$axios
            .$post('/api/todos', createPayload)
            .then(res => {
                commit('add', res);
            })
            .catch(err => {
                commit(
                    'snackbar/setSnackbar',
                    {
                        text: messages.errors.generic,
                        color: 'error'
                    },
                    { root: true }
                );
            });
    },
    async modify({ commit }, { todoId, updatePayload }) {
        await this.$axios
            .$patch('/api/todos/' + todoId, updatePayload)
            .then(res => {
                commit('update', res);
            })
            .catch(err => {
                commit(
                    'snackbar/setSnackbar',
                    {
                        text: messages.errors.generic,
                        color: 'error'
                    },
                    { root: true }
                );
            });
    },
    async resetRanking({ commit }, updatedRanking) {
        await this.$axios
            .$patch('/api/todos/', updatedRanking)
            .then(() => {
                const sortedIds = updatedRanking.map(item => {
                    return item.id;
                });
                commit('setRanking', sortedIds);
            })
            .catch(err => {
                commit(
                    'snackbar/setSnackbar',
                    {
                        text: messages.errors.generic,
                        color: 'error'
                    },
                    { root: true }
                );
            });
    },
    async remove({ commit, dispatch, getters }, todoId) {
        await this.$axios
            .$delete('/api/todos/' + todoId)
            .then(() => {
                commit('delete', todoId);

                const updatedRanking = getters.activeTodos.map(todo => {
                    return {
                        id: todo.id,
                        rank: getters.activeTodos.indexOf(todo)
                    };
                });

                dispatch('resetRanking', updatedRanking);
            })
            .catch(err => {
                commit(
                    'snackbar/setSnackbar',
                    {
                        text: messages.errors.generic,
                        color: 'error'
                    },
                    { root: true }
                );
            });
    }
};

export const getters = {
    allTodos: state => {
        return state.todosList
            .map(todoId => {
                return {
                    id: todoId,
                    isArchived: state.todos[todoId].isArchived,
                    rank: state.todos[todoId].rank,
                    deadline: state.todos[todoId].deadline,
                    updatedAt: state.todos[todoId].updatedAt
                };
            })
            .sort((a, b) => {
                return a.rank > b.rank;
            });
    },
    activeTodos: (state, getters) => {
        return getters.allTodos.filter(todo => !todo.isArchived);
    },
    archivedTodos: (state, getters) => {
        return getters.allTodos
            .filter(todo => todo.isArchived)
            .sort((a, b) => {
                return a.updatedAt > b.updatedAt;
            });
    },
    todoById: state => todoId => {
        return state.todos[todoId];
    }
};
