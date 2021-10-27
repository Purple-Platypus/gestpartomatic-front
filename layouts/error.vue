<template>
    <v-container>
        <v-card class="flex-grow-1" outlined>
            <v-card-title>
                <h1 class="text-h3 font-weight-light">
                    {{ message.title }}
                </h1>
            </v-card-title>
            <v-card-text>
                <p>
                    {{ message.text }}
                </p>
            </v-card-text>

            <v-alert
                v-if="error.statusCode == 500"
                class="mx-4"
                border="left"
                outlined
                color="red"
            >
                {{ error.message }}
            </v-alert>

            <v-card-text>
                <NuxtLink to="/">
                    Revenir à l'accueil
                </NuxtLink>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    computed: {
        message() {
            switch (this.error.statusCode) {
                case 404:
                    return {
                        title: 'Félicitations : vous êtes complètement perdu !',
                        text: `La page que vous recherchez n'existe malheureusement pas.`
                    };
                case 403:
                    return {
                        title: `Désolé`,
                        text: `Vous ne pouvez pas accéder à cette page.`
                    };

                default:
                    return {
                        title: 'Allo Houston... On a un problème',
                        text: `Une erreur mystérieuse est survenue. Merci d'arrêter de tout casser.`
                    };
            }
        }
    },
    head() {
        return { title: 'Arg... Une erreur est survenue' };
    }
};
</script>
