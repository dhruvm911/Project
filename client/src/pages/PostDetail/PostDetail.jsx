import React , {useContext, useEffect, useState} from 'react'
import PostAuthor from '../../components/PostAuthor'
import { Link, useParams } from 'react-router-dom'
import Thumbnail from '../../assets/blog22.jpg'
import styles from '../../components/styles.module.css'
import Loader from '../../components/Loader'
import DeletePost from '../DeletePost/DeletePost'
import { UserContext } from '../../context/userContext'
import axios from 'axios'

const PostDetail = () => {
    const {id} = useParams()
    const [post,setPost] = useState(null)
    const [creatorID,setCreatorID] = useState(null)
    const [error,setError] = useState(null)
    const [isLoading,setIsLoading] = useState(false)

    const {currentUser} = useContext(UserContext)

    useEffect(() => {
        const getPost = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
                setPost(response.data)
                setCreatorID(response.data.creator)
            } catch (error) {
                setError(error)
            }
            setIsLoading(false)
        }
        getPost();
    }, [])

    if(isLoading) {
        return <Loader/>
    }

    return (
        <section className={styles.post_detail}>
            {error && <p className='error'>{error}</p>}
            {post && <div className={`${styles.container} ${styles.post_detail_container}`}>
                <div className={styles.post_detail_header}>
                    <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
                    {currentUser?.id == post?.creator && <div className={styles.post_detail_buttons}>
                        <Link to={`/posts/${post?._id}/edit`} className={`${styles.btn} ${styles.sm} ${styles.primary}`} >Edit</Link>
                        <DeletePost postId={id}/>
                    </div>}
                </div>
                <h1>{post.title}</h1>
                <div className={styles.post_detail_thumbnail}>
                    <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                </div>
                <p dangerouslySetInnerHTML={{__html: post.description}}></p>
            </div>}
            
        </section>
    )
}

export default PostDetail
