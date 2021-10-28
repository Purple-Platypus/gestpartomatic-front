<template>
    <v-dialog v-model="isVisible" max-width="600px" persistent>
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

            <v-card-text class="pa-4" :class="{ transparent: !isPrivate }">
                <p>
                    Vous pouvez définir les droits des autres utilisateurs sur
                    ce tableau :
                </p>

                <v-list class="pt-0">
                    <board-members-modal-item
                        v-for="user in privileges"
                        :key="user.id"
                        :user="user"
                    />
                </v-list>
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
import BoardMembersModalItem from './BoardMembersModalItem.vue';

export default {
    components: { BoardMembersModalItem },
    name: 'board-members-modal',
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
        privileges() {
            return this.users.map(user => {
                return {
                    id: user.id,
                    name: user.nickname || user.username,
                    avatar: user.avatar,
                    role: this.guests.hasOwnProperty(user.id)
                        ? this.guests[user.id].role
                        : 'NONE'
                };
            });
        },
        ...mapState('boards', ['board', 'guests']),
        ...mapState('users', ['users'])
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
