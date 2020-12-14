module.exports = {
    port : process.env.PORT,
    files : ["./**/*.{html.htm,css,js}"], //files that we are allowing our server to search for
    server : {
        baseDir : ["./src","./build/contracts"] //we need to setup this as heroku ll provide different port each time we ll run the application
    }



}