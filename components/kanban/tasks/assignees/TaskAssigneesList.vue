<template>
    <div>
        <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on, attrs }">
                <v-container
                    class="pb-0 cursor-pointer"
                    v-bind="attrs"
                    v-on="on"
                >
                    <h3 class="text-body-2 font-weight-bold">
                        Responsables
                    </h3>

                    <p v-if="!assignees.length" class="text-caption grey--text">
                        <slot></slot>
                    </p>
                </v-container>
            </template>
            <v-list dense>
                <v-list-item
                    v-for="guest in guestsList"
                    :key="guest.id"
                    :disabled="assignees.indexOf(guest.id) !== -1"
                    @click="create(guest.id)"
                >
                    <v-list-item-avatar>
                        <img :src="guest.avatar" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>
                            {{ guest.nickname || guest.username }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-chip-group column>
            <v-chip
                v-for="assigneeId in assignees"
                :key="assigneeId"
                close
                small
                @click:close="remove(assigneeId)"
            >
                <v-avatar left>
                    <v-img :src="guests[assigneeId].avatar"></v-img>
                </v-avatar>
                {{ guests[assigneeId].nickname || guests[assigneeId].username }}
            </v-chip>
        </v-chip-group>
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
        value: Array
    },
    data() {
        return {
            assignees: this.value
        };
    },
    computed: {
        guestsList() {
            const guestsList = [];
            for (const guestId in this.guests) {
                guestsList.push(this.guests[guestId]);
            }
            return guestsList;
        },
        ...mapState('boards', ['guests'])
    },
    methods: {
        create(assigneeId) {
            this.assignees.push(assigneeId);
        },
        remove(assigneeId) {
            this.assignees.splice(this.assignees.indexOf(assigneeId), 1);
        }
    },
    watch: {
        assignees(list) {
            this.$emit('input', list);
        }
    }
};
</script>
