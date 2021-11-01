<template>
    <v-row class="my-1">
        <v-col>
            <tag-form v-model="formData" @submit="update" />
        </v-col>
        <v-col class="flex-grow-0 d-flex align-center pl-0">
            <v-btn
                class="ml-1"
                color="primary"
                :disabled="!formData.label"
                icon
                small
                @click="update"
            >
                <v-icon>
                    mdi-check-circle-outline
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TagForm from './TagForm.vue';
export default {
    components: { TagForm },
    name: 'tag-form-update',
    props: {
        tagId: Number
    },
    data() {
        return {
            formData: {}
        };
    },
    beforeMount() {
        this.formData = {
            label: this.tags[this.tagId].label,
            color: this.tags[this.tagId].color,
            isDark: this.tags[this.tagId].isDark
        };
    },
    computed: {
        ...mapState('boards', ['tags'])
    },
    methods: {
        update() {
            this.$emit('update', this.formData);
        }
    }
};
</script>
