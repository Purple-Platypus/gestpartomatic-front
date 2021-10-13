import messages from '~/assets/messages.json';

export const state = () => ({
    color: '',
    text: ''
});

export const mutations = {
    setSnackbar(state, snackbar = {}) {
        state.text = snackbar.text || '';
        state.color = snackbar.color || '';
    }
};

export const actions = {
    showGenericError({ commit }) {
        commit('setSnackbar', {
            text: messages.errors.generic,
            color: 'error'
        });
    }
};
