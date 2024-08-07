import React, { useEffect, useState } from "react";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import axios from "../axios.js";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
    const [data, setData] = useState()
    const [isLoading, setLoading] = useState(true)
    const {id} = useParams()


    useEffect(() => {
        axios.get(`/posts/${id}`)
            .then((res) => {
                setData(res.data)
                setLoading(false)
            })
            .catch((er) => {
                console.warn(er)
                alert("Ma'lumotlarni yuklashda xatolik!!")
            })
    }, [])

    if (isLoading) {
        return <Post isLoading={isLoading} />;
    }

    if (!data) {
        return null; // or some error message or component
    }

    return (
        <>
            <Post
                _id={data._id}
                title={data.title}
                photo={data.photo ? `http://localhost:5555/${data.photo}` : ''}
                author={data.author}
                createdAt={data.createdAt}
                viewsCount={data.views}
                commentsCount={data.comments?.length || 0}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown>{data.description}</ReactMarkdown>
            </Post>
            <CommentsBlock
                items={[
                    {
                        user: {
                            fullName: "Вася Пупкин",
                            avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                        },
                        text: "Это тестовый комментарий 555555",
                    },
                    {
                        user: {
                            fullName: "Иван Иванов",
                            avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                        },
                        text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                    },
                ]}
                isLoading={false}
            >
                <Index />
            </CommentsBlock>
        </>
    );
};
