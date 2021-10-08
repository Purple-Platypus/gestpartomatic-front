<template>
    <v-list-group>
        <template v-slot:activator>
            <v-list-item-title>Kanbans</v-list-item-title>
        </template>

        <v-list-item
            v-for="board in list"
            class="pl-6"
            :key="board.id"
            :to="'/kanban/' + board.id"
        >
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
        this.get();
    },
    computed: {
        ...mapState('boards', ['list'])
    },
    methods: { ...mapActions('boards', ['get']) }
};
</script>
