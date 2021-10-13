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
    name: 'board-list-form-add',
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
        submit(newBoard) {
            this.addBoard(newBoard).then(() => this.$emit('add'));
        },
        cancel() {
            this.$emit('cancel');
        },
        ...mapActions('boards', ['addBoard'])
    }
};
</script>
