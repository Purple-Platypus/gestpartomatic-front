<template>
    <v-container class="px-0 pb-1">
        <todo-list-form v-on="$listeners" ref="todoListForm" @submit="submit" />
    </v-container>
</template>

<script>
import messages from '~/assets/messages.json';
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
                deadline: todo.deadline,
                rank: this.$store.state.todos.todosList.length
            };

            await this.$axios
                .$post('/api/todos', createPayload)
                .then(res => {
                    this.$store.commit('todos/add', res);
                    this.$emit('close');
                })
                .catch(err => {
                    this.$store.commit('snackbar/setSnackbar', {
                        text: messages.errors.generic,
                        color: 'error'
                    });
                });
        }
    }
};
</script>
