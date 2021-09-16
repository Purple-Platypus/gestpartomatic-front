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
