<template>
    <v-row>
        <v-col>
            <tag-form v-model="formData" />
        </v-col>
        <v-col class="flex-grow-0 d-flex align-center pl-0">
            <v-btn
                color="primary"
                :disabled="!formData.label"
                icon
                @click="add"
            >
                <v-icon>
                    mdi-plus-circle-outline
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import TagForm from './TagForm.vue';
export default {
    components: { TagForm },
    name: 'tag-form-add',
    props: {},
    data() {
        return {
            formData: {
                label: '',
                color: '#2196F3'
            }
        };
    },
    methods: {
        add() {
            this.addTag(this.formData);
        },
        ...mapActions('boards', ['addTag'])
    }
};
</script>
