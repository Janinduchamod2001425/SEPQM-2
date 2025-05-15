const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173", // Frontend URL
        env: {
            apiUrl: "http://localhost:5001/api", // Backend API URL (adjust port as needed)
        },
        setupNodeEvents(on, config) {
           
        },
    },
});