// Rafraichissement du token JWT toutes les 10 minutes

export default async function({ $axios }) {
    function refreshToken() {
        return $axios
            .get('/api/auth/refresh', {
                withCredentials: true,
                headers: {
                    'cache-control': 'no-cache'
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    await refreshToken();
    const INTERVALLE_REFRESH = 10;
    setInterval(function() {
        refreshToken();
    }, INTERVALLE_REFRESH * 60 * 1000);
}
