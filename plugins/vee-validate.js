import { extend } from 'vee-validate';
import {
    required,
    email,
    confirmed,
    min,
    max,
    regex
} from 'vee-validate/dist/rules';

// MESSAGES
// Nom d'ultilisateur
extend('max_username', {
    ...max,
    message: "Votre nom d'utilisateur doit comporter 25 caractères au maximum."
});
extend('required_username', {
    ...required,
    message: "Merci d'indiquer votre nom d'utilisateur."
});
extend('format_username', {
    ...regex,
    message:
        "Votre nom d'utilisateur ne doit contenir que des lettres minuscules, des chiffres, des tirets, des points ou des underscores."
});
// Pseudo
extend('max_nickname', {
    ...max,
    message: 'Votre pseudo doit comporter 50 caractères au maximum.'
});
// Email
extend('required_email', {
    ...required,
    message: "Merci d'indiquer votre adresse mail."
});
extend('email', {
    ...email,
    message: "Hmmm... Cette adresse n'est pas valide."
});

// Mot de passe
extend('required_password', {
    ...required,
    message: "Merci d'indiquer votre mot de passe."
});
extend('min_password', {
    ...min,
    message: 'Votre mot de passe doit contenir au moins 3 caractères.'
});
extend('confirmed', {
    ...confirmed,
    message: 'Aïe ! La confirmation est différente du mot de passe.'
});
