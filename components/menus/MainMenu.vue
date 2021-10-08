<template>
    <v-navigation-drawer app class="elevation-0" dark permanent width="180">
        <auth-menu v-if="user.id"></auth-menu>

        <v-list dense nav>
            <v-list-item
                v-for="link in links"
                :key="link.label"
                :to="link.target"
            >
                <v-list-item-content>
                    <v-list-item-title>
                        {{ link.label }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <boards-menu />
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import AuthMenu from './AuthMenu.vue';
import BoardsMenu from './BoardsMenu.vue';

export default {
    name: 'mainMenu',
    components: { AuthMenu, BoardsMenu },
    data() {
        return {
            links: [
                { target: '/flux1', label: 'Flux 1' },
                { target: '/glun', label: 'GLUN' }
            ]
        };
    },
    computed: {
        user: function() {
            return this.$store.state.auth;
        }
    },
    methods: {
        // Déconnexion
        async logout() {
            this.$store.dispatch('auth/logout').then(() => {
                this.$router.push('auth/login');
            });
        }
    }
};
</script>

<style scoped>
.padded-avatar {
    padding-left: 6px !important;
}
</style>
