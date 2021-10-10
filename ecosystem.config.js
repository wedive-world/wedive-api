module.exports = {
    apps: [{
        name: "api",
        script: "./index.js",
        watch: ["."],
        // Delay between restart
        watch_delay: 1000,
        ignore_watch: ["node_modules", "tmp", ".git"],
    }]
}