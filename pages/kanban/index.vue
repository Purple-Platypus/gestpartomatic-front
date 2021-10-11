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
                        <h2
                            class="d-flex px-4 py-2 grey lighten-3 text-body-1 font-weight-bold"
                        >
                            {{ boardsList.length }}
                            tableau{{ boardsList.length > 1 ? 'x' : '' }}

                            <v-spacer />
                            <v-btn color="primary" icon small>
                                <v-icon size="19px">
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </h2>
                        <v-divider />
                        <v-list class="pa-0" dense>
                            <template v-for="(board, index) in boardsList">
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

                                    <v-btn icon small>
                                        <v-icon size="19px">
                                            mdi-delete
                                        </v-icon>
                                    </v-btn>
                                </v-list-item>
                                <v-divider
                                    v-if="index + 1 != boardsList.length"
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
import { mapActions, mapState } from 'vuex';

export default {
    head: () => ({
        title: 'Kanbans'
    }),
    computed: {
        ...mapState('boards', ['boardsList'])
    },
    methods: {
        ...mapActions('boards', ['getBoardsList'])
    },
    mounted() {
        this.getBoardsList();
    }
};
</script>
