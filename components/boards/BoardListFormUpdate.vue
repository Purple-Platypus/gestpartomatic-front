<template>
    <board-list-form
        ref="boardListForm"
        :boardData="boardData"
        @submit="submit"
        @cancel="cancel"
    />
</template>

<script>
import { mapActions } from 'vuex';
import BoardListForm from './BoardListForm.vue';

export default {
    name: 'board-list-form-update',
    components: { BoardListForm },
    props: {
        boardData: {
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
        submit(updatedBoard) {
            this.updateBoard({
                boardId: this.boardData.id,
                boardData: updatedBoard
            }).then(() => this.$emit('update'));
        },
        cancel() {
            this.$emit('cancel');
        },
        ...mapActions('boards', ['updateBoard'])
    }
};
</script>
