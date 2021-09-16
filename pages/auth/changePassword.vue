<template>
    <ValidationObserver ref="changePasswordForm" v-slot="{ invalid }">
        <v-form @submit.prevent="changePassword">
            <v-card-title class="headline justify-center mb-3">
                Nouveau mot de passe
            </v-card-title>
            <v-card-text>
                <p>
                    Choisissez votre nouveau mot de passe et essayez de ne pas
                    l'oublier ;)
                </p>
            </v-card-text>

            <v-card-text>
                <ValidationProvider
                    :rules="rules.password"
                    v-slot="{ errors, passed, failed }"
                    vid="password"
                >
                    <v-text-field
                        class="required"
                        :error-messages="errors"
                        label="Votre nouveau mot de passe"
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

                <ValidationProvider
                    :rules="rules.passwordConfirmation"
                    v-slot="{ errors, passed, failed }"
                    vid="passwordConfirmation"
                >
                    <v-text-field
                        class="ml-8 required"
                        :error-messages="errors"
                        label="Confirmez votre mot de passe"
                        outlined
                        type="password"
                        v-model="input.passwordConfirmation"
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
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    depressed
                    :disabled="invalid"
                    :loading="loading"
                    type="submit"
                >
                    Modification
                </v-btn>
            </v-card-actions>
        </v-form>
    </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import messages from '~/assets/messages.json';

export default {
    auth: false,
    layout: 'auth',
    transition: 'fade-transition',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    head: () => ({
        title: 'Modification du mot de passe'
    }),
    data: () => ({
        input: {
            password: '',
            passwordConfirmation: ''
        },
        rules: {
            password: {
                required_password: true,
                min_password: 3
            },
            passwordConfirmation: {
                required_password: true,
                confirmed: 'password'
            }
        },
        loading: false
    }),
    methods: {
        async changePassword() {
            this.loading = true;

            const resetData = {
                password: this.input.password,
                id: this.$route.query.user,
                token: this.$route.query.token
            };

            await this.$axios
                .$put('/api/auth/reset/', resetData)
                .then(res => {
                    this.$store.commit('snackbar/setSnackbar', {
                        text: `Votre mot de passe a été modifié :)`,
                        color: 'success'
                    });
                    this.$router.push('login');
                })
                .catch(err => {
                    if (err.response.status === 422) {
                        this.$refs.signinForm.setErrors({
                            email: [messages.errors.emailNotUnique]
                        });
                    } else {
                        this.$store.commit('snackbar/setSnackbar', {
                            text: messages.errors.generic,
                            color: 'error'
                        });
                    }
                    console.log(err.response);
                });
            this.loading = false;
        }
    }
};
</script>
