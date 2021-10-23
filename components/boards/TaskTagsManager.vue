<template>
    <v-sheet class="pa-2" outlined>
        <tag-form-add />

        <v-divider class="my-2" />

        <v-container>
            <v-row v-for="tag in tags" :key="tag.id">
                <v-col class="py-0">
                    <v-chip :color="tag.color">
                        {{ tag.label }}
                    </v-chip>
                </v-col>

                <v-col class="flex-grow-0 d-flex py-0">
                    <v-btn icon>
                        <v-icon>
                            mdi-circle-edit-outline
                        </v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>
                            mdi-close-circle-outline
                        </v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>

        <div class="text-right">
            <v-btn depressed @click="close">
                Retour
            </v-btn>
        </div>
    </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import TagFormAdd from './TagFormAdd.vue';

export default {
    name: 'task-tags-manager',
    components: { TagFormAdd },
    props: {},
    data() {
        return {};
    },
    computed: {
        ...mapState('boards', ['tags'])
    },
    methods: {
        add(tagId) {
            this.tags.push(tagId);
        },
        remove(tagId) {
            this.tags.splice(this.tags.indexOf(tagId), 1);
        },
        close() {
            this.$emit('close');
        }
    },
    watch: {
        tags(list) {
            this.$emit('input', list);
        }
    }
};
</script>
