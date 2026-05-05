let IS_PROD = false;
const server = IS_PROD ?
    "" :

    "http://localhost:8080"


export default server;