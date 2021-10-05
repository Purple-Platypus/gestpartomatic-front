<template>
    <v-navigation-drawer app class="elevation-0" dark permanent width="180">
        <auth-menu v-if="user.id"></auth-menu>
        <!-- <v-list v-else dense>
            <v-list-item to="/auth/login">
                <v-list-item-icon>
                    <v-icon>
                        mdi-account-circle-outline
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>
                        Connexion
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider></v-divider> -->

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
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import AuthMenu from './AuthMenu.vue';
import messages from '~/assets/messages.json';

export default {
    name: 'mainMenu',
    components: { AuthMenu },
    data() {
        return {
            links: [
                { target: '/flux1', label: 'Flux 1' },
                { target: '/glun', label: 'GLUN' },
                { target: '/kanban', label: 'Kanban' }
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
            await this.$axios
                .$post('/api/auth/logout')
                .then(() => {
                    this.$store.dispatch('auth/logout');
                    this.$router.push('auth/login');
                })
                .catch(err => {
                    this.$store.commit('snackbar/setSnackbar', {
                        text: messages.errors.generic,
                        color: 'error'
                    });
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
