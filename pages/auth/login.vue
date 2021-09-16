<template>
    <ValidationObserver ref="loginForm" v-slot="{ invalid }">
        <v-card-text v-if="message">
            <v-alert icon="mdi-alert-circle-outline" outlined type="error">
                {{ message }}
            </v-alert>
        </v-card-text>

        <v-card-title class="headline justify-center mb-3">
            Connectez-vous
        </v-card-title>

        <v-form ref="form" @submit.prevent="login">
            <v-card-text>
                <ValidationProvider
                    vid="email"
                    v-slot="{ errors, passed, failed }"
                    name="Name"
                    :rules="rules.email"
                >
                    <v-text-field
                        class="required"
                        :error-messages="errors"
                        label="Adresse mail"
                        outlined
                        prepend-icon="mdi-email-outline"
                        v-model="input.email"
                    >
                        <template v-slot:append>
                            <v-icon color="success" v-if="passed">
                                mdi-check
                            </v-icon>
                            <v-icon color="error" v-if="failed">
                                mdi-close
                            </v-icon>
                        </template>
                    </v-text-field>
                </ValidationProvider>

                <ValidationProvider
                    :rules="rules.password"
                    v-slot="{ errors, passed, failed }"
                    vid="password"
                >
                    <v-text-field
                        class="required"
                        :error-messages="errors"
                        label="Mot de passe"
                        outlined
                        prepend-icon="mdi-lock-outline"
                        type="password"
                        v-model="input.password"
                    >
                        <template v-slot:append>
                            <v-icon color="success" v-if="passed">
                                mdi-check
                            </v-icon>
                            <v-icon color="error" v-if="failed">
                                mdi-close
                            </v-icon>
                        </template>
                    </v-text-field>
                </ValidationProvider>
            </v-card-text>

            <v-card-actions class="px-4">
                <v-btn color="primary" text to="/auth/sendResetEmail">
                    Mot de passe oublié ?
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    type="submit"
                    color="primary"
                    depressed
                    :disabled="invalid"
                    :loading="loading"
                >
                    Connexion
                </v-btn>
            </v-card-actions>

            <v-divider class="my-4"></v-divider>

            <v-card-actions class="justify-center">
                <v-btn color="primary" text to="/auth/signin">
                    Je ne suis pas encore inscrit
                </v-btn>
            </v-card-actions>
        </v-form>
    </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import messages from '~/assets/messages.json';

export default {
    layout: 'auth',
    transition: 'fade-transition',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    head: () => ({
        title: 'Connexion'
    }),
    data: () => ({
        valid: false,
        input: {
            email: '',
            password: ''
        },
        rules: {
            email: { required_email: true, email: true },
            password: { required_password: true, min_password: 3 }
        },

        loading: false
    }),
    methods: {
        async login() {
            this.loading = true;
            await this.$axios
                .$post('/api/auth/login/', this.input)
                .then(res => {
                    this.$store.dispatch('auth/login', res);
                    this.$router.push('/');
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        this.$refs.loginForm.setErrors({
                            password: [messages.errors.unauthorised]
                        });
                    } else {
                        this.$store.commit('snackbar/setSnackbar', {
                            text: messages.errors.generic,
                            color: 'error'
                        });
                    }
                });
            this.loading = false;
        }
    },
    computed: {
        message() {
            switch (this.$route.query.error) {
                case '401':
                    return 'Vous devez être connecté pour accéder à cette page.';
                case '500':
                    return 'Arg... Nous avons rencontré un petit problème. Merci de vous reconnecter.';

                default:
                    return false;
            }
        }
    }
};
</script>
