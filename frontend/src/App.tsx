import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/layout/Layout'
import CharactersPage from './pages/CharactersPage'
import CreateCharacterPage from './pages/CreateCharacterPage'
import EditCharacterPage from './pages/EditCharacterPage'

function HomePage() {
    return (
        <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Welcome to D&D 5e Character Creator
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                Create and manage your Dungeons & Dragons characters with ease.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                Full CRUD Complete! Browse, Create, Edit, and Delete characters.
            </p>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/characters" element={<CharactersPage />} />
                        <Route path="/characters/new" element={<CreateCharacterPage />} />
                        <Route path="/characters/:id/edit" element={<EditCharacterPage />} />
                    </Routes>
                </Layout>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default App