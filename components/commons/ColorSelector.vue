<template>
    <v-menu max-width="150px" top v-model="show" v-bind:value="selectedColor">
        <template v-slot:activator="{ on, attrs }">
            <div class="py-2" v-bind="attrs" v-on="on">
                <v-avatar
                    size="22"
                    class="mr-2"
                    :class="selectedColor"
                ></v-avatar>
                {{ colorLabels[selectedColor] }}
            </div>
        </template>

        <v-sheet>
            <v-row class="ma-0">
                <v-col
                    cols="4"
                    class="align-center py-2 px-3"
                    v-for="color in colors"
                    :key="color"
                >
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-avatar
                                size="22"
                                class="ma-0"
                                :class="color"
                                v-bind="attrs"
                                v-on="on"
                                @click="selectColor(color)"
                            ></v-avatar>
                        </template>
                        <span>{{ colorLabels[color] }}</span>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-sheet>
    </v-menu>
</template>

<script>
export default {
    name: 'color-selector',
    props: ['value'],
    data() {
        return {
            show: false,
            colors: [
                'deep-orange',
                'pink',
                'purple',
                'indigo',
                'blue',
                'teal',
                'light-green',
                'lime',
                'yellow',
                'orange',
                'brown',
                'grey'
            ],
            colorLabels: {
                'deep-orange': 'Corail',
                pink: 'Rose',
                purple: 'Violet',
                indigo: 'Indigo',
                blue: 'Bleu',
                teal: 'Turquoise',
                'light-green': 'Vert',
                lime: 'Anis',
                yellow: 'Jaune',
                orange: 'Orange',
                brown: 'Marron',
                grey: 'Gris'
            },
            selectedColor: this.value
        };
    },
    methods: {
        selectColor(color) {
            this.$emit('input', color);
            this.selectedColor = color;
        },
        reset() {
            this.selectedColor = 'blue';
        }
    }
};
</script>
