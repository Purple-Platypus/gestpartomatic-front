<template>
    <v-form class="text-body-1 pb-0" @submit.prevent="submit">
        <v-row class="align-top mt-0 pb-1">
            <v-col class="flex-grow-0 pl-6">
                <v-icon color="primary">
                    {{ icon }}
                </v-icon>
            </v-col>

            <v-col class="flex-grow-1">
                <v-row>
                    <v-col class="pt-3 pb-0">
                        <v-textarea
                            auto-grow
                            class="input-description"
                            dense
                            hide-details
                            label="Description"
                            v-model="formData.description"
                            outlined
                            ref="inputDescription"
                            required
                            rows="2"
                            @keyup.ctrl.enter="submit"
                            @keyup.ctrl.delete="remove"
                            @keydown.ctrl.d.prevent.stop="showDatetimePicker"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="py-0 text-body-2">
                        <datetime-picker
                            attach="#todo-list"
                            v-model="formData.deadline"
                            :datetime="formData.deadline"
                            ref="datetimePicker"
                        />
                    </v-col>
                </v-row>
            </v-col>

            <v-col class="d-flex flex-column flex-grow-0 pl-1 pr-5">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            icon
                            :disabled="!formData.description"
                            fab
                            x-small
                            type="submit"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon size="24px">
                                mdi-check-circle
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>
                        Enregistrer <br />
                        <kbd class="mr-2">
                            Ctrl + Entrée
                        </kbd>
                    </span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-if="removable"
                            fab
                            color="error"
                            icon
                            x-small
                            @click="remove"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon size="24px">
                                mdi-delete-circle
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>
                        Supprimer <br />
                        <kbd class="mr-2">
                            Ctrl + Suppr
                        </kbd>
                    </span>
                </v-tooltip>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import DatetimePicker from '../commons/DatetimePicker.vue';
import TodoCountdown from './mixins/TodoCountdown.mixin';

export default {
    name: 'todo-list-form',
    components: { DatetimePicker },
    mixins: [TodoCountdown],
    props: {
        todoData: {
            type: Object,
            default: () => {
                return {
                    title: '',
                    description: '',
                    deadline: null
                };
            }
        },
        icon: {
            type: String,
            default: 'mdi-plus'
        },
        removable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                description: this.joinDescription(),
                deadline: this.todoData.deadline
            }
        };
    },
    methods: {
        joinDescription() {
            if (this.todoData.description) {
                return this.todoData.title + '\n' + this.todoData.description;
            }
            return this.todoData.title;
        },
        submit() {
            this.$emit('submit', this.formData);
        },
        remove() {
            this.$emit('remove', this.formData);
        },
        showDatetimePicker(e) {
            this.$refs.datetimePicker.open();
        }
    }
};
</script>

<style>
.input-description.v-textarea textarea {
    line-height: initial !important;
}
</style>
