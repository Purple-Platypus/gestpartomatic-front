<template>
    <v-btn color="error" icon @click="showRemoveDialog">
        <v-icon>
            mdi-delete
        </v-icon>

        <v-dialog v-model="isRemoveDialogVisible" max-width="400">
            <v-card>
                <v-card-title class="text-h5">
                    Suppression de tâche
                </v-card-title>

                <v-card-text>
                    <p>
                        Vous allez supprimer définitivement la tâche :
                        <strong>
                            {{ task.title }}
                        </strong>
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="error" depressed @click="remove">
                        Supprimer
                    </v-btn>

                    <v-btn text depressed @click="hideRemoveDialog">
                        Annuler
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'task-remove-btn',
    components: {},
    props: {
        taskId: Number
    },
    data() {
        return {
            isRemoveDialogVisible: false
        };
    },
    computed: {
        task() {
            return this.tasks[this.taskId];
        },
        ...mapState('boards', ['tasks'])
    },

    methods: {
        showRemoveDialog() {
            this.isRemoveDialogVisible = true;
        },
        hideRemoveDialog() {
            this.isRemoveDialogVisible = false;
        },
        remove() {
            this.$emit('remove', this.taskId);
            this.hideRemoveDialog();
        }
    }
};
</script>
