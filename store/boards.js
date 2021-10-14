import Vue from 'vue';

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
    addBoard(state, board) {
        state.boardsList.push(board);
    },
    updateBoard(state, { boardId, board }) {
        const UpdatedIndex = state.boardsList.findIndex(board => {
            return board.id == boardId;
        });
        Vue.set(state.boardsList, UpdatedIndex, board);
    },
    addList(state, list) {
        list['todosList'] = [];
        Vue.set(state.board.lists, state.board.lists.length, list.id);
        Vue.set(state.lists, list.id, list);
    },
    removeList(state, listId) {
        const removedListIndex = state.board.lists.findIndex(
            list => list === listId
        );
        console.log(removedListIndex);
        Vue.delete(state.board.lists, removedListIndex);
    },
    resetLists(state) {
        state.board.lists = [];
        state.lists = {};
    },
    addTodo(state, todo) {
        const listId = todo.listId;
        state.lists[listId].todosList.push(todo.id);
        Vue.set(state.todos, todo.id, todo);
    }
};

export const actions = {
    async getBoardsList({ commit }) {
        await this.$axios
            .$get('/api/boards')
            .then(boardsList => {
                commit('setBoardsList', boardsList);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
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
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    addBoard({ commit }, board) {
        this.$axios
            .$post('/api/boards', board)
            .then(res => {
                commit('addBoard', res);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    archiveBoard({ commit, dispatch }, boardId) {
        const patchPayload = {
            isArchived: true
        };

        this.$axios
            .$patch('/api/boards/' + boardId, patchPayload)
            .then(updatedBoard => {
                commit('updateBoard', {
                    boardId,
                    board: updatedBoard
                });
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    restoreBoard({ commit }, boardId) {
        const patchPayload = {
            isArchived: false
        };

        this.$axios
            .$patch('/api/boards/' + boardId, patchPayload)
            .then(updatedBoard => {
                commit('updateBoard', {
                    boardId,
                    board: updatedBoard
                });
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    updateBoard({ commit, dispatch }, { boardId, boardData }) {
        this.$axios
            .$patch('/api/boards/' + boardId, boardData)
            .then(updatedBoard => {
                commit('updateBoard', {
                    boardId,
                    board: updatedBoard
                });
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
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
    },
    addList({ commit, dispatch, state }, list) {
        Object.assign(list, {
            boardId: state.board.id,
            rank: state.board.lists.length
        });

        this.$axios
            .$post('/api/lists/', list)
            .then(res => {
                commit('addList', res);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    removeList({ commit }, listId) {
        this.$axios
            .$delete('/api/lists/' + listId)
            .then(res => {
                commit('removeList', listId);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    }
};

export const getters = {
    activeBoards: state => {
        return state.boardsList.filter(board => !board.isArchived);
    },
    archivedBoards: state => {
        return state.boardsList.filter(board => board.isArchived);
    },
    boardById: state => boardId => {
        return state.boardsList.find(board => {
            return board.id == boardId;
        });
    }
};
