import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { signify } from 'react-signify';
import Home from './pages/Home';
import Sub from './pages/Sub';

export const sCount = signify(0);

export default function App() {
    return <BrowserRouter>
        <div>
            <Link to={'/'} data-testid="home-nav">Home</Link>
            <Link to={'sub'} data-testid="sub-nav">Sub</Link>
        </div>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='sub' element={<Sub />} />
        </Routes>
    </BrowserRouter>
}