import Rebase from 're-base'
import firebase from 'firebase'
import config from './config';
import Log from './log';


const app = firebase.initializeApp({
        // apiKey: config.firebase.API_KEY,
        // authDomain: config.firebase.AUTH_DOMAIN,
        databaseURL: config.firebase.DATABASE_URL
        // projectId: config.firebase.PROJECT_ID,
        // storageBucket: config.firebase.STORAGE_BUCKET,
        // messagingSenderId: config.firebase.MESSAGING_SENDER_ID
    });
const base = Rebase.createClass(app.database());

Log('base module loaded.');

export { base }
