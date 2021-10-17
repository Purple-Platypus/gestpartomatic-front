<template>
    <v-dialog v-model="isVisible" max-width="800px" persistent>
        <v-card>
            <v-card-title class="text-h5 font-weight-light">
                Visibilité du tableau
            </v-card-title>

            <v-card-text class="pb-0">
                <v-form>
                    <v-switch
                        class="mt-0 mb-2 bordered-switch"
                        dense
                        flat
                        hide-details
                        label="Tableau privé"
                        v-model="isPrivate"
                    />
                    <p v-if="isPrivate">
                        Ce tableau n'est visible que par vous et les personnes
                        que vous choisissez.
                    </p>
                    <p v-else>
                        Ce tableau est visible par tout le monde.
                    </p>
                </v-form>
            </v-card-text>

            <v-divider />

            <v-card-text class="pa-4">
                <v-form :disabled="!isPrivate" @submit.prevent>
                    <p>
                        Les personnes suivantes pourront consulter et modifier
                        ce tableau.
                    </p>
                    <v-autocomplete
                        deletable-chips
                        dense
                        hide-selected
                        item-text="name"
                        item-value="id"
                        multiple
                        outlined
                        chips
                        :items="usersList"
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click="data.select"
                                @click:close="remove(data.item)"
                            >
                                <v-avatar left>
                                    <v-img :src="data.item.avatar"></v-img>
                                </v-avatar>
                                {{ data.item.name }}
                            </v-chip>
                        </template>
                        <template v-slot:item="data">
                            <v-list-item-avatar>
                                <img :src="data.item.avatar" />
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title
                                    v-html="data.item.name"
                                ></v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-autocomplete>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click="close">
                    Fermer
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'board-task-list-members-modal',
    props: ['isVisible'],
    data: function() {
        return {};
    },
    computed: {
        isPrivate: {
            get() {
                return this.board.isPrivate;
            },
            set(val) {
                this.updateBoard({
                    boardId: this.board.id,
                    boardData: {
                        isPrivate: val
                    }
                });
            }
        },
        usersList() {
            return this.users.map(user => {
                return {
                    id: user.id,
                    name: user.nickname || user.username,
                    avatar: user.avatar
                };
            });
        },
        ...mapState('boards', ['board']),
        ...mapState('users', ['users'])
    },
    methods: {
        close() {
            this.$emit('close');
        },
        ...mapActions('boards', ['updateBoard'])
    }
};
</script>
