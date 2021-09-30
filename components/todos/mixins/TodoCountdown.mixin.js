export default {
    data() {
        return {
            progress: {
                key: null,
                value: 0,
                countdown: null,
                color: null
            }
        };
    },
    methods: {
        setCountDown(color, callback) {
            const delay = 2000;
            const randomKey = Math.random()
                .toString(36)
                .substring(5);

            this.progress.value = 10000 / delay;
            this.progress.key = randomKey;
            this.progress.color = color;

            this.progress.countdown = window.setInterval(() => {
                this.progress.value += 2000 / delay;
            }, 20);

            window.setTimeout(() => {
                // Vérification qu'un nouveau timeout n'a pas été déclenché par click successifs
                if (this.progress.key == randomKey) {
                    callback();
                    this.stopCountdown();
                }
            }, delay);
        },
        stopCountdown() {
            this.progress.value = 0;
            this.progress.key = null;
            this.progress.color = null;
            window.clearInterval(this.progress.countdown);
        }
    }
};
