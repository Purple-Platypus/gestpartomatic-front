<template>
    <board-task-list-form
        ref="boardTaskListForm"
        :listData="listData"
        @submit="submit"
        @cancel="cancel"
    />
</template>

<script>
import { mapActions } from 'vuex';
import BoardTaskListForm from './BoardTaskListForm.vue';

export default {
    name: 'board-list-form-update',
    components: { BoardTaskListForm },
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
