import Vue from 'vue';
import messages from '~/assets/messages.json';

export const state = () => ({
    boardsList: [],
    board: {},
    lists: {},
    todos: {}
});

export const mutations = {
    setBoardsList(state, boardsList) {
        state.boardsList = boardsList;
    },
    setBoard(state, board) {
        board['lists'] = [];
        state.board = board;
    },
    addList(state, list) {
        list['todosList'] = [];
        Vue.set(state.board.lists, state.board.lists.length, list.id);
        Vue.set(state.lists, list.id, list);
    },
    addTodo(state, todo) {
        const listId = todo.listId;
        state.lists[listId].todosList.push(todo.id);
        Vue.set(state.todos, todo.id, todo);
    },
    resetLists(state) {
        state.board.lists = [];
        state.lists = {};
    }
};

export const actions = {
    async getBoardsList({ commit }) {
        await this.$axios
            .$get('/api/boards')
            .then(boardsList => {
                commit('setBoardsList', boardsList);
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
    getBoard({ commit, dispatch }, boardId) {
        this.$axios
            .$get('/api/boards/' + boardId + '?deep=true')
            .then(res => {
                const { lists, ...board } = res;
                commit('setBoard', board);
                dispatch('parseLists', lists);
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
    parseLists({ commit }, parsedLists) {
        commit('resetLists');

        parsedLists.forEach(parsedList => {
            const { todos, ...list } = parsedList;

            commit('addList', list);

            todos.forEach(todo => {
                commit('addTodo', todo);
            });
        });
    }
};
