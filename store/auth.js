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
    async getUser({ commit }) {
        await this.$axios.$get('/api/users/me').then(res => {
            commit('set', res);
        });
    },
    async login({ commit }, user) {
        await this.$axios
            .$post('/api/auth/login/', user)
            .then(res => {
                commit('set', res);
            })
            .catch(err => {
                if (err.response.status !== 401) {
                    dispatch('snackbar/showGenericError', null, { root: true });
                }
                return err.response.status;
            });
    },
    async logout({ commit }) {
        await this.$axios
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
    }
};
