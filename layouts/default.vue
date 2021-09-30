<template>
    <v-app>
        <v-main>
            <v-container fill-height fluid class="align-start pl-4">
                <main-menu></main-menu>
                <nuxt />
            </v-container>
        </v-main>
        <global-snackbar />
    </v-app>
</template>

<script>
import MainMenu from '../components/menus/MainMenu.vue';
import GlobalSnackbar from '../components/commons/GlobalSnackbar';

export default {
    components: { MainMenu, GlobalSnackbar },
    computed: {
        darkMode() {
            return this.$store.state.auth.settingDarkMode;
        }
    },
    watch: {
        darkMode(newValue) {
            this.$vuetify.theme.dark = newValue;
        }
    },
    mounted() {
        this.$vuetify.theme.dark = this.$store.state.auth.settingDarkMode;
    },
    async fetch() {
        await this.$axios.$get('/api/users/me').then(res => {
            console.log('plop');
            this.$store.dispatch('auth/login', res);
        });
    }
};
</script>
