<template>
    <div>
        <v-menu
            :close-on-content-click="false"
            content-class="elevation-0"
            offset-y
        >
            <template v-slot:activator="{ on, attrs }">
                <v-container
                    class="pa-0 cursor-pointer"
                    v-bind="attrs"
                    v-on="on"
                >
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
                                    <v-img
                                        :src="guests[assigneeId].avatar"
                                    ></v-img>
                                </v-avatar>
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-container>
            </template>
            <v-sheet class="pa-2" outlined rounded>
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
                <!-- <v-list class="pa-0">
                    <v-list-item
                        v-for="guest in guestsList"
                        :key="guest.id"
                        :disabled="assignees.indexOf(guest.id) !== -1"
                        @click="add(guest.id)"
                    >
                        <v-list-item-avatar size="24">
                            <img :src="guest.avatar" />
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>
                                {{ guest.nickname || guest.username }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list> -->
            </v-sheet>
        </v-menu>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'task-assignees-list',
    components: {},
    props: {
        listId: Number,
        isVisible: Boolean,
        isHover: {
            type: Boolean,
            default: false
        },
        value: Array
    },
    data() {
        return {};
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
        // add(assigneeId) {
        //     this.assignees.push(assigneeId);
        // },
        // remove(assigneeId) {
        //     this.assignees.splice(this.assignees.indexOf(assigneeId), 1);
        // }
    },
    watch: {
        // assignees(list) {
        //     this.$emit('input', list);
        // }
    }
};
</script>
