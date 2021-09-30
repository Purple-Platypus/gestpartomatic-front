<template>
    <v-card-text class="overflow">
        <div v-for="declaration in filteredflux1" :key="declaration.index">
            <h2 class="text-h4 font-weight-light mt-4 black--text">
                Déclaration {{ declaration.index }}
            </h2>
            <div
                class="text--monospace"
                v-for="(article, articleIndex) in declaration.articles"
                :key="articleIndex"
            >
                <span
                    class="propertySpan"
                    :class="getStyle(property.id)"
                    :title="property.label"
                    v-for="(property, propertyIndex) in article"
                    :key="propertyIndex"
                    >{{ property.value }}</span
                >
            </div>
        </div>
        <p v-if="flux1.length && !filteredflux1.length">
            Aucune déclaration ne correspond aux critères saisis :(
        </p>
    </v-card-text>
</template>

<script>
export default {
    components: {},
    props: {
        flux1: Array,
        padding: Boolean
    },
    computed: {
        highlight() {
            const highlightList = {};
            this.selection.forEach(prop => {
                highlightList[prop.propertyId] = prop.style;
            });
            return highlightList;
        },
        filteredflux1() {
            return this.filterflux1();
        },
        selection() {
            return this.$store.state.flux1.selection;
        }
    },
    methods: {
        getStyle(propertyId) {
            const padStyle = this.padding ? ' mr-2' : '';
            return this.highlight[propertyId] + padStyle;
        },
        getFilters() {
            let filters = this.selection.filter(setting => {
                return setting.filter && setting.propertyId;
            });
            return filters;
        },
        filterflux1() {
            return this.flux1.filter(declaration => {
                return this.checkDeclarationMatch(declaration.articles);
            });
        },
        checkDeclarationMatch(declaration) {
            const filters = this.getFilters();
            let match = true;

            filters.forEach(filter => {
                if (!filter.filter) {
                    return;
                }
                const indexArticle =
                    filter.article == 0 ? 0 : filter.article - 1;
                const checkedArticle = declaration[indexArticle];
                const matchingArticle = this.checkArticleMatch(
                    checkedArticle,
                    filter
                );

                if (!matchingArticle) {
                    match = false;
                }
            });

            return match;
        },
        checkArticleMatch(article, filter) {
            let match = true;
            const matchingProp = article.find(prop => {
                const searchPattern = new RegExp(filter.filter.toLowerCase());
                return (
                    prop.id == filter.propertyId &&
                    searchPattern.test(prop.value.toLowerCase()) !=
                        filter.invert
                );
            });

            if (!matchingProp) {
                match = false;
            }

            return match;
        }
    }
};
</script>
