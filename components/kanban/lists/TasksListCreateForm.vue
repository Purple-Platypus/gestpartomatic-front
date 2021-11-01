<template>
    <v-sheet outlined rounded>
        <h2 class="py-2 px-3 text-body-2 font-weight-bold grey lighten-4">
            Ajouter une colonne
        </h2>

        <v-divider />

        <tasks-list-form
            ref="boardListForm"
            submit-label="Ajouter"
            @submit="submit"
            @cancel="cancel"
        />
    </v-sheet>
</template>

<script>
import { mapActions } from 'vuex';
import TasksListForm from '../lists/TasksListForm.vue';

export default {
    name: 'tasks-list-create-form',
    components: { TasksListForm },
    props: {
        listData: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    description: ''
                };
            }
        }
    },
    methods: {
        submit(newList) {
            this.createList(newList).then(() => this.$emit('create'));
        },
        cancel() {
            this.$emit('cancel');
        },
        ...mapActions('boards', ['createList'])
    }
};
</script>
