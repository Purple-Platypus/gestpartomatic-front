<template>
    <v-app>
        <v-main>
            <v-container fill-height fluid class="align-start pt-5 px-6">
                <main-menu></main-menu>
                <nuxt />
            </v-container>
        </v-main>
        <v-footer v-if="shortkeys.length" app inset>
            <ul
                class="shortkeys-list blue-grey--text text--lighten-1 text-body-2 pl-0"
            >
                <li
                    v-for="shortkey of shortkeys"
                    :key="shortkey.keys"
                    class="mr-6"
                >
                    <kbd class="mr-1">{{ shortkey.keys }}</kbd>
                    {{ shortkey.label }}
                </li>
            </ul>
        </v-footer>
        <global-snackbar />
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import MainMenu from '../components/menus/MainMenu.vue';
import GlobalSnackbar from '../components/commons/GlobalSnackbar';

export default {
    components: { MainMenu, GlobalSnackbar },
    computed: {
        darkMode() {
            return this.$store.state.auth.settingDarkMode;
        },
        ...mapGetters('help', ['shortkeys'])
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
            this.$store.dispatch('auth/login', res);
        });
    }
};
</script>

<style scoped>
.shortkeys-list {
    list-style-type: none;
}
.shortkeys-list li {
    display: inline-block;
}
</style>
