<template>
    <v-list-item :key="board.id">
        <v-list-item-content>
            <v-list-item-title>
                {{ board.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
                {{ board.description }}
            </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn icon small>
            <v-icon size="19px">
                mdi-pencil
            </v-icon>
        </v-btn>

        <v-btn
            v-if="!board.isArchived"
            :disabled="board.creatorId != id"
            icon
            small
            @click="archive(board.id)"
        >
            <v-icon size="19px">
                mdi-delete
            </v-icon>
        </v-btn>

        <v-btn
            v-else
            :disabled="board.creatorId != id"
            icon
            small
            @click="restore(board.id)"
        >
            <v-icon size="19px">
                mdi-delete-off
            </v-icon>
        </v-btn>
    </v-list-item>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'board-list-item',
    props: {
        boardId: Number
    },
    data() {
        return {};
    },
    computed: {
        board() {
            return this.boardById(this.boardId);
        },
        ...mapGetters('boards', ['boardById']),
        ...mapState('auth', ['id'])
    }
};
</script>

<style scoped>
.col-kanban {
    min-width: 400px !important;
    max-width: 400px !important;
}
</style>
