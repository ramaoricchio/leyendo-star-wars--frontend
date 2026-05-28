import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import Home from './pages/Home/Home';
import Timeline from './pages/Timeline/Timeline';
import ByYear from './pages/ByYear/ByYear';
import Collections from './pages/Collections/Collections';
import CollectionDetail from './pages/CollectionDetail/CollectionDetail';
import PublicationDetail from './pages/PublicationDetail/PublicationDetail';
import Reviews from './pages/Reviews/Reviews';
import ReviewDetail from './pages/ReviewDetail/ReviewDetail';
import Search from './pages/Search/Search';
import Admin from './pages/Admin/Admin';
import UserProfile from './pages/UserProfile/UserProfile';
import Login from './pages/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/por-anno" element={<ByYear />} />
            <Route path="/colecciones" element={<Collections />} />
            <Route path="/colecciones/:id" element={<CollectionDetail />} />
            <Route path="/publicaciones/:id" element={<PublicationDetail />} />
            <Route path="/resenas" element={<Reviews />} />
            <Route path="/resenas/:id" element={<ReviewDetail />} />
            <Route path="/buscar" element={<Search />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/perfil" element={<UserProfile />} />
          </Routes>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
