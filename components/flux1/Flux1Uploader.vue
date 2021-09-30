<template>
    <file-reader
        @change="handleUpload"
        :color="color"
        :depressed="depressed"
        :outlined="outlined"
        :small="small"
    >
        <slot></slot>
    </file-reader>
</template>

<script>
import { mapGetters } from 'vuex';
import FileReader from '../commons/FileReader.vue';

export default {
    components: { FileReader },
    props: {
        color: String,
        depressed: Boolean,
        outlined: Boolean,
        small: Boolean
    },
    computed: {
        ...mapGetters('flux1', ['getArticle'])
    },
    methods: {
        handleUpload(fileContent) {
            this.parseFlux1(fileContent);
        },
        splitDeclarations(flux1) {
            const articlesCount = 8;
            const lines = flux1.split('\n');

            let declarations = [];
            let currentDeclaration = [];

            lines.forEach((line, index) => {
                currentDeclaration.push(line);
                if (index % articlesCount == 7) {
                    declarations.push(currentDeclaration);
                    currentDeclaration = [];
                }
            });

            return declarations;
        },
        parseFlux1(flux1) {
            let declarations = this.splitDeclarations(flux1);
            declarations = declarations.map((declaration, index) => {
                return {
                    index: index + 1,
                    articles: this.splitProperties(declaration)
                };
            });

            this.$emit('input', declarations);
        },
        splitProperties(declaration) {
            const splittedDeclaration = [];

            declaration.forEach((article, indexArticle) => {
                const currentArticle = indexArticle + 1;
                const articleDefinitions = this.getArticle(0).concat(
                    this.getArticle(currentArticle)
                );
                const splittedArticle = [];

                articleDefinitions.forEach(definition => {
                    const startPosition = definition.position - 1;
                    const endPosition = startPosition + definition.length;

                    splittedArticle.push({
                        id: definition.id,
                        value: article.substring(startPosition, endPosition),
                        label: definition.label
                    });
                });
                splittedDeclaration.push(splittedArticle);
            });
            return splittedDeclaration;
        }
    }
};
</script>
