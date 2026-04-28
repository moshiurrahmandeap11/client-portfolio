"use client"
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../sharedComponents/AxiosInstance/AxiosInstance';

const AllBlogsPage = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const tryFetching = async () => {
            const res = await axiosInstance.get("/blogs");
            setBlogs(res.data.data);
        }
        tryFetching();
    }, [])
    return (
        <div>
            
        </div>
    );
};

export default AllBlogsPage;