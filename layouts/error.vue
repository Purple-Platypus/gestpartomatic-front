<template>
    <v-app dark>
        <h1 v-if="error.statusCode === 404">
            {{ pageNotFound }}
        </h1>
        <h1 v-else>
            {{ otherError }}
        </h1>
        <NuxtLink to="/">
            Revenir à l'accueil
        </NuxtLink>
    </v-app>
</template>

<script>
export default {
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: 'Félicitations : vous êtes complètement perdu !',
            otherError: 'Allo Houston... On a un problème'
        };
    },
    head() {
        const title =
            this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
        return {
            title
        };
    }
};
</script>

<style scoped>
h1 {
    font-size: 20px;
}
</style>
