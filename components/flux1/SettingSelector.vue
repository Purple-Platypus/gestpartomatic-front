<template>
    <v-row class="my-0">
        <v-col cols="2" class="py-1">
            <v-select
                :items="articlesList"
                label="Article"
                dense
                outlined
                :hide-details="true"
                :value="setting.article"
                @input="updateSetting('article', $event)"
            ></v-select>
        </v-col>

        <v-col cols="3" class="py-1">
            <v-autocomplete
                :items="propertiesList"
                :item-text="getLabel"
                item-value="id"
                label="Donnée"
                dense
                outlined
                :hide-details="true"
                height="28px"
                :disabled="!hasArticle"
                :value="setting.propertyId"
                @input="updateSetting('propertyId', $event)"
            ></v-autocomplete>
        </v-col>

        <v-col cols="1" class="py-1">
            <color-selector
                :value="setting.style"
                @input="updateSetting('style', $event)"
            ></color-selector>
        </v-col>

        <v-col class="py-1" cols="2">
            <v-text-field
                dense
                outlined
                :hide-details="true"
                placeholder="Rechercher"
                prepend-inner-icon="mdi-magnify"
                :value="setting.filter"
                @input="updateSetting('filter', $event)"
            >
                <template v-slot:append>
                    <v-icon
                        @click="updateSetting('invert', !setting.invert)"
                        :title="
                            setting.invert
                                ? 'Rétablir la condition'
                                : 'Inverser la condition'
                        "
                        :color="setting.invert ? 'error' : ''"
                    >
                        {{
                            setting.invert
                                ? 'mdi-swap-horizontal-circle'
                                : 'mdi-swap-horizontal-circle-outline'
                        }}
                    </v-icon>
                </template>
            </v-text-field>
        </v-col>

        <v-col
            cols="1"
            class="py-1 pl-0 d-flex align-center"
            v-if="selection.length > 1"
        >
            <v-btn icon @click="remove">
                <v-icon>
                    mdi-close-circle-outline
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import ColorSelector from '../commons/ColorSelector.vue';

export default {
    name: 'setting-selector',
    components: { ColorSelector },
    props: ['settingId'],
    data() {
        return {
            articlesList: [
                { text: 'Partie commune', value: 0 },
                { text: 'Article 1', value: 1 },
                { text: 'Article 2', value: 2 },
                { text: 'Article 3', value: 3 },
                { text: 'Article 4', value: 4 },
                { text: 'Article 5', value: 5 },
                { text: 'Article 6', value: 6 },
                { text: 'Article 7', value: 7 },
                { text: 'Article 8', value: 8 }
            ]
        };
    },
    methods: {
        getLabel(item) {
            return 'Pos. ' + item.position + ' - ' + item.label;
        },
        updateSetting(prop, value) {
            this.$store.commit('flux1/updateSetting', {
                settingId: this.settingId,
                prop,
                value
            });
        },
        toggleInvert() {
            this.setting.invert = !this.setting.invert;
        },
        remove() {
            this.$store.commit('flux1/removeSetting', this.setting);
        }
    },
    computed: {
        propertiesList() {
            if (typeof this.setting.article != 'undefined') {
                return this.getArticle(this.setting.article);
            } else {
                return [];
            }
        },
        hasArticle() {
            return !!(this.propertiesList && this.propertiesList.length);
        },
        setting() {
            return this.getSetting(this.settingId);
        },
        selection() {
            return this.$store.state.flux1.selection;
        },
        ...mapGetters('flux1', ['getArticle', 'getSetting'])
    }
};
</script>
