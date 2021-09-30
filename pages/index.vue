<template>
    <v-row class="fill-height">
        <v-col cols="3">
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
    computed: {}
};
</script>
