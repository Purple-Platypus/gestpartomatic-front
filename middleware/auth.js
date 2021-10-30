import axios from 'axios';

export default function({ store, redirect }) {
    if (!store.state.auth._id) {
        return axios
            .get(`/api/users/me?withTeamsAndBoards=true`)
            .then(reponse => {
                store.commit('auth/set', reponse.data);
            })
            .catch(err => {
                console.log(err);
                if (err.status !== 401) {
                    redirect('/auth/login?error=401');
                } else {
                    axios
                        .get('/api/auth/refresh', {
                            headers: {
                                'cache-control': 'no-cache'
                            }
                        })
                        .then(() => {
                            axios
                                .get(`/api/users/me?withTeamsAndBoards=true`)
                                .then(reponse => {
                                    store.commit('auth/set', reponse.data);
                                })
                                .catch(err => {
                                    console.log(err);
                                    redirect('/auth/login?error=500');
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            redirect('/auth/login?error=500');
                        });
                }
            });
    }
}
