<template>
    <v-container class="px-0 pb-1">
        <todo-list-form
            v-on="$listeners"
            ref="todoListForm"
            @submit="submit"
            @close="close"
        />
    </v-container>
</template>

<script>
import TodoListForm from './TodoListForm.vue';

export default {
    name: 'todo-list-form-create',
    components: { TodoListForm },
    data() {
        return {};
    },
    methods: {
        async submit(todo) {
            // Découpage de la description en 2 données pour l'API
            const splittedDescription = todo.description.split('\n');
            const sentTitle = splittedDescription.shift();
            const sentDescription = splittedDescription.join('\n');

            const createPayload = {
                title: sentTitle,
                description: sentDescription,
                isPrivate: true,
                deadline: todo.deadline,
                rank: this.$store.state.todos.todoList.length
            };

            this.$store.dispatch('todos/create', createPayload).then(() => {
                this.$emit('close');
            });
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>
