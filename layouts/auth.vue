<template>
    <v-app>
        <v-main class="d-flex align-center">
            <v-container>
                <v-row justify="center" align="center">
                    <v-col cols="12" sm="10" md="7" lg="5" xl="3">
                        <v-card outlined class="px-6 pt-4 card-auth">
                            <nuxt />
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <snackbar />
    </v-app>
</template>

<script>
import Snackbar from '../components/commons/Snackbar';

export default {
    components: {
        Snackbar
    },
    data() {
        return {};
    }
};
</script>

<style scoped>
.card-auth {
    min-height: 530px;
}
</style>
