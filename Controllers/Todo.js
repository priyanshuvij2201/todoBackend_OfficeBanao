const pool = require('../config/db');
const { getPagination, getPagingData } = require('../utils/pagination');
const supportedImageTypes = ['image/jpeg', 'image/png'];
const maxImageSize = 200 * 1024;
const cloudinary = require('cloudinary').v2;

// Create a todo note
exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = await pool.query("INSERT INTO todo (title, description) VALUES ($1, $2) RETURNING *", [title, description]);
        res.status(201).json({ success: true, message: "Todo created successfully", todo: newTodo.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Failed to create todo" });
    }
};

// Get all todo notes
exports.getTodos = async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.status(200).json({ success: true, todos: allTodos.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Failed to retrieve todos" });
    }
};

// Get all todo notes with pagination
exports.getTodosWithPagination = async (req, res) => {
    try {
        const { page = 2, size = 10 } = req.query;
        const { limit, offset } = getPagination(page, size);
        const allTodos = await pool.query("SELECT * FROM todo LIMIT $1 OFFSET $2", [limit, offset]);
        const totalItemsResult = await pool.query("SELECT COUNT(*) AS count FROM todo");
        const totalItems = parseInt(totalItemsResult.rows[0].count, 10);
        const response = getPagingData(allTodos, page, limit, totalItems);
        res.status(200).json({ success: true, ...response });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Failed to retrieve todos with pagination" });
    }
};

// Update todo notes
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updatedTodo = await pool.query("UPDATE todo SET title = $1, description = $2 WHERE todo_id = $3 RETURNING *", [title, description, id]);
        if (updatedTodo.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }
        res.status(200).json({ success: true, message: "Todo updated successfully", todo: updatedTodo.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Failed to update todo" });
    }
};

// Delete todo notes
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1 RETURNING *", [id]);
        if (deletedTodo.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }
        //soft delete 
        await pool.query(
            "INSERT INTO deleted_todo (todo_id, title, description, image_url) VALUES ($1, $2, $3, $4)",
            [id, deletedTodo.rows[0].title, deletedTodo.rows[0].description, deletedTodo.rows[0].image_url]
        );
        res.status(200).json({ success: true, message: "Todo deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Failed to delete todo" });
    }
};

// Upload image using cloudinary
exports.uploadImage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.files || !req.files.thumbnailImage) {
            return res.status(400).json({ success: false, message: "No image file provided." });
        }
        const thumbnail = req.files.thumbnailImage;
        console.log(thumbnail)
        if (!supportedImageTypes.includes(thumbnail.mimetype)) {
            return res.status(400).json({ success: false, message: 'Unsupported image file type.' });
        }
        if (thumbnail.size > maxImageSize) {
            return res.status(400).json({ success: false, message: 'Image size exceeds the maximum allowed size (200 KB).' });
        }
        let path=__dirname+"/files/"+Date.now()+`.${thumbnail.name.split('.')[1]}`
            thumbnail.mv(path,(err)=>{
                console.log(err);
            })
        const result = await cloudinary.uploader.upload(path, {
            use_filename: true,
            unique_filename: false
        });
        const imageUrl = result.secure_url;
        const imageUpload = await pool.query("UPDATE todo SET image_url = $1 WHERE todo_id = $2", [imageUrl, id]);
        res.status(200).json({ success: true, message: "Image uploaded successfully", imageUrl: imageUrl });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to upload image to Cloudinary.',
            error: err.message
        });
    }
    };

//create multiple to do notes
exports.createMultipleTodos = async (req, res) => {
    try {
        const todos = req.body;
        const todoValues = todos.map((_, index) => `($${index * 2 + 1}, $${index * 2 + 2})`).join(", ");
        const params = todos.flatMap(todo => [todo.title, todo.description]);
        const newTodos = await pool.query(`INSERT INTO todo (title, description) VALUES ${todoValues} RETURNING *`, params);
        res.status(201).json({ success: true, todos: newTodos.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Error creating multiple todos");
    }
};
