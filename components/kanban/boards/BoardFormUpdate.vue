<template>
    <board-form
        :boardData="boardData"
        submit-label="Modifier"
        @submit="submit"
        @cancel="cancel"
    />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BoardForm from './BoardForm.vue';

export default {
    name: 'board-form-update',
    components: { BoardForm },
    props: {
        boardId: {
            type: Number
        }
    },
    computed: {
        boardData() {
            return {
                name: this.boards[this.boardId].name,
                description: this.boards[this.boardId].description,
                isPrivate: this.boards[this.boardId].isPrivate
            };
        },
        ...mapState('boards', ['boards'])
    },
    methods: {
        submit(updatedBoard) {
            updatedBoard.id = this.boardId;
            this.updateBoard(updatedBoard).then(() => this.$emit('update'));
        },
        cancel() {
            this.$emit('cancel');
        },
        ...mapActions('boards', ['updateBoard'])
    }
};
</script>
