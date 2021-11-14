<template>
    <v-navigation-drawer app class="elevation-0" dark permanent width="150">
        <auth-menu v-if="$auth.loggedIn"></auth-menu>

        <v-list class="px-0" dense tile>
            <v-list-item
                v-for="link in displayedLinks"
                :key="link.label"
                :to="link.target"
                exact-path
            >
                <v-list-item-content>
                    <v-list-item-title>
                        {{ link.label }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <template v-if="$auth.loggedIn">
                <v-divider />

                <v-list-item to="/kanban" exact-path>
                    <v-list-item-content>
                        <v-list-item-title>
                            Projets
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item
                    v-for="boardId in activeBoards"
                    :key="boardId"
                    class="pl-6 list-item-compact"
                    :to="'/kanban/' + boardId"
                    exact-path
                >
                    <v-list-item-content class="py-0">
                        <v-list-item-title>
                            {{ boards[boardId].name }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import AuthMenu from './AuthMenu.vue';

export default {
    name: 'mainMenu',
    components: { AuthMenu },
    fetch() {
        if (this.$auth.loggedIn) {
            this.getBoardsList();
        }
    },
    data() {
        return {
            links: [
                { target: '/flux1', label: 'Flux 1', auth: false },
                { target: '/glun', label: 'GLUN', auth: false }
            ]
        };
    },
    computed: {
        displayedLinks() {
            return this.links.filter(link => {
                return !link.auth || this.auth.id;
            });
        },
        ...mapState('boards', ['boards']),
        ...mapGetters('boards', ['activeBoards'])
    },
    methods: {
        ...mapActions('boards', ['getBoardsList'])
    }
};
</script>

<style scoped>
.padded-avatar {
    padding-left: 6px !important;
}
.list-item-compact {
    min-height: 28px !important;
}
</style>
