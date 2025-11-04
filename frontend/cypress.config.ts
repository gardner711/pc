import { defineConfig } from 'cypress'

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        specPattern: 'tests/e2e/cypress/integration/**/*.spec.ts',
        supportFile: 'tests/e2e/cypress/support/e2e.ts',
        fixturesFolder: 'tests/e2e/cypress/fixtures',
        screenshotsFolder: 'tests/e2e/cypress/screenshots',
        videosFolder: 'tests/e2e/cypress/videos',
        viewportWidth: 1280,
        viewportHeight: 720,
    },
})
