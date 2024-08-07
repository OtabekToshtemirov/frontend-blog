import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth.js";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import axios from "../../axios.js";

export const AddPost = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const isAuth = useSelector(selectIsAuth)
    const [isLoading, setIsLoading] = useState(false)
    const [photo, setPhoto] = useState('')
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const inputFileRef = useRef(null)

    const isEditable = Boolean(id);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData()
            const file = event.target.files[0]
            formData.append('image', file)
            const {data} = await axios.post('/upload', formData)
            setPhoto(data.url)
        } catch (e) {
            console.error(e)
            alert("Faylni yuklashda xatolik!")
        }
    };

    const onClickRemoveImage = () => {
        setPhoto('')
    };

    const onChange = useCallback((description) => {
        setDescription(description);
    }, []);

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            const fields = {
                title,
                tags,
                description,
                photo
            };
            const { data } = isEditable ?
                await axios.patch(`/posts/${id}`, fields) :
                await axios.post('/posts', fields)
            const _id =isEditable ? id : data._id
            navigate(`/posts/${_id}`)
        } catch (e) {
            console.log(e)
            alert("Maqolani yaratishda xatolik!")
        }
    }
    useEffect(() => {
        if (id) {
            setIsLoading(true)
            axios.get(`/posts/${id}`)
                .then(({data}) => {
                    setTitle(data.title)
                    setTags(data.tags.join(','))
                    setDescription(data.description)
                    setPhoto(data.photo)
                    setIsLoading(false)
                })
                .catch((e) => {
                    console.error(e)
                    alert("Ma'lumotlarni yuklashda xatolik!")
                    setIsLoading(false)
                })
        }
    }, [id]);


    const options =  useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Matnni shu yerga yozing...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to={'/'}/>
    }

    const renderImage = (src) => {
        if (!src) return null;
        try {
            new URL(src); // Check if URL is valid
            return <img className={styles.image} src={src} alt="Uploaded"/>;
        } catch (e) {
            return null;
        }
    };

    return (
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Surat yuklash
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
            {photo && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        O'chirish
                    </Button>
                    {renderImage(`http://localhost:5555/${photo}`) || <div>No image available</div>}
                </>
            )}
            <br/>
            <br/>
            <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                classes={{root: styles.title}}
                variant="standard"
                placeholder="Maqola sarlavhasi..."
                fullWidth
            />
            <TextField
                classes={{root: styles.tags}}
                variant="standard"
                placeholder="Teglar"
                fullWidth
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <SimpleMDE className={styles.editor} value={description} onChange={onChange} options={options}/>
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEditable ? `Saqlash` :`E'lon qilish`}
                </Button>
                <a href="/">
                    <Button size="large">Bekor qilish</Button>
                </a>
            </div>
        </Paper>
    );
};
