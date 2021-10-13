<template>
    <v-sheet outlined rounded>
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
