<template>
    <v-row class="fill-height">
        <v-col class="pa-0" cols="3">
            <todo-list v-if="auth.id"></todo-list>
        </v-col>
    </v-row>
</template>

<script>
import AuthMixin from '../components/commons/mixins/Auth.mixin';
import TodoList from '../components/todos/TodoList.vue';
export default {
    components: { TodoList },
    mixins: [AuthMixin],
    head: () => ({
        title: 'Accueil'
    }),
    computed: {},
    mounted() {
        const shortkeys = [{ keys: '+', label: 'Ajouter une tâche' }];
        this.$store.commit('help/set', shortkeys);
    }
};
</script>
