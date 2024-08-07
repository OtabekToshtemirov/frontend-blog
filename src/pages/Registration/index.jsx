import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth.js";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import styles from './Login.module.scss';

export const Registration = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            fullName: 'Oybek',
            email: 'oybek95@gmail.com',
            password: '12345'
        },
        mode: "onChange",
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values));

        if (!data.payload) {
            alert("Siz ro'yxatdan o'tmagansiz!");
            return;
        }

        if (data.payload && 'token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    }

    if (isAuth) {
        return <Navigate to='/' />;
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Создание аккаунта
            </Typography>
            <div className={styles.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    type="text"
                    className={styles.field}
                    label="Полное имя"
                    fullWidth
                    error={Boolean(errors.fullname)}
                    helperText={errors.fullname?.message}
                    {...register('fullname', { required: 'Ismingizni yozing...' })}
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    fullWidth
                    type="email"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    {...register('email', { required: 'Pochta manzilingizni yozing...' })}
                />
                <TextField
                    type="password"
                    className={styles.field}
                    label="Пароль"
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    {...register('password', { required: 'Parolingizni yozing...' })}
                />
                <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};
