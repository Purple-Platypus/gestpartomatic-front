<template>
    <v-sheet class="pa-2" outlined>
        <tag-form-add />

        <v-divider class="my-2" />

        <v-container>
            <task-tags-manager-item
                v-for="tag in tags"
                :key="tag.id"
                :tagId="tag.id"
                @remove="remove"
            />
            <p v-if="!tagsList.length" class="font-italic grey--text">
                Il n'existe aucune étiquette pour le moment.
            </p>
        </v-container>

        <div class="text-right">
            <v-btn depressed @click="close">
                Retour
            </v-btn>
        </div>
    </v-sheet>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TagFormAdd from './TagFormAdd.vue';
import TaskTagsManagerItem from './TaskTagsManagerItem.vue';

export default {
    name: 'task-tags-manager',
    components: { TagFormAdd, TaskTagsManagerItem },
    data() {
        return {};
    },
    computed: {
        ...mapState('boards', ['tags']),
        ...mapGetters('boards', ['tagsList'])
    },
    methods: {
        add(tagId) {
            this.tags.push(tagId);
        },
        close() {
            this.$emit('close');
        },
        remove(tagId) {
            this.$emit('remove', tagId);
        }
    }
};
</script>
