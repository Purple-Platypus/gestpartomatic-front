import Vue from 'vue';

export const state = () => ({
    todoList: [],
    todos: {}
});

export const mutations = {
    reset(state) {
        state.todoList = [];
        state.todos = {};
    },
    add(state, todo) {
        state.todoList.push(todo.id);
        Vue.set(state.todos, todo.id, todo);
    },
    update(state, updatedTodo) {
        const updatedId = updatedTodo.id;
        Vue.set(state.todos, updatedId, updatedTodo);
    },
    updateTodosRanking(state, sortedIds) {
        sortedIds.forEach((id, index) => {
            state.todos[id].rank = index;
        });
    },
    delete(state, todoId) {
        const deletedIndex = state.todoList.indexOf(todoId);
        Vue.delete(state.todoList, deletedIndex);
        Vue.delete(state.todos, todoId);
    }
};

export const actions = {
    async init(context) {
        await this.$axios
            .$get('/api/todos')
            .then(res => {
                context.commit('reset');
                res.forEach(todo => {
                    context.commit('add', todo);
                });
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    async create({ commit }, createPayload) {
        await this.$axios
            .$post('/api/todos', createPayload)
            .then(res => {
                commit('add', res);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    async update({ commit, dispatch }, { todoId, updatePayload }) {
        await this.$axios
            .$patch('/api/todos/' + todoId, updatePayload)
            .then(res => {
                commit('update', res);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    async updateTodosRanking({ commit, dispatch }, updatedRanking) {
        const sortedIds = updatedRanking.map(item => {
            return item.id;
        });
        commit('updateTodosRanking', sortedIds);

        await this.$axios.$patch('/api/todos/', updatedRanking).catch(() => {
            dispatch('snackbar/showGenericError', null, { root: true });
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

                dispatch('updateTodosRanking', updatedRanking);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    }
};

export const getters = {
    allTodos: state => {
        return state.todoList
            .map(todoId => {
                return {
                    id: todoId,
                    progression: state.todos[todoId].progression,
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
        return getters.allTodos.filter(todo => todo.progression == 'TODO');
    },
    doneTodos: (state, getters) => {
        return getters.allTodos
            .filter(todo => todo.progression == 'DONE')
            .sort((a, b) => {
                return a.updatedAt > b.updatedAt;
            });
    },
    todoById: state => todoId => {
        return state.todos[todoId];
    }
};
