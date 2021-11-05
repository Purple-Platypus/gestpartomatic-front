<template>
    <div class="pa-2" outlined>
        <tag-form-create :disabled="!!updatedTagId" @create="create" />

        <v-divider class="my-2" />

        <v-container>
            <tags-manager-item
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
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TagFormCreate from './TagFormCreate.vue';
import TagsManagerItem from './TagsManagerItem.vue';

export default {
    name: 'tags-manager',
    components: { TagFormCreate, TagsManagerItem },
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
        create(tagId) {
            this.tags.push(tagId);
        },
        showUpdate(tagId) {
            this.updatedTagId = tagId;
        },
        hideUpdate(tagId) {
            this.updatedTagId = null;
        },
        create(tagData) {
            this.$emit('create', tagData);
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
