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
                                @click="showActive()"
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
                                @click="showArchive()"
                            >
                                <v-icon
                                    :color="displayActive ? 'grey' : 'black'"
                                    size="18px"
                                >
                                    mdi-check
                                </v-icon>
                                {{ archivedBoards.length }}
                                archivé{{
                                    archivedBoards.length > 1 ? 's' : ''
                                }}
                            </span>

                            <v-spacer />
                            <v-btn color="primary" icon small>
                                <v-icon size="19px">
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </div>
                        <v-divider />
                        <v-list class="pa-0" dense>
                            <template v-for="(board, index) in displayedBoards">
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
                                <v-divider
                                    v-if="index + 1 != displayedBoards.length"
                                    :key="'divider_' + board.id"
                                />
                            </template>
                        </v-list>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    head: () => ({
        title: 'Kanbans'
    }),
    data: () => {
        return {
            displayActive: true
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
        archive(boardId) {
            this.archiveBoard(boardId);
        },
        ...mapActions('boards', ['getBoardsList', 'archiveBoard'])
    },
    mounted() {
        this.getBoardsList();
    }
};
</script>
