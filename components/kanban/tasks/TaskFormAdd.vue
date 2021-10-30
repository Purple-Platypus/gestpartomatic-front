<template>
    <v-navigation-drawer
        fixed
        class="pa-3 elevation-0"
        right
        stateless
        temporary
        width="400px"
        v-model="isVisible"
    >
        <h2 class="mb-4 text-h4 font-weight-light">
            Nouvelle tâche
        </h2>

        <v-form dense @submit.prevent="add">
            <v-text-field
                autofocus
                class="mb-2"
                dense
                hide-details
                label="Titre"
                outlined
                v-model="formData.title"
            />

            <v-textarea
                class="mb-2 description-textarea"
                dense
                hint="Vous pouvez rédiger la description en mardown"
                label="Description"
                outlined
                rows="4"
                v-model="formData.description"
            />

            <task-assignees-list v-model="formData.assignees" />

            <task-tags-list v-model="formData.tags" />

            <v-divider />

            <v-row class="pt-4">
                <v-col class="text-center">
                    <v-btn
                        color="primary"
                        depressed
                        :disabled="!formData.title"
                        type="submit"
                    >
                        Ajouter
                    </v-btn>

                    <v-btn color="error" text @click="close">
                        Annuler
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TaskAssigneesList from './assignees/TaskAssigneesList.vue';
import TaskTagsList from './tags/TaskTagsList.vue';

export default {
    name: 'task-form-add',
    components: { TaskAssigneesList, TaskTagsList },
    props: {
        listId: Number,
        isVisible: Boolean
    },
    data() {
        return {
            formData: {
                title: '',
                description: '',
                tags: [],
                assignees: []
            },
            isTagManagerVisible: false
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
        ...mapState('boards', ['board', 'guests', 'lists'])
    },

    methods: {
        close() {
            this.$emit('close');
            this.formData = {
                title: '',
                description: '',
                tags: [],
                assignees: []
            };
        },
        add() {
            const task = Object.assign(this.formData, {
                listId: this.listId,
                rank: this.lists[this.listId].tasksList.length,
                progression: this.lists[this.listId].progression
            });

            this.$emit('createTask', {
                boardId: this.board.id,
                task
            });
            this.close();
        },
        showTagManager() {
            this.isTagManagerVisible = true;
        },
        hideTagManager() {
            this.isTagManagerVisible = false;
        },
        ...mapActions('boards', ['addTask'])
    }
};
</script>

<style>
.description-textarea {
    font-size: 0.875rem !important;
}
</style>
