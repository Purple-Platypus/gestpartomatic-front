<template>
    <v-menu
        attach="#todo-list"
        class="inside-todo-list"
        :close-on-content-click="false"
        :value="isOpen"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                @click="open"
                :color="time ? '' : 'grey'"
                small
                v-bind="attrs"
                text
                v-on="on"
            >
                <v-icon left>
                    mdi-calendar
                </v-icon>
                <span v-if="time">
                    {{ displayDatetime.short }}
                </span>
                <span v-else>
                    Pas de date
                </span>
            </v-btn>
        </template>

        <v-card>
            <v-card-title
                class="py-2 primary white--text text-h6 font-weight-regular"
            >
                {{ displayDatetime.long }}
            </v-card-title>
            <v-window v-model="step">
                <v-window-item :value="1">
                    <v-date-picker
                        @change="step = 2"
                        first-day-of-week="1"
                        locale="fr-fr"
                        v-model="date"
                        no-title
                    ></v-date-picker>
                </v-window-item>

                <v-window-item :value="2">
                    <v-time-picker
                        format="24hr"
                        locale="fr-fr"
                        v-model="time"
                        no-title
                    ></v-time-picker>
                </v-window-item>
            </v-window>
            <v-card-actions>
                <v-btn @click="step = 1" icon v-if="step == 2">
                    <v-icon>
                        mdi-chevron-left
                    </v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="step = 2" icon v-if="step == 1">
                    <v-icon>
                        mdi-chevron-right
                    </v-icon>
                </v-btn>
                <v-btn
                    @click="validate"
                    color="primary"
                    depressed
                    :disabled="!date || !time"
                >
                    Valider
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
export default {
    name: 'datetime-picker',
    props: {
        datetime: {
            type: String,
            default: function() {
                console.log('ppp');
                return new Date().toISOString();
            }
        }
    },
    data() {
        return {
            isOpen: false,
            step: 1,
            date: this.setDate(this.datetime),
            time: this.setTime(this.datetime)
        };
    },
    computed: {
        displayDatetime() {
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

            const date = new Date(this.date);
            const displayShortDate = date.toLocaleDateString(
                'fr-fr',
                optionsShort
            );
            const displayLongDate = date.toLocaleDateString(
                'fr-fr',
                optionsLong
            );
            const displayTime = this.time ? ' à ' + this.time : '';
            return {
                short: displayShortDate + displayTime,
                long: displayLongDate + displayTime
            };
        }
    },
    methods: {
        setDate(isoDate) {
            const dateToFormat = isoDate ? isoDate : new Date().toISOString();
            const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
            const dateString = new Date(
                Date.parse(dateToFormat) - timeZoneOffset
            )
                .toISOString()
                .substring(0, 10);
            return dateString;
        },
        setTime(isoDate) {
            if (!isoDate) {
                return null;
            }
            const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
            const timeString = new Date(Date.parse(isoDate) - timeZoneOffset)
                .toISOString()
                .substring(11, 16);
            return timeString;
        },
        open() {
            this.isOpen = true;
        },
        validate() {
            this.$emit('input', this.date + 'T' + this.time + ':00+02:00');
            this.isOpen = false;
            window.setTimeout(() => {
                this.step = 1;
            }, 500);
        }
    }
};
</script>
