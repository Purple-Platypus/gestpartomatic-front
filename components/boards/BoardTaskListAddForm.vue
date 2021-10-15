<template>
    <v-sheet outlined rounded>
        <h2 class="py-2 px-3 text-body-2 font-weight-bold grey lighten-4">
            Ajouter une colonne
        </h2>

        <v-divider />

        <board-task-list-form
            ref="boardListForm"
            @submit="submit"
            @cancel="cancel"
        />
    </v-sheet>
</template>

<script>
import { mapActions } from 'vuex';
import BoardTaskListForm from './BoardTaskListForm.vue';

export default {
    name: 'board-list-form-add',
    components: { BoardTaskListForm },
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
            this.addList(newList).then(() => this.$emit('add'));
        },
        cancel() {
            this.$emit('cancel');
        },
        ...mapActions('boards', ['addList'])
    }
};
</script>
