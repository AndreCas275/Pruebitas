const path = require('path');
const rN = require('../helpers/libs')
const fs = require('fs-extra')
const modelos = require('../models')
const md5 = require('md5')
const sidebar = require('../helpers/sidebar');

const img = {};

img.index = async(req, res) => {
    let viewModel = { imagen: {}, comments: {} }
    const { image_id } = req.params;
    const imagen = await modelos.Image.findOne({ filename: { $regex: image_id } })
    if (imagen) {
        imagen.views += 1;
        viewModel.imagen = imagen
        await imagen.save()
        const comments = await modelos.Comment.find({ image_id: imagen._id })
        viewModel.comments = comments
        viewModel = await sidebar(viewModel);
        res.render('image', viewModel)
    } else {
        res.redirect('/')
    }
};
img.create = (req, res) => {
    const saveImage = async() => {
        const imgURL = rN.randomNumber()
        const images = await modelos.Image.find({ filename: imgURL })
        if (images.length > 0) {
            saveImage()
        } else {
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLocaleLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgURL}${ext}`)
            const { title_hbs, description_hbs } = req.body
            if (ext === '.jpg' || ext === '.png' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath)
                const newImg = new modelos.Image({
                    title: title_hbs,
                    description: description_hbs,
                    filename: imgURL + ext
                })
                const imgSaved = await newImg.save()
                res.redirect('/images/' + imgURL)
            } else {
                await fs.unlink(imageTempPath)
                res.send('Error imagen no valida')
            }
        }
    }
    saveImage()
};
img.like = async(req, res) => {
    const { image_id } = req.params;
    const imagen = await modelos.Image.findOne({ filename: { $regex: image_id } })
    if (imagen) {
        imagen.likes += 1;
        await imagen.save()
        res.json({ likes: imagen.likes })
    } else {
        res.status(400).json({ error: 'Internal Error' });
    }
};
img.comment = async(req, res) => {
    const { image_id } = req.params;
    const imagen = await modelos.Image.findOne({ filename: { $regex: image_id } })
    if (imagen) {
        const newComment = new modelos.Comment(req.body);
        newComment.gravatar = md5(newComment.email)
        newComment.image_id = imagen._id
        await newComment.save()
        res.redirect('/images/' + imagen.uniqueId)
    } else {
        res.redirect('/')
    }
};
img.remove = async(req, res) => {
    const { image_id } = req.params;
    const imagen = await modelos.Image.findOne({ filename: { $regex: image_id } })
    if (imagen) {
        await fs.unlink(path.resolve('./src/public/upload/' + imagen.filename))
        await modelos.Comment.deleteMany({ image_id: imagen._id })
        await imagen.remove();
        res.json(true)
    } else {
        res.redirect('/')
    }
};

module.exports = img;