import Container from "@mui/material/Container/Container.js";
import {Header} from "./components/Header/index.jsx";
import {Home} from "./pages/Home.jsx";
import {FullPost} from "./pages/FullPost.jsx";
import {AddPost} from "./pages/AddPost/index.jsx";
import {Login} from "./pages/Login/index.jsx";
import {Registration} from "./pages/Registration/index.jsx";
import {Route, Routes} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {fetchAuthMe} from "./redux/slices/auth.js";


function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        if (window.localStorage.getItem('token')) {
            dispatch(fetchAuthMe());
        }
    }, [dispatch]);
    return (
        <>
            <Header/>
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts/:id" element={<FullPost />} />
                    <Route path="/add-post" element={<AddPost />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
