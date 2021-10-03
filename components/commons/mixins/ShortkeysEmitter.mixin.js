export default {
    created: function() {
        window.addEventListener('keyup', this.handleShortkey);
    },
    destroyed: function() {
        window.removeEventListener('keyup', this.handleShortkey);
    },
    methods: {
        handleShortkey(e) {
            return;
        }
    }
};
