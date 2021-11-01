<template>
    <v-row>
        <v-col>
            <v-text-field
                dense
                hide-details=""
                label="Nouvelle étiquette"
                outlined
                v-model="formData.label"
                @keyup.enter="submit"
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
                <v-sheet class="pa-2 text-center" outlined>
                    <v-chip
                        class="mb-2"
                        :color="sampleColor"
                        :dark="isDarkBackground(sampleColor)"
                        small
                    >
                        {{ formData.label || 'Exemple' }}
                    </v-chip>
                    <v-color-picker
                        mode="hexa"
                        hide-inputs
                        hide-mode-switch
                        show-swatches
                        :swatches="colors"
                        v-model="formData.color"
                        @input="updateSampleColor"
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
            sampleColor: this.value.color,
            colors: [
                ['#FF3030', '#FF5722', '#FF9800'],
                ['#673AB7', '#9C27B0', '#E91E63'],
                ['#3F51B5', '#2196F3', '#00BCD4'],
                ['#009688', '#8BC34A', '#CDDC39'],
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
        },
        updateSampleColor(rgb) {
            this.sampleColor = rgb;
        },
        isDarkBackground(rgb) {
            rgb = rgb.replace('#', '');
            const r = parseInt(rgb.substr(0, 2), 16);
            const g = parseInt(rgb.substr(2, 2), 16);
            const b = parseInt(rgb.substr(4, 2), 16);
            const yiq = (r * 299 + g * 587 + b * 114) / 1000;
            return yiq < 150;
        },
        submit() {
            this.$emit('submit');
        }
    },
    watch: {
        formData: {
            handler(tag) {
                tag.isDark = this.isDarkBackground(tag.color);
                this.$emit('input', tag);
            },
            deep: true
        }
    }
};
</script>
