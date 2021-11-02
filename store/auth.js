import Vue from 'vue';

export const state = () => ({
    auth: {
        id: '',
        nickname: '',
        username: '',
        avatar: '',
        email: '',
        createdDate: '',
        updatedDate: '',
        settingDarkMode: false
    }
});

export const mutations = {
    set(state, user) {
        const userProperties = [
            'id',
            'nickname',
            'username',
            'avatar',
            'email',
            'settingDarkMode'
        ];

        userProperties.forEach(property => {
            Vue.set(state.auth, property, user[property]);
        });
    },
    update(state, updateData) {
        for (const key in updateData) {
            Vue.set(state.auth, key, updateData[key]);
        }
    }
};

export const actions = {
    getUser({ commit }) {
        this.$axios.$get('/api/users/me').then(res => {
            commit('set', res);
        });
    },
    login({ commit }, user) {
        return new Promise((resolve, reject) => {
            this.$axios
                .$post('/api/auth/login/', user)
                .then(res => {
                    commit('set', res);
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    logout({ commit, dispatch }) {
        this.$axios
            .$post('/api/auth/logout')
            .then(() => {
                const blankUser = {
                    id: '',
                    nickname: '',
                    username: '',
                    avatar: '',
                    email: '',
                    settingDarkMode: false
                };
                commit('set', blankUser);
            })
            .catch(() => {
                dispatch('snackbar/showGenericError', null, { root: true });
            });
    },
    async update({ commit, dispatch }, updateData) {
        return new Promise((resolve, reject) => {
            this.$axios
                .$patch('/api/users/me', updateData)
                .then(() => {
                    commit('update', updateData);
                    resolve();
                })
                .catch(err => {
                    if (err.response.status === 422) {
                        reject(err);
                    } else {
                        dispatch('snackbar/showGenericError', null, {
                            root: true
                        });
                    }
                });
        });
    }
};
