import Vue from 'vue';

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
    remove(state, todoId) {
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
    }
};

export const getters = {
    userTodos: state => {
        return state.todosList
            .map(todoId => {
                return {
                    id: todoId,
                    isArchived: state.todos[todoId].isArchived,
                    rank: state.todos[todoId].rank
                };
            })
            .sort((a, b) => {
                return a.rank > b.rank;
            });
    },
    todoById: state => todoId => {
        return state.todos[todoId];
    }
};
