const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        supportFile: 'cypress/support/e2e.js',
        baseUrl: 'http://localhost:5173', // Adjust to your app's URL
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            // Optional: Add backend URL as env variable
            config.env.API_URL = 'http://localhost:5001/api'
            return config
        }
    },
})