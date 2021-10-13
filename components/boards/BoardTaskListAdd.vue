<template>
    <v-col class="col--add-list">
        <v-sheet
            v-if="!isVisibleAddForm"
            class="py-8 text-center text-body-1 font-weight-bold grey--text cursor-pointer border-dashed"
            outlined
            rounded
            v-ripple
            @click="showAddForm"
        >
            <v-icon size="18px">
                mdi-plus
            </v-icon>
            Ajouter une colonne
        </v-sheet>
        <board-task-list-add-form
            v-else
            @cancel="hideAddForm"
            @add="hideAddForm"
        />
    </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BoardTaskListAddForm from './BoardTaskListAddForm.vue';

export default {
    components: { BoardTaskListAddForm },
    name: 'board-task-list-add',
    data() {
        return {
            isVisibleAddForm: false
        };
    },
    methods: {
        showAddForm() {
            this.isVisibleAddForm = true;
        },
        hideAddForm() {
            this.isVisibleAddForm = false;
        },
        submit() {}
    }
};
</script>

<style lang="scss" scoped>
.col--add-list {
    min-width: 300px !important;
    max-width: 300px !important;
}
</style>
