<template>
    <v-row class="justify-center py-4">
        <v-col cols="6">
            <v-row class="justify-start">
                <v-col class="flex-grow-0">
                    <v-card outlined class="cursor-pointer card--avatar">
                        <avatar-selector
                            :src="auth.avatar"
                            @change="updateAvatar($event)"
                        ></avatar-selector>
                    </v-card>
                </v-col>

                <v-col>
                    <v-card outlined>
                        <v-card-title class="pb-1">
                            <h1 class="text-h2">
                                Profil
                            </h1>
                        </v-card-title>
                        <v-card-text
                            class="text-h5 text--secondary font-italic"
                        >
                            @{{ auth.username }}
                        </v-card-text>
                    </v-card>

                    <v-card outlined class="mt-4">
                        <v-card-title>
                            <h2 class="text-h4 font-weight-light mb-8">
                                Informations sur votre compte
                            </h2>
                        </v-card-title>

                        <v-card-text>
                            <v-row>
                                <v-col class="col-6 offset-1">
                                    <ValidationObserver
                                        ref="profileForm"
                                        v-slot="{ changed, invalid }"
                                    >
                                        <v-form @submit.prevent="updateProfile">
                                            <ValidationProvider
                                                v-slot="{
                                                    errors,
                                                    passed,
                                                    failed
                                                }"
                                                vid="email"
                                                :rules="rules.email"
                                            >
                                                <v-text-field
                                                    class="required"
                                                    dense
                                                    :error-messages="errors"
                                                    label="Adresse mail"
                                                    outlined
                                                    prepend-icon="mdi-email-outline"
                                                    v-model="input.email"
                                                >
                                                    <template v-slot:append>
                                                        <v-icon
                                                            color="success"
                                                            v-if="passed"
                                                        >
                                                            mdi-check
                                                        </v-icon>
                                                        <v-icon
                                                            color="error"
                                                            v-if="failed"
                                                        >
                                                            mdi-close
                                                        </v-icon>
                                                    </template>
                                                </v-text-field>
                                            </ValidationProvider>

                                            <ValidationProvider
                                                v-slot="{
                                                    errors,
                                                    passed,
                                                    failed
                                                }"
                                                vid="username"
                                                :rules="rules.nickname"
                                            >
                                                <v-text-field
                                                    dense
                                                    :error-messages="errors"
                                                    label="Pseudo"
                                                    outlined
                                                    prepend-icon="mdi-account-circle-outline"
                                                    v-model="input.nickname"
                                                >
                                                    <template v-slot:append>
                                                        <v-icon
                                                            color="success"
                                                            v-if="passed"
                                                        >
                                                            mdi-check
                                                        </v-icon>
                                                        <v-icon
                                                            color="error"
                                                            v-if="failed"
                                                        >
                                                            mdi-close
                                                        </v-icon>
                                                    </template>
                                                </v-text-field>
                                            </ValidationProvider>

                                            <v-btn
                                                class="ml-8"
                                                color="primary"
                                                depressed
                                                :disabled="!changed || invalid"
                                                :loading="loading"
                                                type="submit"
                                            >
                                                Enregistrer
                                            </v-btn>
                                        </v-form>
                                    </ValidationObserver>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card outlined class="mt-4">
                        <v-card-title>
                            <h2 class="text-h4 font-weight-light">
                                Préférences
                            </h2>
                        </v-card-title>

                        <v-card-text>
                            <v-row>
                                <v-col class="col-6 offset-1">
                                    <v-form>
                                        <v-switch
                                            class=""
                                            v-model="settingDarkMode"
                                            label="Mode sombre"
                                            @change="updateDarkMode"
                                        ></v-switch>
                                    </v-form>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import AvatarSelector from '../../components/profile/AvatarSelector.vue';

export default {
    name: 'profile',
    middleware: ['auth'],
    components: { ValidationObserver, ValidationProvider, AvatarSelector },
    head: () => ({
        title: 'Profil'
    }),
    data() {
        return {
            avatar: '',
            input: {
                nickname: '',
                email: ''
            },
            rules: {
                nickname: {
                    max_nickname: 50
                },
                email: { required_email: true, email: true }
            },
            settingDarkMode: false,
            loading: false
        };
    },
    computed: {
        ...mapState('auth', ['auth'])
    },
    mounted() {
        this.avatar = this.auth.avatar;
        this.input.nickname = this.auth.nickname;
        this.input.email = this.auth.email;

        this.settingDarkMode = this.auth.settingDarkMode;
    },
    methods: {
        updateAvatar(avatarUrl) {
            const payload = {
                avatar: avatarUrl
            };
            this.update(payload).then(() => {
                this.avatar = avatarUrl;
            });
        },
        updateProfile() {
            this.loading = true;

            const payload = {
                nickname: this.input.nickname,
                email: this.input.email
            };

            this.update(payload)
                .then(() => {
                    this.$refs.profileForm.reset();
                })
                .catch(err => {
                    if (err.response.status === 422) {
                        this.$refs.profileForm.setErrors({
                            email: [messages.errors.emailNotUnique]
                        });
                    }
                });

            this.loading = false;
        },
        updateDarkMode() {
            const payload = {
                settingDarkMode: this.settingDarkMode
            };

            this.update(payload);
        },
        ...mapActions('auth', ['update'])
    }
};
</script>
