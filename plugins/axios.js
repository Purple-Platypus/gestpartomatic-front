export default function({ $axios, redirect }) {
    $axios.onError(error => {
        // Si l'erreur ne concerne pas l'authentification, celle-ci est transmise vers le front
        if (error.response.status !== 401) {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }

        // Si erreur d'authentification, renvoi vers la page de login
        else {
            redirect('/auth/login');

            return new Promise((resolve, reject) => {
                reject(error);
            });
        }
    });
}
