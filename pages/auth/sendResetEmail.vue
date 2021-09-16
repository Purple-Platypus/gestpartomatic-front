<template>
    <ValidationObserver ref="resetForm" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="sendEmail">
            <v-card-title class="headline  justify-center mb-3">
                Récupération de mot de passe
            </v-card-title>
            <v-card-text>
                <p>
                    Indiquez votre adresse électronique pour recevoir un lien de
                    réinitialisation de votre mot de passe.
                </p>

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
            </v-card-text>

            <v-card-actions class="px-4">
                <v-btn color="primary" text to="/auth/login">
                    Retour
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn
                    color="primary"
                    depressed
                    :disabled="invalid || emailSent"
                    type="submit"
                    :loading="loading"
                >
                    Envoi
                </v-btn>
            </v-card-actions>

            <v-card-text v-if="emailSent">
                <v-alert outlined type="success">
                    Un message vous a été envoyé à l'adresse {{ input.email }}.
                </v-alert>
            </v-card-text>
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
        title: 'Réinitialisation du mot de passe'
    }),
    data: () => ({
        input: {
            email: ''
        },

        rules: {
            email: { required_email: true, email: true }
        },
        loading: false,
        emailSent: false
    }),
    methods: {
        async sendEmail() {
            this.loading = true;
            await this.$axios
                .$post('/api/auth/send-reset-email/', this.input)
                .then(res => {
                    this.emailSent = true;
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        this.$refs.resetForm.setErrors({
                            email: [messages.errors.emailUnknown]
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
