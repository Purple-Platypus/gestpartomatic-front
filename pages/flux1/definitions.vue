<template>
    <div>
        <v-card-actions>
            <nuxt-link class="mr-4" to="/flux1">
                <v-icon color="primary" small>
                    mdi-chevron-left
                </v-icon>
                Retour au Fluxomatic
            </nuxt-link>

            <v-spacer />

            <definition-uploader
                depressed
                @input="handleUpload"
                outlined
                small
                v-if="auth.id"
            >
                <template v-if="activeTab == 0">
                    Charger un CSV pour la partie commune
                </template>
                <template v-else>
                    Charger un CSV pour l'article {{ activeTab }}
                </template>
            </definition-uploader>

            <v-btn
                color="primary"
                class="ml-2"
                @click="save"
                depressed
                :disabled="!isComplete"
                small
                v-if="auth.id"
            >
                <v-icon left>mdi-content-save</v-icon>
                Enregistrer
            </v-btn>
        </v-card-actions>

        <v-card-actions>
            <v-tabs v-model="activeTab">
                <v-tab :class="{ 'red--text': isEmpty(0) }">
                    Partie commune
                    <template v-if="isTouched(0)">*</template>
                </v-tab>
                <v-tab
                    v-for="article in 8"
                    :key="article"
                    :class="{ 'red--text': isEmpty(article) }"
                >
                    Article {{ article }}
                    <template v-if="isTouched(article)">*</template>
                </v-tab>
            </v-tabs>
        </v-card-actions>

        <v-card-text>
            <v-data-table
                :headers="headers"
                :items="activeArticle"
                item-key="position"
                :disable-pagination="true"
                dense
                no-data-text="Je n'ai rien à afficher :/"
                hide-default-footer
            >
                <template v-slot:[`item.nature`]="{ item }">
                    {{ natureLabels[item.nature] }}
                </template>
                <template v-slot:[`item.required`]="{ item }">
                    {{ item.required ? 'X' : '' }}
                </template>
            </v-data-table>
        </v-card-text>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthMixin from '../../components/commons/mixins/Auth.mixin';
import DefinitionUploader from '../../components/flux1/DefinitionUploader';

export default {
    components: { DefinitionUploader },
    mixins: [AuthMixin],
    data() {
        return {
            activeTab: 0,
            headers: [
                { text: 'Position', sortable: false, value: 'position' },
                { text: 'Nature', sortable: false, value: 'nature' },
                { text: 'Longueur', sortable: false, value: 'length' },
                { text: 'Oblig.', sortable: false, value: 'required' },
                { text: 'Libellé', sortable: false, value: 'label' },
                { text: 'Description', sortable: false, value: 'description' },
                {
                    text: 'Donnée en base',
                    sortable: false,
                    value: 'db_column'
                },
                { text: 'Commentaire', sortable: false, value: 'comment' }
            ],
            touched: [],
            natureLabels: {
                STRING: 'Chaîne',
                INT: 'Nombre'
            }
        };
    },
    methods: {
        handleUpload(articleData) {
            this.$store.dispatch('flux1/setArticle', {
                articleData,
                indexArticle: this.activeTab
            });
            this.touched.push(this.activeTab);
        },
        isEmpty(articleIndex) {
            return this.isArticleEmpty(articleIndex);
        },
        isTouched(articleIndex) {
            return this.touched.includes(articleIndex);
        },
        async save() {
            const savePayload = this.$store.state.flux1.definitions;

            await this.$axios
                .$post('/api/flux1', { data: savePayload })
                .catch(err => {
                    console.log(err);
                });
            this.touched = [];
        }
    },
    computed: {
        activeArticle() {
            return this.getArticle(this.activeTab);
        },
        ...mapGetters('flux1', ['getArticle', 'isArticleEmpty', 'isComplete'])
    },
    async fetch() {
        const definitions = await this.$axios
            .$get('/api/flux1')
            .then(res => res)
            .catch(err => {
                console.log(err);
            });
        this.$store.dispatch('flux1/setDefinitions', definitions);
    }
};
</script>
