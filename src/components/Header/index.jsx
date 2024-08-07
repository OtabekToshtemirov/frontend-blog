import React from 'react';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import {useDispatch, useSelector} from "react-redux";
import {logout, selectIsAuth} from "../../redux/slices/auth.js";

export const Header = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth)

    const onClickLogout = () => {
        if (window.confirm('Siz rostdan ham hisobdan chiqmoqchimisiz?')) {
            dispatch(logout())
        }
        window.localStorage.removeItem('token')
    }

    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                <div className={styles.inner}>
                    <Link className={styles.logo} to="/">
                        <div>OTABLOG</div>
                    </Link>
                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                <Link to="/add-post">
                                    <Button variant="contained">Maqola yaratish</Button>
                                </Link>
                                <Button onClick={onClickLogout} variant="contained" color="error">
                                    Hisobdan chiqish
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outlined">Kirish</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="contained">Hisob yaratish</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
