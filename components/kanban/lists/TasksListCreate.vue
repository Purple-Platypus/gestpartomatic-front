<template>
    <v-col class="col--create-list">
        <v-sheet
            v-if="!isVisibleCreateForm"
            class="py-8 text-center text-body-1 font-weight-bold grey--text cursor-pointer border-dashed"
            outlined
            rounded
            v-ripple
            @click="showCreateForm"
        >
            <v-icon size="18px">
                mdi-plus
            </v-icon>
            Ajouter une colonne
        </v-sheet>
        <tasks-list-create-form
            v-else
            @cancel="hideCreateForm"
            @create="hideCreateForm"
        />
    </v-col>
</template>

<script>
import ShortkeysEmitterMixin from '../../commons/mixins/ShortkeysEmitter.mixin';
import TasksListCreateForm from './TasksListCreateForm.vue';

export default {
    components: { TasksListCreateForm },
    name: 'tasks-list-create',
    mixins: [ShortkeysEmitterMixin],
    data() {
        return {
            isVisibleCreateForm: false
        };
    },
    mounted() {
        const shortkeys = [{ keys: '+', label: 'Ajouter une colonne' }];
        this.$store.commit('help/set', shortkeys);
    },
    methods: {
        handleShortkey(e) {
            switch (e.key) {
                case '+':
                    this.showCreateForm();
                    break;
            }
        },
        showCreateForm() {
            this.isVisibleCreateForm = true;
        },
        hideCreateForm() {
            this.isVisibleCreateForm = false;
        },
        submit() {}
    }
};
</script>

<style lang="scss" scoped>
.col--create-list {
    min-width: 300px !important;
    max-width: 300px !important;
}
</style>
