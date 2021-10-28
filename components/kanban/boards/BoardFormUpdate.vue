<template>
    <board-form
        :boardData="boardData"
        submit-label="Modifier"
        @submit="submit"
        @cancel="cancel"
    />
</template>

<script>
import { mapActions } from 'vuex';
import BoardForm from './BoardForm.vue';

export default {
    name: 'board-form-update',
    components: { BoardForm },
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
