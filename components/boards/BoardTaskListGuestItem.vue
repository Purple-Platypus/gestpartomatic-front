<template>
    <v-list-item>
        <v-list-item-avatar class="my-0">
            <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
            <v-list-item-title v-text="user.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon class="my-1">
            <v-btn-toggle
                dense
                mandatory
                v-model="user.role"
                @change="changeRole"
            >
                <v-btn :disabled="disableChange" value="NONE">
                    Pas d'accès
                </v-btn>
                <v-btn :disabled="disableChange" value="USER">
                    Lecture
                </v-btn>
                <v-btn :disabled="disableChange" value="ADMIN">
                    Ecriture
                </v-btn>
            </v-btn-toggle>
        </v-list-item-icon>
    </v-list-item>
</template>

<script>
import { mapState, mapMutations, mapActions, maGetters } from 'vuex';

export default {
    name: 'board-task-list-members-modal',
    props: {
        user: Object
    },
    data: function() {
        return {};
    },
    computed: {
        isGuest() {
            return this.guests.hasOwnProperty(this.user.id);
        },
        disableChange() {
            return !this.board.isPrivate || this.auth.id == this.user.id;
        },
        ...mapState('auth', ['auth']),
        ...mapState('boards', ['board', 'guests'])
    },
    methods: {
        changeRole(role) {
            if (!this.isGuest && role != 'NONE') {
                this.addGuest({
                    userId: this.user.id,
                    role
                });
            } else if (this.isGuest && role == 'NONE') {
                this.removeGuest(this.user.id);
            } else {
                this.updateGuestRole({
                    userId: this.user.id,
                    role
                });
            }
        },
        close() {
            this.$emit('close');
        },
        ...mapMutations('boards', ['updateBoard']),
        ...mapActions('boards', [
            'updateBoard',
            'addGuest',
            'removeGuest',
            'updateGuestRole'
        ])
    }
};
</script>
