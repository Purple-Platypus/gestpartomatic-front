<template>
    <v-navigation-drawer app class="elevation-0" dark permanent width="130">
        <auth-menu v-if="auth.id"></auth-menu>

        <v-list dense nav>
            <v-list-item
                v-for="link in displayedLinks"
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
import AuthMixin from '../commons/mixins/Auth.mixin';
import AuthMenu from './AuthMenu.vue';

export default {
    name: 'mainMenu',
    components: { AuthMenu },
    mixins: [AuthMixin],
    data() {
        return {
            links: [
                { target: '/flux1', label: 'Flux 1', auth: false },
                { target: '/glun', label: 'GLUN', auth: false },
                { target: '/kanban', label: 'Kanbans', auth: true }
            ]
        };
    },
    computed: {
        displayedLinks() {
            return this.links.filter(link => {
                return !link.auth || this.auth.id;
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
