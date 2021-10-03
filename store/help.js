export const state = () => ({
    shortkeys: []
});

export const mutations = {
    set(state, shortkeys) {
        state.shortkeys = shortkeys;
    }
};

export const getters = {
    shortkeys: state => {
        return state.shortkeys;
    }
};
