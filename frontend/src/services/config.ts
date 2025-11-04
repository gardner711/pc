// Environment configuration
// Task: T052-T053 - Implement environment configuration

interface Config {
    apiUrl: string
}

const config: Config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
}

export default config
