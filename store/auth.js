import Vue from 'vue';

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
    logout(context) {
        console.log('logout');
        const blankUser = {
            id: '',
            nickname: '',
            username: '',
            avatar: '',
            email: '',
            settingDarkMode: false
        };
        context.commit('set', blankUser);
    }
};
