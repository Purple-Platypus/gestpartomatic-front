import Vue from 'vue';
import messages from '~/assets/messages.json';

export const state = () => ({
    list: []
});

export const mutations = {
    set(state, boardsList) {
        state.list = boardsList;
    }
};

export const actions = {
    async get({ commit }) {
        await this.$axios
            .$get('/api/boards')
            .then(boardsList => {
                commit('set', boardsList);
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
