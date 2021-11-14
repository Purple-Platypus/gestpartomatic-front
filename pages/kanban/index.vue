<template>
    <v-row class="align-self-stretch">
        <v-col cols="4">
            <v-card flat outlined>
                <v-card-title class="pa-2">
                    <h1 class="mb-4 text-h3 font-weight-light">
                        Projets
                    </h1>
                </v-card-title>

                <v-card-text class="px-2">
                    <v-sheet outlined rounded>
                        <div
                            class="d-flex align-center grey lighten-3 px-4 py-2 text-body-2"
                        >
                            <span
                                class="cursor-pointer"
                                :class="{
                                    'font-weight-bold': displayActive,
                                    'grey--text': !displayActive
                                }"
                                @click="showActive"
                            >
                                {{ activeBoards.length }}
                                tableau{{ activeBoards.length > 1 ? 'x' : '' }}
                            </span>
                            <span
                                v-if="archivedBoards.length"
                                class="ml-8 cursor-pointer"
                                :class="{
                                    'font-weight-bold': !displayActive,
                                    'grey--text': displayActive
                                }"
                                @click="showArchive"
                            >
                                <v-icon
                                    :color="displayActive ? 'grey' : 'black'"
                                    size="18px"
                                    left
                                >
                                    mdi-archive
                                </v-icon>
                                {{ archivedBoards.length }}
                                archivé{{
                                    archivedBoards.length > 1 ? 's' : ''
                                }}
                            </span>

                            <v-spacer />
                            <v-btn
                                color="primary"
                                icon
                                small
                                @click="showCreateForm"
                            >
                                <v-icon size="19px">
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </div>

                        <v-divider />

                        <board-form-create
                            v-if="isVisibleCreateForm"
                            @cancel="hideCreateForm"
                            @create="hideCreateForm"
                        />

                        <v-list class="pa-0" dense>
                            <template
                                v-for="(boardId, index) in displayedBoards"
                            >
                                <board-form-update
                                    v-if="visibleUpdateForm == boardId"
                                    :boardId="boardId"
                                    :key="'form_' + boardId"
                                    @cancel="hideUpdateForm"
                                    @update="hideUpdateForm"
                                />
                                <boards-list-item
                                    v-else
                                    :boardId="boardId"
                                    :key="'item_' + boardId"
                                    @update="showUpdateForm(boardId)"
                                />
                                <v-divider
                                    v-if="index + 1 != displayedBoards.length"
                                    :key="'divider_' + boardId"
                                />
                            </template>

                            <div
                                v-if="isEmptyMessageVisible"
                                class="pt-4 px-4 text-center"
                            >
                                <p class="text-h6">
                                    Vous n'avez aucun tableau actif.
                                </p>
                                <p class="grey--text">
                                    Vous pouvez en
                                    <a @click="showCreateForm">créer un</a
                                    ><span v-if="archivedBoards.length">
                                        ou restaurer un
                                        <a @click="showArchive"
                                            >tableau archivé</a
                                        >
                                        tableau archivé </span
                                    >.
                                </p>
                            </div>
                        </v-list>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import ShortkeysEmitter from '../../components/commons/mixins/ShortkeysEmitter.mixin';
import BoardsListItem from '../../components/kanban/boards/BoardsListItem.vue';
import BoardForm from '../../components/kanban/boards/BoardForm.vue';
import BoardFormUpdate from '../../components/kanban/boards/BoardFormUpdate.vue';
import BoardFormCreate from '../../components/kanban/boards/BoardFormCreate.vue';

export default {
    head: () => ({
        title: 'Kanbans'
    }),
    components: {
        BoardsListItem,
        BoardForm,
        BoardFormUpdate,
        BoardFormCreate
    },
    mixins: [ShortkeysEmitter],
    data: () => {
        return {
            displayActive: true,
            isVisibleCreateForm: false,
            visibleUpdateForm: null
        };
    },
    computed: {
        displayedBoards() {
            if (this.displayActive) {
                return this.activeBoards;
            } else {
                return this.archivedBoards;
            }
        },
        isEmptyMessageVisible() {
            return (
                !this.activeBoards.length &&
                this.displayActive &&
                !this.isVisibleCreateForm
            );
        },
        ...mapGetters('boards', ['activeBoards', 'archivedBoards'])
    },
    methods: {
        handleShortkey(e) {
            switch (e.key) {
                case '+':
                    this.showCreateForm();
                    break;
                case 'Escape':
                    this.hideAll();
                    break;
            }
        },
        showActive() {
            this.displayActive = true;
        },
        showArchive() {
            this.displayActive = false;
        },
        showCreateForm() {
            this.isVisibleCreateForm = true;
            this.hideUpdateForm();
        },
        showUpdateForm(boardId) {
            this.visibleUpdateForm = boardId;
            this.hideCreateForm();
        },
        hideCreateForm() {
            this.isVisibleCreateForm = false;
        },
        hideUpdateForm() {
            this.visibleUpdateForm = null;
        },
        hideAll() {
            this.hideCreateForm();
            this.hideUpdateForm();
        }
    },
    mounted() {
        const shortkeys = [{ keys: '+', label: 'Ajouter un tableau' }];
        this.$store.commit('help/set', shortkeys);
    },
    watch: {
        archivedBoards() {
            if (!this.archivedBoards.length) {
                this.displayActive = true;
            }
        }
    }
};
</script>
