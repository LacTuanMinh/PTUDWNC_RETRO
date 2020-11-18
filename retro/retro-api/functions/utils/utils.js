module.exports = {
    port: 8000,

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
    },

    'facebook_key': '384191462701845', //Điền App ID của bạn vào đây
    'facebook_secret': '7bbf97a5f80aaf1e36a8c8d38ca2cb00', //Điền App Secret ở đây
    'callback_url': '/auth/facebook/callback',
}