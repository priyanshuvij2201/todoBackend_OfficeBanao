const express = require('express');
const router = express.Router();
//use fileupload for a particular route 
const fileUpload = require('express-fileupload');


const { createTodo, getTodos, getTodosWithPagination, updateTodo, deleteTodo, createMultipleTodos,uploadImage } = require('../Controllers/todo');
const { validateTodoCreation, validateTodoUpdate, validateId } = require('../middleware/validation');


router.post('/todo', validateTodoCreation, createTodo);
router.get('/todo', getTodos);
router.get('/todo/page', getTodosWithPagination);
router.put('/todo/:id', validateTodoUpdate, validateId, updateTodo);
router.delete('/todo/:id', validateId, deleteTodo);
router.post('/todo/multiple', createMultipleTodos);
router.post('/todo/:id/image', fileUpload(), uploadImage)


module.exports = router;

