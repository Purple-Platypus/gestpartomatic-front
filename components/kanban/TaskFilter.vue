<template>
    <div>
        <Mentionable
            :keys="['@', '#']"
            :items="items"
            placement="auto-end"
            @open="onOpen"
        >
            <v-text-field
                append-outer-icon="mdi-magnify"
                clearable
                dense
                hide-details
                outlined
                ref="input"
                v-model="filterString"
                @keyup.enter="emitChange"
                @focus="showMenu"
                @blur="hideMenu"
                @click:append-outer="emitChange"
                @click:clear="clear"
            />

            <template #no-result>
                Pas de résultat...
            </template>

            <template #item-@="{ item }">
                <v-avatar size="24">
                    <v-img :src="item.avatar" />
                </v-avatar>
                {{ item.label }}
            </template>

            <template #item-#="{ item }">
                <v-chip
                    class="my-1 v-application"
                    :color="item.color"
                    :dark="item.isDark"
                    small
                >
                    {{ item.label }}
                </v-chip>
            </template>
        </Mentionable>

        <v-menu
            absolute
            :close-on-click="false"
            :close-on-content-click="false"
            content-class="elevation-0"
            :internal-activator="true"
            :position-x="position.x"
            :position-y="position.y"
            :nudge-top="-position.height"
            :min-width="position.width"
            :max-width="position.width"
            v-model="isVisibleMenu"
        >
            <v-card outlined>
                <v-card-text class="py-2">
                    <p>
                        Indiquez vos critères séparés par les points-virgules :
                    </p>
                    <p><kbd>@</kbd> Recherchez des utilisateurs</p>
                    <p><kbd>#</kbd> Recherchez des étiquettes</p>
                    <p>
                        ...ou recherchez par le titre ou la description de la
                        tâche
                    </p>
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
import { Mentionable } from 'vue-mention';
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
    name: 'task-filter',
    components: { Mentionable },
    data() {
        return {
            items: [],
            isVisibleMenu: false,
            position: {},
            filterString: ''
        };
    },
    computed: {
        tagItems() {
            return this.tagsList.map(tag => {
                return {
                    value: tag.label + '; ',
                    label: tag.label,
                    color: tag.color,
                    isDark: tag.isDark
                };
            });
        },
        tagsByLabel() {
            const tagsByLabel = {};
            this.tagsList.forEach(tag => {
                tagsByLabel[tag.label] = tag.id;
            });
            return tagsByLabel;
        },
        userItems() {
            return this.users.map(user => {
                return {
                    value: user.username + '; ',
                    label: user.nickname || user.username,
                    avatar: user.avatar
                };
            });
        },
        usersByUsername() {
            const usersByUsername = {};
            this.users.forEach(user => {
                usersByUsername[user.username] = user.id;
            });
            return usersByUsername;
        },
        ...mapGetters('boards', ['tagsList']),
        ...mapState('users', ['users'])
    },
    methods: {
        onOpen(key) {
            this.items = key === '@' ? this.userItems : this.tagItems;
        },
        showMenu(e) {
            e.preventDefault();
            this.getPosition();
            this.$nextTick(() => {
                this.isVisibleMenu = true;
            });
        },
        hideMenu() {
            this.isVisibleMenu = false;
        },
        getPosition() {
            this.position = this.$refs.input.$el.getBoundingClientRect();
        },
        emitChange() {
            const inputTerms = this.filterString.trim().split(';');
            const filterParams = {
                words: [],
                assignees: [],
                tags: []
            };

            if (inputTerms.length) {
                const filterTerms = inputTerms.map(term => {
                    switch (term.trim().charAt(0)) {
                        case '@':
                            return {
                                type: 'assignees',
                                value: this.usersByUsername[
                                    term.trim().substring(1)
                                ]
                            };
                        case '#':
                            return {
                                type: 'tags',
                                value: this.tagsByLabel[
                                    term.trim().substring(1)
                                ]
                            };
                        default:
                            return {
                                type: 'words',
                                value: term.trim().toLowerCase()
                            };
                    }
                });

                filterTerms.forEach(term => {
                    if (term.value) {
                        filterParams[term.type].push(term.value);
                    }
                });
                this.setFilters(filterParams);
            }
        },
        clear() {
            const clearedParams = {
                words: [],
                assignees: [],
                tags: []
            };
            this.setFilters(clearedParams);
        },
        ...mapMutations('boards', ['setFilters'])
    }
};
</script>
<style lang="scss">
.tooltip {
    z-index: 9;
}
.mention-item {
    background-color: #ffffff;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 4px 16px;
    cursor: pointer;

    &:first-child {
        border-top: 1px solid #ddd;
        border-radius: 4px 4px 0 0;
        padding-top: 8px;
    }

    &:last-child {
        border-bottom: 1px solid #ddd;
        border-radius: 0 0 4px 4px;
        padding-bottom: 8px;
    }
}
</style>
