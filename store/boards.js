import Vue from 'vue';

export const state = () => ({
    boardsList: [],
    boards: {},
    board: { lists: [] },
    guests: {},
    lists: {},
    tasks: {},
    tags: {},
    filters: {
        tags: [],
        assignees: [],
        words: []
    }
});

export const mutations = {
    // Board
    setBoard(state, board) {
        board['lists'] = [];
        board['guests'] = [];
        state.board = board;
    },
    addBoard(state, board) {
        const guestsRoles = {};
        board.guests.forEach(user => {
            guestsRoles[user.userId] = user.role;
        });
        board.guests = guestsRoles;

        if (state.boardsList.indexOf(board.id) === -1) {
            state.boardsList.push(board.id);
        }
        Vue.set(state.boards, board.id, board);

        if (board.id === state.board.id) {
            for (const attr in board) {
                Vue.set(state.board, attr, board[attr]);
            }
        }
    },
    setFilters(state, filters) {
        Vue.set(state, 'filters', filters);
    },

    // Lists
    addList(state, list) {
        list['tasksList'] = [];
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

    // Guests
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

    // Tags
    addTag(state, tag) {
        Vue.set(state.tags, tag.id, tag);
    },
    purgeTag(state, tagId) {
        for (const taskId in state.tasks) {
            const deletedTagIndex = state.tasks[taskId].tags.indexOf(tagId);
            Vue.delete(state.tasks[taskId].tags, deletedTagIndex);
        }
        Vue.delete(state.tags, tagId);
    },

    // Tasks
    addTask(state, task) {
        const listId = task.listId;

        task.tags = task.tags.map(tag => tag.id);
        task.assignees = task.assignees.map(assignee => assignee.id);

        if (state.lists[listId].tasksList.indexOf(task.id) === -1) {
            state.lists[listId].tasksList.push(task.id);
        }
        Vue.set(state.tasks, task.id, task);
    },

    updateTasksOrder(state, updateData) {
        if (updateData.type == 'added') {
            Vue.set(
                state.tasks[updateData.taskId],
                'listId',
                updateData.listId
            );
        }
        if (typeof updateData.oldIndex !== 'undefined') {
            const removedIndex = state.lists[
                updateData.listId
            ].tasksList.indexOf(updateData.taskId);
            Vue.delete(state.lists[updateData.listId].tasksList, removedIndex);
        }
        if (typeof updateData.newIndex !== 'undefined') {
            state.lists[updateData.listId].tasksList.splice(
                updateData.newIndex,
                0,
                updateData.taskId
            );
        }
    },
    removeTask(state, { taskId, listId }) {
        const deletedIndex = state.lists[listId].tasksList.indexOf(taskId);
        state.lists[listId].tasksList.splice(deletedIndex, 1);
        Vue.delete(state.tasks, taskId);
    }
};

export const actions = {
    // BoardsList
    async getBoardsList({ commit, dispatch }) {
        await this.$axios
            .$get('/api/boards')
            .then(boardsList => {
                boardsList.forEach(board => {
                    commit('addBoard', board);
                });
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },

    // Board
    getBoard({ commit, dispatch }, boardId) {
        return new Promise((resolve, reject) => {
            this.$axios
                .$get('/api/boards/' + boardId + '?deep=true')
                .then(res => {
                    const { lists, guests, ...board } = res;
                    commit('setBoard', board);
                    dispatch('parseLists', lists);
                    dispatch('parseGuests', guests);
                    resolve(board.id);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    createBoard({ commit, dispatch }, board) {
        this.$axios
            .$post('/api/boards', board)
            .then(res => {
                commit('addBoard', res);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    updateBoard({ commit, dispatch }, boardData) {
        const { id, ...board } = boardData;

        this.$axios
            .$patch('/api/boards/' + id, board)
            .then(updatedBoard => {
                commit('addBoard', updatedBoard);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },

    // Lists
    parseLists({ commit }, parsedLists) {
        commit('resetLists');

        parsedLists.sort((a, b) => {
            return a.rank > b.rank;
        });

        parsedLists.forEach(parsedList => {
            const { tasks, ...list } = parsedList;

            commit('addList', list);

            tasks
                .sort((a, b) => {
                    return a.rank > b.rank;
                })
                .forEach(task => {
                    commit('addTask', task);
                });
        });
    },
    createList({ commit, dispatch, state }, list) {
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

    // Tags
    getTags({ commit, dispatch }) {
        this.$axios
            .$get('/api/tags')
            .then(res => {
                res.forEach(tag => {
                    commit('addTag', tag);
                });
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },

    // Guests
    createGuest({ state, commit, dispatch }, { userId, role }) {
        this.$axios
            .$post('/api/boards/' + state.board.id + '/guest', {
                userId,
                role
            })
            .then(res => {
                commit('addGuest', res);
            })
            .catch(() => {
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
            .catch(() => {
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
            .filter(boardId => {
                return !state.boards[boardId].isArchived;
            })
            .sort((a, b) => {
                return (
                    state.boards[a].name.toLowerCase() >
                    state.boards[b].name.toLowerCase()
                );
            });
    },
    archivedBoards: state => {
        return state.boardsList
            .filter(boardId => {
                return state.boards[boardId].isArchived;
            })
            .sort((a, b) => {
                return (
                    state.boards[a].name.toLowerCase() >
                    state.boards[b].name.toLowerCase()
                );
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
    },
    tagsList: state => {
        const tagsArray = [];
        for (const tagId in state.tags) {
            tagsArray.push(state.tags[tagId]);
        }

        return tagsArray.sort((a, b) => {
            return a.label > b.label;
        });
    }
};
