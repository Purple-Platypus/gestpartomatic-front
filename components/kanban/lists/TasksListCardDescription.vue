<template>
    <div>
        <v-runtime-template :template="parsedDescription" />
    </div>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';
import { mapState } from 'vuex';
import Markdown from '../../commons/mixins/Markdown.mixin';

export default {
    name: 'tasks-list-card-description',
    mixins: [Markdown],
    components: { VRuntimeTemplate },
    props: {
        taskId: Number
    },
    data() {
        return {};
    },
    computed: {
        description() {
            return this.tasks[this.taskId].description;
        },
        parsedDescription() {
            return this.mdInput(this.description);
        },
        ...mapState('boards', ['tasks'])
    },
    methods: {
        clickCheckbox(e) {
            const nthCheckbox = e.target.attributes.num.value;
            const checkboxChecked = e.target.checked;
            const updatedDescription = this.setNthCheckbox(
                +nthCheckbox,
                checkboxChecked
            );
            this.$emit('update', updatedDescription);
        },
        setNthCheckbox(n, checked) {
            const checkboxValue = checked ? '[X]' : '[ ]';
            let nth = 0;

            const updatedDescription = this.description.replace(
                /\[[\sx]\]/gi,
                match => {
                    nth++;
                    return nth === n ? checkboxValue : match;
                }
            );
            return updatedDescription;
        }
    }
};
</script>
