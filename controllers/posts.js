
import mongoose from 'mongoose'
import PostMessage from '../model/postMessage.js'

export const getPost = async (req,res) => {

    const { page } = req.query

    const { id } = req.params;

    try {

        const LIMIT = 8
        const startIndex = (Number(page)-1) * LIMIT // get the starting index of every page
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex)

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)})
    }catch (error) {
        res.status(404).json({ message: error.message})
    }
}

export const getSinglePost = async (req,res) => {
    const { id } = req.params
    try {
        const post = await PostMessage.findById(id)

        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({message: error})
    }
}

export const getPostsBySearch = async (req,res) => {
    const { searchQuery, tags } = req.query 
    
    try {
        const title = new RegExp(searchQuery, 'i') // i means ignore case

        const posts = await PostMessage.find({$or: [ { title }, { tags: { $in: tags.split(',')}} ]}).sort({'likes':1})


        // console.log(posts)
        res.json({data: posts})
    } catch(error){
        res.status(404).json({ message: error})
    }
}

export const createPost = async (req,res) => {
    const post = req.body;

    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString()})
    // console.log('new post')
    // console.log(newPost)

    try {
        await newPost.save()
        res.status(201).json({newPost})
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req,res) => {
    const { id: _id} = req.params
    const post = req.body

    //check if the given id exist in the post
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')


    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post,_id}, { new: true})

    res.json(updatedPost)

}

export const deletePost = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')

    await PostMessage.findByIdAndRemove(id)

    res.json({message: ' Post Deleted Succesfully'})

}


export const likePost = async(req, res) => {
    const { id } = req.params

    //as we call a middleware auth we will get req.userId
    if(!req.userId) return res.json({ message: 'Unauthenticated'})


    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')

    const post = await PostMessage.findById(id)

    //if user id already on the post or not
    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1){
        //it means id not in the post so can like the post
        //push the id in the liked list of the post
        post.likes.push(req.userId)
    } else {
        //will return the like list without the present user id
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    //just update the post
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true})

    res.json(updatedPost)
}

export const commentPost = async (req,res) => {
    const { id } = req.params
    const { value } = req.body

    const post = await PostMessage.findById(id)

    post.comments.push(value)

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true})

    res.json(updatedPost)

}