<template>
    <v-list-group nav>
        <template v-slot:activator>
            <v-list-item-content>
                <v-list-item-title>Kanbans</v-list-item-title>
            </v-list-item-content>
        </template>

        <v-list-item
            v-for="board in boardsList"
            :key="board.id"
            :to="'/kanban/' + board.id"
        >
            <v-list-item-icon class="mr-0">
                <v-icon small v-if="board.isPrivate">
                    mdi-lock-outline
                </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title>
                    {{ board.name }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list-group>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Auth from '../commons/mixins/Auth.mixin';

export default {
    name: 'boardsMenu',
    mixins: [Auth],
    mounted() {
        this.getBoardsList();
    },
    computed: {
        ...mapState('boards', ['boardsList'])
    },
    methods: { ...mapActions('boards', ['getBoardsList']) }
};
</script>
