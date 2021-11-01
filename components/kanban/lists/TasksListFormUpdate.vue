<template>
    <tasks-list-form
        :listData="listData"
        submit-label="Modifier"
        @submit="submit"
        @cancel="cancel"
    />
</template>

<script>
import { mapActions } from 'vuex';
import TasksListForm from './TasksListForm.vue';

export default {
    name: 'tasks-list-form-update',
    components: { TasksListForm },
    props: {
        listData: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    progression: ''
                };
            }
        }
    },
    methods: {
        submit(updatedList) {
            this.updateList({
                listId: this.listData.id,
                listData: updatedList
            }).then(() => this.$emit('update'));
        },
        cancel() {
            this.$emit('cancel');
        },
        ...mapActions('boards', ['updateList'])
    }
};
</script>
