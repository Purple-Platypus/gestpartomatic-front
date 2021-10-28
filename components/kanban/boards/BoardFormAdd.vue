<template>
    <board-form submit-label="Ajouter" @submit="submit" @cancel="cancel" />
</template>

<script>
import { mapActions } from 'vuex';
import BoardForm from './BoardForm.vue';

export default {
    name: 'board-form-add',
    components: { BoardForm },
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
