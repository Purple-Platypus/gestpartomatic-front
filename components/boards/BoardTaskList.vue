<template>
    <v-col class="col-kanban pb-0">
        <v-sheet class="fill-height" outlined rounded>
            <v-card class="fill-height grey lighten-5" flat>
                <v-card-title
                    v-if="!isUpdateFormVisible"
                    class="task-list-title py-1 px-2 text-body-2 font-weight-light text-uppercase"
                    :class="{ 'cursor-drag': isAdmin }"
                >
                    <h2 class="mr-8 text-body-2 font-weight-light">
                        {{ list.name }}
                        <span class="ml-4 grey--text text--darken-1">
                            {{ list.tasksList.length }}
                        </span>
                    </h2>

                    <v-spacer />

                    <v-btn icon small @click="showAddTaskForm">
                        <v-icon size="18">
                            mdi-plus
                        </v-icon>
                    </v-btn>

                    <v-menu v-if="isAdmin" offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-bind="attrs" v-on="on">
                                <v-icon>
                                    mdi-dots-horizontal
                                </v-icon>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="showUpdateForm">
                                <v-list-item-title>
                                    Modifier
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="showRemoveModal">
                                <v-list-item-title>
                                    Supprimer
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-card-title>

                <board-task-list-update-form
                    v-else
                    :list-data="list"
                    v-click-outside="hideUpdateForm"
                    @update="hideUpdateForm"
                    @cancel="hideUpdateForm"
                />

                <v-card-text class="px-2 pb-2">
                    <board-task-list-card
                        v-for="taskId in list.tasksList"
                        :key="taskId"
                        :task-id="taskId"
                        class="mb-1"
                        @show="showTaskDetail(taskId)"
                    >
                        {{ taskId }}
                    </board-task-list-card>
                </v-card-text>
            </v-card>
        </v-sheet>

        <v-dialog v-model="isRemoveDialogVisible" max-width="400px">
            <v-card>
                <v-card-title class="text-h5 font-weight-light">
                    Supprimer une colonne
                </v-card-title>

                <v-card-text>
                    Vous allez supprimer la colonne
                    <strong>{{ list.name }}</strong> et toutes les tâches qui
                    s'y trouvent.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="error" text @click="remove">
                        Supprimer
                    </v-btn>

                    <v-btn text @click="hideRemoveModal">
                        Annuler
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-col>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import BoardTaskListCard from './BoardTaskListCard.vue';
import BoardTaskListUpdateForm from './BoardTaskListUpdateForm.vue';

export default {
    name: 'board-task-list',
    components: {
        draggable,
        BoardTaskListCard,
        BoardTaskListUpdateForm
    },
    props: {
        listId: Number
    },
    data() {
        return {
            isUpdateFormVisible: false,
            isRemoveDialogVisible: false
        };
    },
    computed: {
        list() {
            return this.lists[this.listId];
        },
        ...mapState('boards', ['lists']),
        ...mapGetters('boards', ['isAdmin'])
    },
    methods: {
        showAddTaskForm() {
            this.$emit('showAddTaskForm', { listId: this.listId });
        },
        showUpdateForm() {
            this.isUpdateFormVisible = true;
        },
        hideUpdateForm() {
            this.isUpdateFormVisible = false;
        },
        showRemoveModal() {
            this.isRemoveDialogVisible = true;
        },
        hideRemoveModal() {
            this.isRemoveDialogVisible = false;
        },
        showTaskDetail(taskId) {
            this.$emit('showTask', taskId);
        },
        remove() {
            this.removeList(this.listId).then(() => {
                this.hideRemoveModal();
            });
        },
        ...mapActions('boards', ['removeList'])
    }
};
</script>

<style scoped>
.col-kanban {
    min-width: 380px !important;
    max-width: 380px !important;
}
</style>
