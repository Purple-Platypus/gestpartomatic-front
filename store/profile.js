import Vue from 'vue';

export const state = () => ({
    profile: {
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
            Vue.set(state.profile, property, user[property]);
        });
    },
    update(state, updateData) {
        for (const key in updateData) {
            Vue.set(state.profile, key, updateData[key]);
        }
    }
};

export const actions = {
    getUser({ commit }) {
        this.$axios.$get('/api/users/me').then(res => {
            commit('set', res);
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
