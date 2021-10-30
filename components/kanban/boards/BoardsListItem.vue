<template>
    <v-list-item>
        <v-list-item-icon class="mr-3 align-self-center">
            <v-icon color="grey lighten-1" size="18px">
                {{ board.isPrivate ? 'mdi-lock' : 'mdi-lock-open-outline' }}
            </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
            <nuxt-link :to="'kanban/' + board.id">
                <v-list-item-title class="black--text">
                    {{ board.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="font-weight-regular">
                    {{ board.description }}
                </v-list-item-subtitle>
            </nuxt-link>
        </v-list-item-content>

        <v-list-item-action v-if="isBoardAdmin" class="d-flex flex-row">
            <v-tooltip v-if="!board.isArchived" bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small @click="update" v-bind="attrs" v-on="on">
                        <v-icon size="18px">
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </template>
                <span>
                    Modifier
                </span>
            </v-tooltip>

            <v-tooltip v-if="!board.isArchived" bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        small
                        @click="archive(true)"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon size="18px">
                            mdi-archive
                        </v-icon>
                    </v-btn>
                </template>
                <span>
                    Archiver
                </span>
            </v-tooltip>

            <v-tooltip v-else bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        small
                        @click="archive(false)"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon size="18px">
                            mdi-restore
                        </v-icon>
                    </v-btn>
                </template>
                <span>
                    Restaurer
                </span>
            </v-tooltip>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import AuthMixin from '../../commons/mixins/Auth.mixin';

export default {
    name: 'boards-list-item',
    props: {
        boardId: Number
    },
    mixins: [AuthMixin],
    computed: {
        board() {
            return this.boards[this.boardId];
        },
        isBoardAdmin() {
            return this.board.guests[this.auth.id] === 'ADMIN';
        },
        ...mapState('boards', ['boards'])
    },
    methods: {
        archive(isArchived) {
            this.updateBoard({
                id: this.boardId,
                isArchived
            });
        },
        update() {
            this.$emit('update', this.boardId);
        },
        ...mapActions('boards', ['updateBoard', 'restoreBoard'])
    }
};
</script>

<style scoped>
.col-kanban {
    min-width: 400px !important;
    max-width: 400px !important;
}
</style>
