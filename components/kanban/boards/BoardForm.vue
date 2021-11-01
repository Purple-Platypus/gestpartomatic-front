<template>
    <v-form class="grey lighten-4" @submit.prevent="submit">
        <v-row class="px-2 py-1">
            <v-col class="pb-0">
                <v-text-field
                    autofocus
                    class="white"
                    dense
                    hide-details
                    label="Titre"
                    v-model="formData.name"
                    outlined
                    ref="inputName"
                    required
                    @keyup.ctrl.enter="submit"
                />
            </v-col>
        </v-row>

        <v-row class="px-2">
            <v-col>
                <v-textarea
                    auto-grow
                    class="input-description white"
                    dense
                    hide-details
                    label="Description"
                    v-model="formData.description"
                    outlined
                    ref="inputDescription"
                    rows="2"
                    @keyup.ctrl.enter="submit"
                />
            </v-col>
        </v-row>

        <v-row class="px-2">
            <v-col>
                <v-switch
                    class="mt-0 bordered-switch"
                    dense
                    flat
                    hide-details
                    label="Tableau privé"
                    v-model="formData.isPrivate"
                />
            </v-col>
        </v-row>

        <v-row class="px-2 pb-2">
            <v-col cols="6">
                <v-btn
                    block
                    color="primary"
                    depressed
                    :disabled="!formData.name"
                    type="submit"
                >
                    {{ submitLabel }}
                </v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn block color="error" depressed @click="cancel">
                    Annuler
                </v-btn>
            </v-col>
        </v-row>

        <v-divider />
    </v-form>
</template>

<script>
export default {
    name: 'board-form',
    components: {},
    props: {
        boardData: {
            type: Object,
            default: () => {
                return {
                    name: '',
                    description: '',
                    isPrivate: true
                };
            }
        },
        submitLabel: {
            type: String,
            default: 'Valider'
        }
    },
    data() {
        return {
            formData: {
                description: this.boardData.description,
                name: this.boardData.name,
                isPrivate: this.boardData.isPrivate
            }
        };
    },
    methods: {
        submit() {
            this.$emit('submit', this.formData);
        },
        cancel() {
            this.$emit('cancel');
        }
    }
};
</script>
