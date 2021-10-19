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
                <v-form @submit.prevent>
                    <p>
                        Les personnes suivantes pourront consulter et modifier
                        ce tableau.
                    </p>
                    <v-autocomplete
                        chips
                        deletable-chips
                        dense
                        :disabled="!isPrivate"
                        hide-selected
                        item-text="name"
                        item-value="id"
                        :items="usersList"
                        multiple
                        outlined
                        v-model="guestsList"
                    >
                        <template v-slot:no-data>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        Mmmmh... Il ne reste plus personne.
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>

                        <template v-slot:selection="data">
                            <v-chip
                                label
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click:close="removeGuest(data.item)"
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
import { mapState, mapMutations, mapActions } from 'vuex';

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
        guestsList: {
            get: function() {
                return this.board.guests;
            },
            set: function(guestsIds) {
                const guestId = guestsIds[guestsIds.length - 1];
                this.addGuest(guestId);
            }
        },
        usersList() {
            return this.users
                .map(user => {
                    return {
                        id: user.id,
                        name: user.nickname || user.username,
                        avatar: user.avatar
                    };
                })
                .filter(user => {
                    return user.id !== this.auth.id;
                });
        },
        ...mapState('boards', ['board']),
        ...mapState('users', ['users']),
        ...mapState('auth', ['auth'])
    },
    methods: {
        close() {
            this.$emit('close');
        },
        ...mapMutations('boards', ['updateBoard']),
        ...mapActions('boards', ['updateBoard', 'addGuest', 'removeGuest'])
    }
};
</script>
