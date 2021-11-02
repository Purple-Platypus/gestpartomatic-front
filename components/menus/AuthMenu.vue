<template>
    <v-list class="pa-0">
        <v-list-item class="padded-avatar px-0">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon to="/profile" v-bind="attrs" v-on="on">
                        <v-avatar tile size="48">
                            <v-img :src="auth.avatar" />
                        </v-avatar>
                    </v-btn>
                </template>
                <span>Modifier mon profil</span>
            </v-tooltip>

            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn to="/" icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-home-variant-outline</v-icon>
                    </v-btn>
                </template>
                <span>Accueil</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="logout" icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-power</v-icon>
                    </v-btn>
                </template>
                <span>Déconnexion</span>
            </v-tooltip>
        </v-list-item>
    </v-list>
</template>

<script>
import Auth from '../commons/mixins/Auth.mixin';

export default {
    name: 'authMenu',
    mixins: [Auth],
    methods: {
        async logout() {
            this.$store.dispatch('auth/logout').then(() => {
                this.$router.push('/auth/login');
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
