<template>
    <v-card class="mb-2" :loading="waitForArchive">
        <div class="d-flex flex-row">
            <div class="checkbox-div d-flex align-center justify-center pl-2">
                <v-checkbox v-model="todo.isArchived"></v-checkbox>
            </div>
            <div :class="{ 'text-decoration-line-through': todo.isArchived }">
                <v-card-title class="text-subtitle-1 pa-2">
                    {{ todo.title }}
                </v-card-title>
                <v-card-text>
                    {{ todo.description }}
                </v-card-text>
            </div>
        </div>
        <template slot="progress">
            <v-progress-linear
                color="error"
                v-model="timer"
                height="5"
            ></v-progress-linear>
        </template>
    </v-card>
</template>

<script>
import messages from '~/assets/messages.json';

export default {
    name: 'card-todo',
    components: {},
    props: ['todo'],
    data() {
        return {
            waitForArchive: false,
            timer: 50,
            delay: 3000
        };
    },
    methods: {
        showCountDown() {
            const interval = 100 / (this.delay / 50);
            this.timer = 0;

            const countdown = window.setInterval(() => {
                if (this.timer <= this.delay) {
                    this.timer += interval;
                }
            }, 50);

            window.setTimeout(() => {
                window.clearInterval(countdown);
                if (this.checked) {
                    this.toggleArchive();
                }
            }, this.delay);
        },
        async toggleArchive() {
            await this.$axios
                .$patch('/api/todos/' + this.todo.id, {
                    isArchived: !this.isArchived
                })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    this.$store.commit('snackbar/setSnackbar', {
                        text: messages.errors.generic,
                        color: 'error'
                    });
                });
        }
    },
    watch: {
        checked(value) {
            this.waitForArchive = value;
            if (value) {
                this.showCountDown();
            }
        }
    }
};
</script>

<style scoped>
.checkbox-div {
    border-right: 1px solid #e0e0e0;
}
.v-application--is-ltr .checkbox-div .v-input--selection-controls__input {
    margin-right: 0;
}
</style>
