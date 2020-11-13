module.exports = {

    apiConfig: {
        apiKey: "AIzaSyBXcUvJ8n7MY0lDoKfvxtrZZ9tgUEEGPQ0",
        authDomain: "retro-database.firebaseapp.com",
        databaseURL: "https://retro-database.firebaseio.com",
        projectId: "retro-database",
        storageBucket: "retro-database.appspot.com",
    },

    secretKey: "outofsightoutofmind",

    hashRound: 10,

    isBlankString: (token) => {
        return token.trim().length === 0;
    }
}