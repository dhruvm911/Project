import React, {useState, useContext, useEffect} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import styles from '../../components/styles.module.css'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Uncategorized')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('') 
    const [error,setError] = useState('')
    const navigate = useNavigate();
    const {currentUser} = useContext(UserContext)
    const token = currentUser?.token;

    //redirect to login page for any user who isn't logged in
    useEffect(() => {
        if(!token) {
            navigate('/login')
        }
    }, [token,navigate])

    const modules = {
        toolbar: [
            [{ 'header': [1, 2,3, 4,5,6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean'] 
        ],
    }
    const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
    ]

    const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment",
    "Uncategorized", "Weather"]

    const createPost = async (e) => {
        e.preventDefault();

        const postData = new FormData();
        postData.set('title',title)
        postData.set('category',category)
        postData.set('description',description)
        postData.set('thumbnail',thumbnail)

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`,postData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
            if(response.status == 201) {
                return navigate('/')
            }
        } catch (error) {
            // setError(error.response.data.message)
            setError(error.response?.data?.message || 'An error occurred');
            console.error('Error creating post:', error);
        }
    }

    return (
        <section className={styles.create_post}>
            <div className={styles.container}>
                <h2>Create Post</h2>
                {error && <p className={styles.form_error_message}>{error}</p>}
                <form className={`${styles.form} ${styles.create_post_form}`} onSubmit={createPost}>
                    <input type='text' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                    <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
                        {
                            POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
                        }
                    </select>
                    <ReactQuill className={styles.q1_editor} modules = {modules} formats={formats} value={description} onChange={setDescription} />
                    <input type="file" onChange={e => setThumbnail (e.target.files[0])} accept='png, jpg, jpeg' />
                    <button type="submit" className={`${styles.btn} ${styles.primary}`} >Create</button>

                </form>
            </div>
        </section>
    )
}

export default CreatePost
