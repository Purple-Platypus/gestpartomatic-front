<template>
    <v-row class="fill-height">
        {{ $auth.loggedIn }}
        <v-col v-if="$auth.loggedIn" class="pa-0" cols="3">
            <todo-list></todo-list>
        </v-col>
    </v-row>
</template>

<script>
import TodoList from '../components/todos/TodoList.vue';
export default {
    components: { TodoList },
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
