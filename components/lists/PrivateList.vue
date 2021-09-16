<template>
    <v-card class="fill-height" outlined>
        <v-card-title class="text-body-2 font-weight-light text-uppercase">
            <span class="mr-8">
                Ma liste perso
            </span>

            {{ todosList.length }}

            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        x-small
                        @click="toggleShowArchive"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon v-if="showArchive">
                            mdi-checkbox-marked-outline
                        </v-icon>
                        <v-icon v-else>
                            mdi-checkbox-blank-outline
                        </v-icon>
                    </v-btn>
                </template>
                <span>Afficher les tâches terminées</span>
            </v-tooltip>
        </v-card-title>
        <v-card-text>
            <card-todo v-for="todo in todosList" :key="todo.id" :todo="todo">
            </card-todo>
        </v-card-text>
    </v-card>
</template>

<script>
import CardTodo from '../todos/CardTodo.vue';
import messages from '~/assets/messages.json';

export default {
    name: 'private-list',
    components: { CardTodo },
    props: [],
    data() {
        return {
            showArchive: false
        };
    },
    async fetch() {
        await this.$axios
            .$get('/api/todos')
            .then(res => {
                this.$store.dispatch('todos/initPrivate', res);
            })
            .catch(err => {
                this.$store.commit('snackbar/setSnackbar', {
                    text: messages.errors.generic,
                    color: 'error'
                });
            });
    },
    methods: {
        toggleShowArchive() {
            this.showArchive = !this.showArchive;
        }
    },
    computed: {
        todosList: function() {
            if (this.showArchive) {
                return this.$store.getters['todos/privateTodos'];
            } else {
                return this.$store.getters['todos/privateTodos'].filter(
                    todo => !todo.isArchived
                );
            }
        }
    },
    watch: {}
};
</script>
