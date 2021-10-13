<template>
    <v-row>
        <v-col>
            <v-card outlined class="elevation-0">
                <v-card-title>
                    <h1 class="text-h3 font-weight-light">
                        Glunomatic
                    </h1>
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle-1 font-weight-light">
                        Pimp my GLUN
                    </span>
                </v-card-subtitle>

                <v-card-actions>
                    <glun-uploader
                        depressed
                        outlined
                        small
                        @input="handleInput"
                    >
                        Ajouter un GLUN
                    </glun-uploader>
                </v-card-actions>

                <v-card-text v-if="anos.byCode.length">
                    <h2 class="text-h5 ">
                        {{ anos.total }} anomalies dans
                        {{ glunCount }} fichier{{ glunCount > 1 ? 's' : '' }}
                        GLUN
                    </h2>
                </v-card-text>

                <v-card-text v-if="anos.byCode.length">
                    <v-row>
                        <v-col sm="6" lg="4">
                            <h2 class="text-h5 font-weight-light">
                                Total par anomalie
                            </h2>
                            <p class="text-caption font-italic ">
                                Cliquez sur une ligne pour filtrer les
                                statistiques par anomalie
                            </p>
                            <v-sheet class="mx-4" outlined rounded>
                                <v-data-table
                                    dense
                                    :headers="headersByCode"
                                    :items="anos.byCode"
                                    item-key="anoCode"
                                    sort-by="count"
                                    :sort-desc="true"
                                    :items-per-page="-1"
                                    hide-default-footer
                                    @click:row="selectAno"
                                >
                                    <template v-slot:body.prepend>
                                        <tr
                                            @click="
                                                selectAno({ anoCode: 'total' })
                                            "
                                        >
                                            <td class="text-center">
                                                <strong>Total</strong>
                                            </td>
                                            <td class="text-center">
                                                <strong>{{
                                                    anos.total
                                                }}</strong>
                                            </td>
                                            <td></td>
                                        </tr>
                                    </template>
                                    <template v-slot:item.percentage="{ item }">
                                        {{
                                            (
                                                (item.count * 100) /
                                                anos.total
                                            ).toFixed(2)
                                        }}&nbsp;%
                                    </template>
                                </v-data-table>
                            </v-sheet>
                        </v-col>

                        <v-col sm="6" lg="4" offset-lg="2">
                            <h2 class="mb-8 text-h5 font-weight-light">
                                {{
                                    selectedAno == 'total'
                                        ? 'Total'
                                        : 'Anomalies ' + selectedAno
                                }}
                                par origine
                            </h2>

                            <v-sheet class="mx-4" outlined rounded>
                                <v-data-table
                                    dense
                                    :headers="headersByOrigine"
                                    :items="anos.byOrigine"
                                    item-key="origineCode"
                                    sort-by="count"
                                    :sort-desc="true"
                                    :items-per-page="-1"
                                    hide-default-footer
                                >
                                    <template v-slot:item.percentage="{ item }">
                                        {{
                                            (
                                                (item.count * 100) /
                                                anos.subtotal
                                            ).toFixed(2)
                                        }}&nbsp;%
                                    </template>
                                </v-data-table>
                            </v-sheet>
                        </v-col>

                        <v-col class="mt-4" sm="6" lg="4">
                            <h2 class="mb-4 text-h5 font-weight-light">
                                {{
                                    selectedAno == 'total'
                                        ? 'Total'
                                        : 'Anomalies ' + selectedAno
                                }}
                                par direction
                            </h2>

                            <v-sheet class="mx-4" outlined rounded>
                                <v-data-table
                                    dense
                                    :headers="headersByDirection"
                                    :items="anos.byDirection"
                                    item-key="directionCode"
                                    sort-by="directionCode"
                                    :items-per-page="-1"
                                    hide-default-footer
                                >
                                    <template v-slot:item.percentage="{ item }">
                                        {{
                                            (
                                                (item.count * 100) /
                                                anos.subtotal
                                            ).toFixed(2)
                                        }}&nbsp;%
                                    </template>
                                </v-data-table>
                            </v-sheet>
                        </v-col>

                        <v-col class="mt-4" sm="6" offset-lg="2" lg="6">
                            <h2 class="mb-4 text-h5 font-weight-light">
                                {{
                                    selectedAno == 'total'
                                        ? 'Total'
                                        : 'Anomalies ' + selectedAno
                                }}
                                par SIP
                            </h2>

                            <v-sheet class="mx-4" outlined rounded>
                                <v-data-table
                                    dense
                                    :headers="headersBySip"
                                    :items="anos.bySip"
                                    item-key="sipName"
                                    sort-by="directionCode"
                                    :items-per-page="-1"
                                    hide-default-footer
                                >
                                    <template v-slot:item.percentage="{ item }">
                                        {{
                                            (
                                                (item.count * 100) /
                                                anos.subtotal
                                            ).toFixed(2)
                                        }}&nbsp;%
                                    </template>
                                </v-data-table>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import GlunUploader from '../../components/glun/GlunUploader.vue';

export default {
    components: { GlunUploader },
    data() {
        return {
            headersByCode: [
                {
                    text: 'Ano',
                    value: 'anoCode',
                    align: 'center'
                },
                {
                    text: 'Nb',
                    value: 'count',
                    align: 'center'
                },
                {
                    text: '%',
                    value: 'percentage',
                    align: 'center',
                    sortable: false
                }
            ],
            headersByOrigine: [
                {
                    text: 'Origine',
                    value: 'origineCode',
                    align: 'left'
                },
                {
                    text: 'Nb',
                    value: 'count',
                    align: 'center'
                },
                {
                    text: '%',
                    value: 'percentage',
                    align: 'center',
                    sortable: false
                }
            ],
            headersByDirection: [
                {
                    text: 'Direction',
                    value: 'directionCode',
                    align: 'center'
                },
                {
                    text: 'Nb',
                    value: 'count',
                    align: 'center'
                },
                {
                    text: '%',
                    value: 'percentage',
                    align: 'center',
                    sortable: false
                }
            ],
            headersBySip: [
                {
                    text: 'Direction',
                    value: 'directionCode',
                    align: 'center'
                },
                {
                    text: 'SIP',
                    value: 'sipName',
                    align: 'left'
                },
                {
                    text: 'Nb',
                    value: 'count',
                    align: 'center'
                },
                {
                    text: '%',
                    value: 'percentage',
                    align: 'center',
                    sortable: false
                }
            ],
            glun: [],
            glunCount: 0,
            selectedAno: 'total',
            anos: {
                total: 0,
                subtotal: 0,
                byCode: [],
                byOrigine: [],
                byDirection: [],
                bySip: []
            },
            maps: {
                anos: {},
                origines: {},
                directions: {},
                sips: {}
            }
        };
    },
    methods: {
        handleInput(uploadedGlun) {
            this.glunCount++;
            this.anos.total += uploadedGlun.length;
            this.glun = this.glun.concat(uploadedGlun);

            this.anos.byCode = [];
            this.maps.anos = {};

            this.glun.forEach(declaration => {
                if (!declaration.ano_ir && !declaration.ano_fip) {
                    declaration.ano_ir = 'Code inconnu';
                    declaration.ano_fip = 'Code inconnu';
                }

                const anoCode = declaration.ano_ir || declaration.ano_fip;

                // Comptage par type d'ano
                if (!this.maps.anos.hasOwnProperty(anoCode)) {
                    this.maps.anos[anoCode] = Object.keys(
                        this.maps.anos
                    ).length;
                    this.anos.byCode.push({
                        anoCode,
                        count: 0
                    });
                }
                this.anos.byCode[this.maps.anos[anoCode]].count++;
            });
            this.getStatsByAno();
        },
        selectAno(ano) {
            this.selectedAno = ano.anoCode;
            this.getStatsByAno(ano.anoCode);
        },
        getStatsByAno(ano = 'total') {
            let declarationsPool;

            this.anos.byDirection = [];
            this.anos.bySip = [];
            this.anos.byOrigine = [];
            this.maps.directions = {};
            this.maps.sips = {};
            this.maps.origines = {};

            if (ano === 'total') {
                declarationsPool = this.glun;
            } else {
                declarationsPool = this.glun.filter(decla => {
                    return decla.ano_ir == ano || decla.ano_fip == ano;
                });
            }

            this.anos.subtotal = declarationsPool.length;

            declarationsPool.forEach(declaration => {
                let origineCode;
                const directionCode = declaration.dsf;
                const sipName = declaration.libelle_ci;

                // Comptage par origine
                switch (declaration.saisie) {
                    case 'G E S T P A R T':
                        origineCode = 'Gestpart';
                        break;
                    case 'E D I':
                        origineCode = 'EDI-IR';
                        break;
                    case 'I L I A D':
                        origineCode = 'Iliad';
                        break;
                    case 'I N T E R N E T':
                        origineCode = 'Télé-IR';
                        break;
                }
                if (!this.maps.origines.hasOwnProperty(origineCode)) {
                    this.maps.origines[origineCode] = Object.keys(
                        this.maps.origines
                    ).length;
                    this.anos.byOrigine.push({
                        origineCode,
                        count: 0
                    });
                }
                this.anos.byOrigine[this.maps.origines[origineCode]].count++;

                // Comptage par direction
                if (!this.maps.directions.hasOwnProperty(directionCode)) {
                    this.maps.directions[directionCode] = Object.keys(
                        this.maps.directions
                    ).length;
                    this.anos.byDirection.push({
                        directionCode,
                        count: 0
                    });
                }
                this.anos.byDirection[this.maps.directions[directionCode]]
                    .count++;

                // Comptage par SIP
                if (!this.maps.sips.hasOwnProperty(sipName)) {
                    this.maps.sips[sipName] = Object.keys(
                        this.maps.sips
                    ).length;
                    this.anos.bySip.push({
                        directionCode,
                        sipName,
                        count: 0
                    });
                }
                this.anos.bySip[this.maps.sips[sipName]].count++;
            });
        }
    },
    mounted() {
        this.$store.commit('help/set', []);
    }
};
</script>
