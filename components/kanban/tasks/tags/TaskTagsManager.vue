<template>
    <v-sheet class="pa-2" outlined>
        <tag-form-add :disabled="!!updatedTagId" />

        <v-divider class="my-2" />

        <v-container>
            <task-tags-manager-item
                v-for="tag in tags"
                :key="tag.id"
                :tagId="tag.id"
                :isUpdated="tag.id === updatedTagId"
                @showUpdate="showUpdate(tag.id)"
                @hideUpdate="hideUpdate"
                @update="update"
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
        return {
            updatedTagId: null
        };
    },
    computed: {
        ...mapState('boards', ['tags']),
        ...mapGetters('boards', ['tagsList'])
    },
    methods: {
        add(tagId) {
            this.tags.push(tagId);
        },
        showUpdate(tagId) {
            this.updatedTagId = tagId;
        },
        hideUpdate(tagId) {
            this.updatedTagId = null;
        },
        update(tagData) {
            this.$emit('update', tagData);
        },
        remove(tagId) {
            this.$emit('remove', tagId);
        },
        close() {
            this.hideUpdate();
            this.$emit('close');
        }
    }
};
</script>
