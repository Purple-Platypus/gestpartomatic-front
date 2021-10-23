<template>
    <v-row>
        <v-col>
            <v-text-field
                dense
                hide-details=""
                label="Nouvelle étiquette"
                outlined
                v-model="formData.label"
            />
        </v-col>
        <v-col class="flex-grow-0 d-flex align-center px-0">
            <v-menu
                content-class="elevation-0"
                :close-on-content-click="false"
                offset-y
                z-index="9"
                v-model="isColorPickerVisible"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-avatar
                        class="cursor-pointer"
                        :color="formData.color"
                        size="20"
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-sheet class="pa-2" outlined>
                    <v-color-picker
                        mode="hexa"
                        hide-inputs
                        hide-mode-switch
                        show-swatches
                        :swatches="colors"
                        v-model="formData.color"
                    />
                    <div class="px-2 text-right">
                        <v-btn depressed @click="hideColorPicker">
                            Valider
                        </v-btn>
                    </div>
                </v-sheet>
            </v-menu>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'tag-form',
    props: {
        value: {
            default: () => {
                return {
                    label: '',
                    color: '#2196F3'
                };
            }
        }
    },
    data() {
        return {
            formData: {
                label: this.value.label,
                color: this.value.color
            },
            colors: [
                ['#E91E63', '#9C27B0', '#673AB7'],
                ['#3F51B5', '#2196F3', '#00BCD4'],
                ['#009688', '#8BC34A', '#CDDC39'],
                ['#FFC107', '#FF9800', '#FF5722'],
                ['#795548', '#607D8B', '#9E9E9E']
            ],
            isColorPickerVisible: false
        };
    },
    methods: {
        showColorPicker() {
            this.isColorPickerVisible = true;
        },
        hideColorPicker() {
            this.isColorPickerVisible = false;
        }
    },
    watch: {
        formData: {
            handler(tag) {
                this.$emit('input', tag);
            },
            deep: true
        }
    }
};
</script>
