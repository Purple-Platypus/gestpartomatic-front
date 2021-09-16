<template>
    <uploader
        accept="text/csv"
        @change="handleUpload"
        :depressed="depressed"
        :color="color"
        :outlined="outlined"
        :small="small"
    >
        <slot></slot>
    </uploader>
</template>

<script>
import Uploader from '../commons/Uploader.vue';

export default {
    components: { Uploader },
    props: ['color', 'depressed', 'outlined', 'small'],
    data() {
        return {
            titles: [
                'position',
                'nature',
                'required',
                'label',
                'description',
                'a',
                'c',
                'db_column',
                'comment'
            ]
        };
    },
    methods: {
        handleUpload(fileContent) {
            this.parseCSV(fileContent);
        },

        parseCSV(csv) {
            const definitionsArray = this.csv2Array(csv);
            definitionsArray.shift();

            const trimedDefinitionsArray = definitionsArray.filter(
                property => property.length > 1
            );

            const definitionsObject = trimedDefinitionsArray.map(item => {
                return this.csvLine2Object(item);
            });

            this.$emit('input', definitionsObject);
        },

        csv2Array(csv) {
            var pattern = new RegExp(
                '(\\;|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\;\\r\\n]*))',
                'gi'
            );

            var rows = [[]];
            var matches = false;
            while ((matches = pattern.exec(csv))) {
                var matched_delimiter = matches[1];
                if (matched_delimiter.length && matched_delimiter !== ';') {
                    rows.push([]);
                }
                var matched_value;
                if (matches[2]) {
                    matched_value = matches[2].replace(
                        new RegExp('""', 'g'),
                        '"'
                    );
                } else {
                    matched_value = matches[3];
                }
                rows[rows.length - 1].push(matched_value);
            }
            return rows;
        },

        csvLine2Object(csvLine) {
            const csvLineAsObject = {};
            csvLine.forEach((propertyValue, index) => {
                const key = this.titles[index];

                switch (key) {
                    case 'position':
                        csvLineAsObject[key] = ~~propertyValue;
                        break;
                    case 'nature':
                        const type =
                            propertyValue.substring(0, 1) == 'X'
                                ? 'STRING'
                                : 'INT';
                        const length = propertyValue.split(/(\(|\))/);
                        csvLineAsObject.nature = type;
                        csvLineAsObject.length = ~~length[2];
                        break;
                    case 'required':
                        csvLineAsObject[key] = propertyValue == 'O';
                        break;
                    case 'a':
                        csvLineAsObject[key] = propertyValue == 'A';
                        break;
                    case 'c':
                        csvLineAsObject[key] = propertyValue == 'C';
                        break;
                    case 'label':
                    case 'description':
                    case 'db_column':
                    case 'comment':
                        csvLineAsObject[key] = propertyValue;
                        break;
                }
            });
            return csvLineAsObject;
        }
    }
};
</script>
