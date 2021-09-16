<template>
    <v-app>
        <v-main>
            <v-container fill-height fluid class="align-start pl-4">
                <main-menu></main-menu>
                <nuxt />
            </v-container>
        </v-main>
        <snackbar />
    </v-app>
</template>

<script>
import MainMenuVue from '../components/menus/MainMenu.vue';
import Snackbar from '../components/commons/Snackbar';

export default {
    components: { 'main-menu': MainMenuVue, Snackbar },
    mounted() {
        this.$vuetify.theme.dark = this.$store.state.auth.settingDarkMode;
    },
    computed: {
        darkMode() {
            return this.$store.state.auth.settingDarkMode;
        }
    },
    watch: {
        darkMode(newValue) {
            this.$vuetify.theme.dark = newValue;
        }
    }
};
</script>
