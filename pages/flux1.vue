<template>
    <v-row justify="center" align="center">
        <v-col>
            <v-card elevation="0">
                <v-card-title>
                    <h1 class="text-h3 font-weight-light">
                        Fluxomatic
                    </h1>
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle-1 font-weight-light">
                        My flux 1 is like a rainbow
                    </span>
                </v-card-subtitle>

                <router-view></router-view>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    async fetch() {
        const definitions = await this.$axios
            .$get('/api/flux1')
            .then(res => res)
            .catch(err => {
                console.log(err);
            });
        this.$store.dispatch('flux1/setDefinitions', definitions);
    }
};
</script>

<style>
html {
    overflow: auto;
}
.overflow {
    word-break: keep-all !important;
    word-wrap: normal !important;
}
.propertySpan:last-child {
    margin-right: 1.5rem;
}
.propertySpan:hover {
    background-color: #ddd;
}
</style>
