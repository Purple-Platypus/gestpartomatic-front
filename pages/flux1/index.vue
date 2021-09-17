<template>
    <div>
        <v-card-actions class="px-4">
            <flux-1-uploader @input="handleUpload" outlined small>
                Envoyer un Flux 1
            </flux-1-uploader>

            <v-btn
                class="ml-2"
                small
                depressed
                :outlined="!padding"
                @click="padding = !padding"
            >
                <v-icon>
                    mdi-arrow-expand-horizontal
                </v-icon>
            </v-btn>

            <nuxt-link class="ml-4" to="flux1/definitions">
                Descriptif du flux 1
                <v-icon color="primary" small>
                    mdi-chevron-right
                </v-icon>
            </nuxt-link>
        </v-card-actions>
        <v-card-text>
            <v-row>
                <v-col
                    class="flex-grow-0 pr-0 py-1 justify-end d-flex flex-column"
                >
                    <v-btn icon depressed @click="addSetting">
                        <v-icon>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-col>
                <v-col class="py-0 my-0">
                    <v-form>
                        <setting-selector
                            v-for="setting in selection"
                            :key="setting.settingId"
                            :settingId="setting.settingId"
                        ></setting-selector>
                    </v-form>
                </v-col>
            </v-row>
        </v-card-text>

        <flux1-display :flux1="flux1" :padding="padding"></flux1-display>
    </div>
</template>

<script>
import SettingSelector from '../../components/flux1/SettingSelector.vue';
import Flux1Uploader from '../../components/flux1/Flux1Uploader';
import Flux1Display from '../../components/flux1/Flux1Display.vue';

export default {
    components: { Flux1Uploader, SettingSelector, Flux1Display },
    data() {
        return {
            padding: false,
            articlesList: [
                { text: 'Partie commune', value: 0 },
                { text: 'Article 1', value: 1 },
                { text: 'Article 2', value: 2 },
                { text: 'Article 3', value: 3 },
                { text: 'Article 4', value: 4 },
                { text: 'Article 5', value: 5 },
                { text: 'Article 6', value: 6 },
                { text: 'Article 7', value: 7 },
                { text: 'Article 8', value: 8 }
            ],
            flux1: []
        };
    },
    methods: {
        handleUpload(flux1) {
            this.flux1 = flux1;
        },
        updateQueryString() {
            history.pushState(
                {},
                null,
                this.$route.path +
                    '?selection=' +
                    encodeURIComponent(JSON.stringify(this.selection))
            );
        },
        addSetting() {
            this.$store.commit('flux1/addSetting');
        },
        getFilters() {
            const filters = [];
            this.selection.forEach(selectedProp => {
                if (selectedProp.filter && selectedProp.settingId) {
                    filters.push({
                        articleIndex: !selectedProp.article
                            ? 0
                            : selectedProp.article - 1,
                        settingId: selectedProp.settingId,
                        value: selectedProp.filter,
                        invert: selectedProp.invert
                    });
                }
            });
            return filters;
        },
        checkDeclarationMatch(declaration) {
            const filters = this.getFilters();
            let match = true;

            filters.forEach(filter => {
                if (!filter.value) {
                    return;
                }
                const checkedArticle = declaration[filter.articleIndex];

                const matchingArticle = this.checkArticleMatch(checkedArticle, {
                    settingId: filter.settingId,
                    value: filter.value,
                    invert: filter.invert
                });

                if (!matchingArticle) {
                    match = false;
                }
            });

            return match;
        },
        checkArticleMatch(article, filter) {
            let match = true;
            const matchingProp = article.find(prop => {
                const searchPattern = new RegExp(filter.value.toLowerCase());

                return (
                    prop.id == filter.settingId &&
                    searchPattern.test(prop.value.toLowerCase()) !=
                        filter.invert
                );
            });

            if (!matchingProp) {
                match = false;
            }

            return match;
        },
        filterflux1() {
            return this.flux1.filter(declaration => {
                return this.checkDeclarationMatch(declaration.articles);
            });
        }
    },
    computed: {
        selection() {
            return this.$store.state.flux1.selection;
        }
    },
    mounted() {
        if (!this.selection.length) {
            this.addSetting();
        }
    }
};
</script>
