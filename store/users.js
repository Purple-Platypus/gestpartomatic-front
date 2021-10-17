import Vue from 'vue';

export const state = () => ({
    users: []
});

export const mutations = {
    set(state, users) {
        Vue.set(state, 'users', users);
    }
};

export const actions = {
    async getUsers({ commit }) {
        await this.$axios
            .$get('/api/users')
            .then(res => {
                commit('set', res);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    }
};
