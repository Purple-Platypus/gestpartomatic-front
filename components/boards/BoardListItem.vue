<template>
    <v-list-item :key="board.id">
        <v-list-item-content>
            <v-list-item-title>
                {{ board.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-regular">
                {{ board.description }}
            </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn icon small v-if="!board.isArchived">
            <v-icon size="19px">
                mdi-pencil
            </v-icon>
        </v-btn>

        <v-btn
            v-if="!board.isArchived"
            :disabled="board.creatorId != auth.id"
            icon
            small
            @click="archive()"
        >
            <v-icon size="19px">
                mdi-archive
            </v-icon>
        </v-btn>

        <v-btn
            v-else
            :disabled="board.creatorId != auth.id"
            icon
            small
            @click="restore()"
        >
            <v-icon size="19px">
                mdi-restore
            </v-icon>
        </v-btn>
    </v-list-item>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import AuthMixin from '../commons/mixins/Auth.mixin';

export default {
    name: 'board-list-item',
    props: {
        boardId: Number
    },
    mixins: [AuthMixin],
    data() {
        return {};
    },
    computed: {
        board() {
            return this.boardById(this.boardId);
        },
        ...mapGetters('boards', ['boardById']),
        ...mapState('auth', ['id'])
    },
    methods: {
        archive() {
            this.archiveBoard(this.boardId);
        },
        restore() {
            this.restoreBoard(this.boardId);
        },
        ...mapActions('boards', ['archiveBoard', 'restoreBoard'])
    }
};
</script>

<style scoped>
.col-kanban {
    min-width: 400px !important;
    max-width: 400px !important;
}
</style>
