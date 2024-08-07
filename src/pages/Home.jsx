import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from "../redux/slices/posts";

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.data);
    const { posts, tags } = useSelector(state => state.posts);
    const isPostLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        dispatch(fetchPosts(sortBy));
        dispatch(fetchTags());
    }, [dispatch, sortBy]);

    const handleSortChange = (event, newValue) => {
        setSortBy(newValue);
    };

    return (
        <>
            <Tabs
                style={{ marginBottom: 15 }}
                value={sortBy}
                onChange={handleSortChange}
                aria-label="basic tabs example"
            >
                <Tab label="Yangi" value="newest" />
                <Tab label="Mashhur" value="views" />
            </Tabs>
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
                        isPostLoading ?
                            (<Post key={index} isLoading={true} />) :
                            (<Post
                                    key={obj._id}
                                    _id={obj._id}
                                    title={obj.title}
                                    photo={obj.photo ? `http://localhost:5555/${obj.photo}` : ''}
                                    author={obj.author}
                                    createdAt={obj.createdAt}
                                    viewsCount={obj.views}
                                    commentsCount={3}
                                    tags={obj.tags}
                                    isEditable={userData?._id === obj.author._id}
                                    isLoading={isPostLoading}
                                />
                            ))}
                </Grid>
                <Grid item xs={4}>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'Вася Пупкин',
                                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Иван Иванов',
                                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
