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
        <global-snackbar />
    </v-app>
</template>

<script>
import GlobalSnackbar from '../components/commons/GlobalSnackbar';

export default {
    components: {
        GlobalSnackbar
    }
};
</script>

<style scoped>
.card-auth {
    min-height: 530px;
}
</style>
