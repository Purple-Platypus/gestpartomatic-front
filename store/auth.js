import Vue from 'vue';
import messages from '~/assets/messages.json';

export const state = () => ({
    id: '',
    nickname: '',
    username: '',
    avatar: '',
    email: '',
    createdDate: '',
    updatedDate: '',
    settingDarkMode: false
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
            Vue.set(state, property, user[property]);
        });
    },
    update(state, updateData) {
        for (const key in updateData) {
            Vue.set(state, key, updateData[key]);
        }
    }
};

export const actions = {
    login(context, user) {
        context.commit('set', user);
    },
    async logout({ context, commit }) {
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
