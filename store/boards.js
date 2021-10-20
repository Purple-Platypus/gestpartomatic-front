import Vue from 'vue';

export const state = () => ({
    boardsList: [],
    board: { lists: [] },
    guests: {},
    lists: {},
    todos: {}
});

export const mutations = {
    setBoardsList(state, boardsList) {
        state.boardsList = boardsList;
    },
    setBoard(state, board) {
        board['lists'] = [];
        board['guests'] = [];
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
        if (boardId == state.board.id) {
            Object.keys(board).forEach(prop => {
                Vue.set(state.board, prop, board[prop]);
            });
        }
    },
    addList(state, list) {
        list['todosList'] = [];
        Vue.set(state.board.lists, state.board.lists.length, list.id);
        Vue.set(state.lists, list.id, list);
    },
    updateList(state, list) {
        Object.keys(list).forEach(prop => {
            Vue.set(state.lists[list.id], prop, list[prop]);
        });
    },
    updateListsRanking(state, listsArray) {
        Vue.set(state.board, 'lists', listsArray);
    },
    removeList(state, listId) {
        const removedListIndex = state.board.lists.findIndex(
            list => list === listId
        );
        Vue.delete(state.board.lists, removedListIndex);
    },
    resetLists(state) {
        state.board.lists = [];
        state.lists = {};
    },
    resetGuests(state) {
        state.board.guests = [];
        state.guests = {};
    },
    addGuest(state, guest) {
        const flatGuest = Object.assign(guest.user, { role: guest.role });
        Vue.set(state.board.guests, state.board.guests.length, flatGuest.id);
        Vue.set(state.guests, flatGuest.id, flatGuest);
    },
    removeGuest(state, removedId) {
        const removedGuestIndex = state.board.guests.findIndex(
            guestId => guestId === removedId
        );
        Vue.delete(state.board.guests, removedGuestIndex);
        Vue.delete(state.guests, removedId);
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
                const { lists, guests, ...board } = res;
                commit('setBoard', board);
                dispatch('parseLists', lists);
                dispatch('parseGuests', guests);
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
    addGuest({ state, commit, dispatch }, { userId, role }) {
        this.$axios
            .$post('/api/boards/' + state.board.id + '/guest', {
                userId,
                role
            })
            .then(res => {
                commit('addGuest', res);
            })
            .catch(e => {
                console.log(e);
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    updateGuestRole({ state, dispatch, commit }, { userId, role }) {
        this.$axios
            .$patch('/api/boards/' + state.board.id + '/guest/' + userId, {
                role
            })
            .then(updatedBoard => {
                commit('updateBoard', {
                    boardId: state.board.id,
                    board: updatedBoard
                });
            })
            .catch(e => {
                console.log(e);
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    removeGuest({ state, dispatch, commit }, guestId) {
        this.$axios
            .$delete('/api/boards/' + state.board.id + '/guest/' + guestId)
            .then(() => {
                commit('removeGuest', guestId);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    parseLists({ commit }, parsedLists) {
        commit('resetLists');

        parsedLists.sort((a, b) => {
            return a.rank > b.rank;
        });

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
    updateList({ commit, dispatch }, { listId, listData }) {
        this.$axios
            .$patch('/api/lists/' + listId, listData)
            .then(updatedList => {
                commit('updateList', updatedList);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    updateListsRanking({ commit, dispatch }, listsArray) {
        const sortedIds = listsArray.map(item => {
            return item.id;
        });
        commit('updateListsRanking', sortedIds);

        this.$axios.$patch('/api/lists/', listsArray).catch(() => {
            dispatch('snackbar/showGenericError', null, { root: true });
        });
    },
    removeList({ commit }, listId) {
        this.$axios
            .$delete('/api/lists/' + listId)
            .then(() => {
                commit('removeList', listId);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },

    parseGuests({ commit }, parsedGuests) {
        commit('resetGuests');

        parsedGuests.forEach(parsedGuest => {
            commit('addGuest', parsedGuest);
        });
    }
};

export const getters = {
    activeBoards: state => {
        return state.boardsList
            .filter(board => !board.isArchived)
            .sort((a, b) => {
                return a.name.toLowerCase() > b.name.toLowerCase();
            });
    },
    archivedBoards: state => {
        return state.boardsList
            .filter(board => board.isArchived)
            .sort((a, b) => {
                return a.name.toLowerCase() > b.name.toLowerCase();
            });
    },
    boardById: state => boardId => {
        return state.boardsList.find(board => {
            return board.id == boardId;
        });
    },
    isAdmin: (state, getters, rootState) => {
        const authId = rootState.auth.auth.id;
        return (
            state.guests.hasOwnProperty(authId) &&
            state.guests[authId].role == 'ADMIN'
        );
    }
};
