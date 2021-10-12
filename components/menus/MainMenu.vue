<template>
    <v-navigation-drawer app class="elevation-0" dark permanent width="180">
        <auth-menu v-if="auth.id"></auth-menu>

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
import AuthMixin from '../commons/mixins/Auth.mixin';
import AuthMenu from './AuthMenu.vue';

export default {
    name: 'mainMenu',
    components: { AuthMenu },
    mixins: [AuthMixin],
    data() {
        return {
            links: [
                { target: '/flux1', label: 'Flux 1' },
                { target: '/glun', label: 'GLUN' },
                { target: '/kanban', label: 'Kanbans' }
            ]
        };
    }
};
</script>

<style scoped>
.padded-avatar {
    padding-left: 6px !important;
}
</style>
