import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Reports from './pages/Reports';
import VulnerabilityDetail from './pages/VulnerabilityDetail';
import AIAgent from './pages/AIAgent';
import Targets from './pages/Targets';
import N8NWorkflows from './pages/N8NWorkflows';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="agent" element={<AIAgent />} />
                    <Route path="targets" element={<Targets />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="vulnerabilities/:id" element={<VulnerabilityDetail />} />
                    <Route path="n8n" element={<N8NWorkflows />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
