import Vue from 'vue';

export const state = () => ({
    users: [],
    usersById: {}
});

export const mutations = {
    set(state, users) {
        Vue.set(state, 'users', users);
        users.forEach(user => {
            Vue.set(state.usersById, user.id, user);
        });
    }
};

export const actions = {
    async getUsers({ commit, dispatch }) {
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
