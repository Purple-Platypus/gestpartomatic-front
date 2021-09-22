<template>
    <file-reader
        accept="text/csv"
        @change="handleUpload"
        :depressed="depressed"
        :color="color"
        :outlined="outlined"
        :small="small"
    >
        <slot></slot>
    </file-reader>
</template>

<script>
import Papa from 'papaparse';
import FileReader from '../commons/FileReader.vue';

export default {
    components: { FileReader },
    props: ['color', 'depressed', 'outlined', 'small'],
    data() {
        return {
            titlesMap: {
                'Pos.': 'position',
                Nature: 'nature',
                'O/F': 'required',
                Libellé: 'label',
                Observation: 'description',
                A: 'a',
                C: 'c',
                'Donnée en base': 'db_column',
                Commentaire: 'comment'
            }
        };
    },
    methods: {
        handleUpload(fileContent) {
            Papa.parse(fileContent, {
                skipEmptyLines: true,
                escapeChar: '"',
                header: true,
                transformHeader: this.formatTitle,
                transform: this.formatData,
                complete: res => {
                    res.data.map(def => {
                        console.log(def);
                        const type =
                            def.nature.substring(0, 1) == 'X'
                                ? 'STRING'
                                : 'INT';
                        const length = def.nature.split(/(\(|\))/);

                        def.nature = type;
                        def.length = ~~length[2];
                    });

                    this.$emit('input', res.data);
                }
            });
        },
        formatTitle(title) {
            return this.titlesMap[title];
        },
        formatData(data, key) {
            let formattedValue;
            switch (key) {
                case 'position':
                    formattedValue = ~~data;
                    break;
                case 'required':
                    formattedValue = data == 'O';
                    break;
                case 'a':
                    formattedValue = data == 'A';
                    break;
                case 'c':
                    formattedValue = data == 'C';
                    break;
                default:
                    formattedValue = data.trim();
                    break;
            }

            return formattedValue;
        }
    }
};
</script>
