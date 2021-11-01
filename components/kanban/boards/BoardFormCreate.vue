<template>
    <board-form submit-label="Ajouter" @submit="submit" @cancel="cancel" />
</template>

<script>
import { mapActions } from 'vuex';
import BoardForm from './BoardForm.vue';

export default {
    name: 'board-form-create',
    components: { BoardForm },
    methods: {
        submit(newBoard) {
            this.createBoard(newBoard).then(() => this.$emit('create'));
        },
        cancel() {
            this.$emit('cancel');
        },
        ...mapActions('boards', ['createBoard'])
    }
};
</script>
