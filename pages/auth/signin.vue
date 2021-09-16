<template>
    <ValidationObserver ref="signinForm" v-slot="{ invalid }">
        <v-row>
            <v-spacer></v-spacer>
            <v-card
                class="mt-n16 mb-6 cursor-pointer card--avatar"
                height="128"
                width="128"
            >
                <avatar-selector
                    src="/img/default_avatar.png"
                    :source-string="input.username"
                    @change="handleAvatarUpdate($event)"
                ></avatar-selector>
            </v-card>
            <v-spacer></v-spacer>
        </v-row>

        <v-form @submit.prevent="signin">
            <v-card-text>
                <ValidationProvider
                    v-slot="{ errors, passed, failed }"
                    vid="username"
                    :rules="rules.username"
                >
                    <v-text-field
                        class="required"
                        :error-messages="errors"
                        label="Nom d'utilisateur"
                        outlined
                        prepend-icon="mdi-account-circle-outline"
                        v-model="input.username"
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
                    v-slot="{ errors, passed, failed }"
                    vid="email"
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

                <ValidationProvider
                    :rules="rules.passwordConfirmation"
                    v-slot="{ errors, passed, failed }"
                    vid="passwordConfirmation"
                >
                    <v-text-field
                        class="required ml-8"
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
                <v-btn color="primary" text to="/auth/login">
                    Déjà inscrit ?
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    depressed
                    :disabled="invalid"
                    :loading="loading"
                    type="submit"
                >
                    Inscription
                </v-btn>
            </v-card-actions>
        </v-form>
    </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import AvatarSelector from '../../components/profile/AvatarSelector';
import messages from '~/assets/messages.json';

export default {
    auth: false,
    layout: 'auth',
    transition: 'fade-transition',
    components: {
        ValidationProvider,
        ValidationObserver,
        AvatarSelector
    },
    head: () => ({
        title: 'Inscription'
    }),
    data: () => ({
        input: {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            avatar: ''
        },
        rules: {
            username: {
                required_username: true,
                format_username: /^[\d\.a-z_-]{1,25}$/
            },
            email: { required_email: true, email: true },
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
        handleAvatarUpdate(avatarUrl) {
            this.input.avatar = avatarUrl;
        },
        async signin() {
            this.loading = true;

            await this.$axios
                .$post('/api/auth/signin/', {
                    username: this.input.username,
                    email: this.input.email,
                    password: this.input.password,
                    avatar: this.input.avatar
                })
                .then(res => {
                    this.login();
                })
                .catch(err => {
                    if (err.response.status === 422) {
                        if (err.response.data.message == 'username') {
                            this.$refs.signinForm.setErrors({
                                username: [messages.errors.usernameNotUnique]
                            });
                        } else {
                            this.$refs.signinForm.setErrors({
                                email: [messages.errors.emailNotUnique]
                            });
                        }
                    } else {
                        this.$store.commit('snackbar/setSnackbar', {
                            text: messages.errors.generic,
                            color: 'error'
                        });
                    }
                });
            this.loading = false;
        },
        async login() {
            this.loading = true;
            await this.$axios
                .$post('/api/auth/login/', {
                    email: this.input.email,
                    password: this.input.password
                })
                .then(res => {
                    this.$store.dispatch('auth/login', res);
                    this.$router.push('/');
                })
                .catch(err => {
                    this.$store.commit('snackbar/setSnackbar', {
                        text: messages.errors.generic,
                        color: 'error'
                    });
                });
            this.loading = false;
        }
    },
    computed: {}
};
</script>

<style scoped>
.card--avatar {
    overflow: hidden;
}
</style>
