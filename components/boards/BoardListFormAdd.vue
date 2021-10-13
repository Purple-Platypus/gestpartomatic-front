<template>
    <board-list-form ref="boardListForm" @submit="submit" @cancel="cancel" />
</template>

<script>
import { mapActions } from 'vuex';
import BoardListForm from './BoardListForm.vue';

export default {
    name: 'board-list-form-add',
    components: { BoardListForm },
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
