<template>
    <div>
        <v-container class="pa-0 cursor-pointer" @click="showUsersList">
            <v-card-subtitle
                class="py-1 d-flex flex-row flex-nowrap align-start justify-space-between"
            >
                <h3 class="text-overline">
                    responsables
                </h3>

                <v-btn v-if="isHover" icon small>
                    <v-icon size="20">
                        mdi-pencil-outline
                    </v-icon>
                </v-btn>
            </v-card-subtitle>

            <v-card-text
                v-if="!taskAssignees.length"
                class="pt-0 grey--text font-italic"
            >
                <slot></slot>
            </v-card-text>

            <v-card-text v-else>
                <v-chip-group column>
                    <v-chip
                        v-for="assigneeId in taskAssignees"
                        :key="assigneeId"
                        outlined
                    >
                        {{
                            guests[assigneeId].nickname ||
                                guests[assigneeId].username
                        }}
                        <v-avatar right>
                            <v-img :src="guests[assigneeId].avatar"></v-img>
                        </v-avatar>
                    </v-chip>
                </v-chip-group>
            </v-card-text>
        </v-container>

        <v-expand-transition>
            <div v-if="isVisibleUsersList">
                <v-card-title class="d-flex py-0">
                    <h4
                        class="flex-grow-1 text-caption font-weight-bold font-italic"
                    >
                        Choisissez des responsables
                    </h4>

                    <v-btn
                        class="flex-grow-0"
                        icon
                        small
                        @click="hideUsersList"
                    >
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="py-0" v-click-outside="hideUsersList">
                    <v-chip-group column multiple v-model="taskAssignees">
                        <v-chip
                            v-for="user in users"
                            :key="user.id"
                            filter
                            outlined
                            :value="user.id"
                        >
                            {{ user.nickname || user.username }}
                            <v-avatar right>
                                <v-img :src="user.avatar"></v-img>
                            </v-avatar>
                        </v-chip>
                    </v-chip-group>
                </v-card-text>
            </div>
        </v-expand-transition>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'task-assignees-list',
    components: {},
    props: {
        listId: Number,
        isHover: {
            type: Boolean,
            default: false
        },
        value: Array
    },
    data() {
        return {
            isVisibleUsersList: false
        };
    },
    computed: {
        taskAssignees: {
            get() {
                return this.value;
            },
            set(assigneesList) {
                this.$emit('input', assigneesList);
            }
        },
        guestsList() {
            const guestsList = [];
            for (const guestId in this.guests) {
                guestsList.push(this.guests[guestId]);
            }
            return guestsList;
        },
        ...mapState('users', ['users']),
        ...mapState('boards', ['guests'])
    },
    methods: {
        showUsersList() {
            this.isVisibleUsersList = true;
        },
        hideUsersList() {
            this.isVisibleUsersList = false;
        }
    }
};
</script>
