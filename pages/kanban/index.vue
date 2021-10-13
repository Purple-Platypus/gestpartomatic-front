<template>
    <v-row class="align-self-stretch">
        <v-col cols="4">
            <v-card flat outlined>
                <v-card-title class="pa-2">
                    <h1 class="mb-4 text-h3 font-weight-light">
                        Tableaux
                    </h1>
                </v-card-title>

                <v-card-text class="px-2">
                    <v-sheet outlined rounded>
                        <div
                            class="d-flex align-center grey lighten-3 px-4 py-2 text-body-2"
                        >
                            <span
                                class="cursor-pointer"
                                :class="{
                                    'font-weight-bold': displayActive,
                                    'grey--text': !displayActive
                                }"
                                @click="showActive"
                            >
                                {{ activeBoards.length }}
                                tableau{{ activeBoards.length > 1 ? 'x' : '' }}
                            </span>
                            <span
                                v-if="archivedBoards.length"
                                class="ml-8 cursor-pointer"
                                :class="{
                                    'font-weight-bold': !displayActive,
                                    'grey--text': displayActive
                                }"
                                @click="showArchive"
                            >
                                <v-icon
                                    :color="displayActive ? 'grey' : 'black'"
                                    size="18px"
                                    left
                                >
                                    mdi-archive
                                </v-icon>
                                {{ archivedBoards.length }}
                                archivé{{
                                    archivedBoards.length > 1 ? 's' : ''
                                }}
                            </span>

                            <v-spacer />
                            <v-btn color="primary" icon small @click="showForm">
                                <v-icon size="19px">
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </div>

                        <v-divider />

                        <board-list-form
                            v-if="isCreateFormVisible"
                            @cancel="hideForm"
                            @submit="create"
                        />

                        <v-list class="pa-0" dense>
                            <template v-for="(board, index) in displayedBoards">
                                <board-list-item
                                    :boardId="board.id"
                                    :key="board.id"
                                />
                                <v-divider
                                    v-if="index + 1 != displayedBoards.length"
                                    :key="'divider_' + board.id"
                                />
                            </template>

                            <div
                                v-if="isEmptyMessageVisible"
                                class="pt-4 px-4 text-center"
                            >
                                <p class="text-h6">
                                    Vous n'avez aucun tableau actif.
                                </p>
                                <p class="grey--text">
                                    Vous pouvez en
                                    <a @click="showForm">créer un</a
                                    ><span v-if="archivedBoards.length">
                                        ou restaurer un
                                        <a @click="showArchive"
                                            >tableau archivé</a
                                        >
                                        tableau archivé </span
                                    >.
                                </p>
                            </div>
                        </v-list>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import BoardListForm from '../../components/boards/BoardListForm.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import BoardListItem from '../../components/boards/BoardListItem.vue';

export default {
    head: () => ({
        title: 'Kanbans'
    }),
    components: { BoardListItem, BoardListForm },
    data: () => {
        return {
            displayActive: true,
            isCreateFormVisible: false
        };
    },
    computed: {
        displayedBoards() {
            if (this.displayActive) {
                return this.activeBoards;
            } else {
                return this.archivedBoards;
            }
        },
        isEmptyMessageVisible() {
            return (
                !this.activeBoards.length &&
                this.displayActive &&
                !this.isCreateFormVisible
            );
        },
        ...mapGetters('boards', ['activeBoards', 'archivedBoards']),
        ...mapState('auth', ['id'])
    },
    methods: {
        showActive() {
            this.displayActive = true;
        },
        showArchive() {
            this.displayActive = false;
        },
        showForm() {
            this.isCreateFormVisible = true;
        },
        hideForm() {
            this.isCreateFormVisible = false;
        },
        create(board) {
            this.createBoard(board).then(() => this.hideForm());
        },
        ...mapActions('boards', ['getBoardsList', 'createBoard'])
    },
    mounted() {
        this.getBoardsList();
    },
    watch: {
        archivedBoards() {
            if (!this.archivedBoards.length) {
                this.displayActive = true;
            }
        }
    }
};
</script>
