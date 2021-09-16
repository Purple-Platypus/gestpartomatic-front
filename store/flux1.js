import Vue from 'vue';

export const state = () => ({
    definitions: [],
    flux1: [],
    selection: []
});

export const mutations = {
    addDefinition(state, definition) {
        Vue.set(state.definitions, state.definitions.length, definition);
    },
    removeArticleDefinitions(state, indexArticle) {
        const filteredData = state.definitions.filter(item => {
            return item.article != indexArticle;
        });

        Vue.set(state, 'definitions', filteredData);
    },
    resetDefinitions(state) {
        state.definitions = [];
    },
    addSetting(state, setting) {
        if (!setting) {
            const settingId = Math.random()
                .toString(36)
                .substring(7);

            setting = {
                settingId,
                article: null,
                propertyId: null,
                style: 'blue',
                filter: null,
                invert: false
            };
        }
        Vue.set(state.selection, state.selection.length, setting);
    },
    updateSetting(state, { settingId, prop, value }) {
        const updatedIndex = state.selection.findIndex(setting => {
            return setting.settingId === settingId;
        });
        Vue.set(state.selection[updatedIndex], prop, value);
    },
    removeSetting(state, deletedSetting) {
        const deletedIndex = state.selection.indexOf(deletedSetting);
        Vue.delete(state.selection, deletedIndex);
    }
};

export const actions = {
    setDefinitions(context, definitions) {
        context.commit('resetDefinitions');
        definitions.forEach(definition => {
            context.commit('addDefinition', definition);
        });
    },
    setArticle(context, { articleData, indexArticle }) {
        context.commit('removeArticleDefinitions', indexArticle);
        articleData.forEach(definition => {
            definition.article = indexArticle;
            context.commit('addDefinition', definition);
        });
    },
    setSelection(context, selectionList) {
        selectionList.forEach(selection => {
            context.commit('addSetting', selection);
        });
    }
};

export const getters = {
    getArticle: state => index => {
        const articleData = state.definitions.filter(
            item => item.article === index
        );

        return articleData.sort((a, b) => {
            return a.position - b.position;
        });
    },
    isArticleEmpty: (state, getters) => index => {
        return getters.getArticle(index).length === 0;
    },
    isComplete: state => {
        return (
            state.definitions.some(item => item.article === 0) &&
            state.definitions.some(item => item.article === 1) &&
            state.definitions.some(item => item.article === 2) &&
            state.definitions.some(item => item.article === 3) &&
            state.definitions.some(item => item.article === 4) &&
            state.definitions.some(item => item.article === 5) &&
            state.definitions.some(item => item.article === 6) &&
            state.definitions.some(item => item.article === 7) &&
            state.definitions.some(item => item.article === 8)
        );
    },
    getSetting: state => selectedId => {
        const setting = state.selection.find(item => {
            return item.settingId === selectedId;
        });
        return setting;
    }
};
