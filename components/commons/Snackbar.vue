<template>
    <v-snackbar v-model="show" :color="color" vertical>
        {{ snackbarText }}

        <template v-slot:action>
            <v-btn text @click="show = false">
                Fermer
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            color: '',
            snackbarText: ''
        };
    },
    created: function() {
        this.$store.watch(
            state => state.snackbar.text,
            () => {
                const storeText = this.$store.state.snackbar.text;
                if (storeText !== '') {
                    // Affichage de la snackbar
                    this.show = true;
                    this.color = this.$store.state.snackbar.color;
                    this.snackbarText = this.$store.state.snackbar.text;

                    // Réinitialisation de la snackbar après affichage
                    this.$store.commit('snackbar/setSnackbar');
                }
            }
        );
    }
};
</script>
