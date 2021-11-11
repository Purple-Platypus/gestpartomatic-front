<template>
    <v-menu :close-on-content-click="false" :value="isOpen">
        <template #activator="{ on: onMenu }">
            <v-tooltip bottom>
                <template #activator="{ on: onTooltip }">
                    <v-btn
                        color="grey darken-1"
                        :text="!!value"
                        :icon="!value"
                        v-on="{ ...onMenu, ...onTooltip }"
                        @click="open"
                    >
                        <v-icon :left="!!value" size="24">
                            mdi-calendar
                        </v-icon>
                        <span v-if="value">
                            {{ displayDate.short }}
                        </span>
                    </v-btn>
                </template>

                <span v-if="value">Modifier l'échéance </span>
                <span v-else> Ajouter une échéance </span>
            </v-tooltip>
        </template>

        <v-card>
            <v-card-title
                class="py-2 primary white--text text-h6 font-weight-regular"
            >
                {{ displayDate.long }}
            </v-card-title>
            <v-date-picker
                first-day-of-week="1"
                locale="fr-fr"
                v-model="date"
                no-title
            ></v-date-picker>
        </v-card>
    </v-menu>
</template>

<script>
export default {
    name: 'date-picker',
    props: {
        value: {
            type: String
        }
    },
    data() {
        return {
            isOpen: false
        };
    },
    computed: {
        displayDate() {
            const optionsShort = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            const optionsLong = {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };
            const date = this.date ? new Date(this.date) : new Date();
            const displayShortDate = date.toLocaleDateString(
                'fr-fr',
                optionsShort
            );
            const displayLongDate = date.toLocaleDateString(
                'fr-fr',
                optionsLong
            );

            return {
                short: displayShortDate,
                long: displayLongDate
            };
        },
        date: {
            get() {
                const date = this.value ? this.value.substring(0, 10) : '';
                return date;
            },
            set(date) {
                const isoDate = new Date(date + 'T23:59:00').toISOString();
                this.$emit('input', isoDate);
                this.isOpen = false;
            }
        }
    },
    methods: {
        open() {
            this.isOpen = true;
        }
    }
};
</script>
