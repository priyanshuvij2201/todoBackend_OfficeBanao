const { createTodoSchema, updateTodoSchema, idSchema } = require('../validation/todoValidation');

function validateTodoCreation(req, res, next) {
    const { error } = createTodoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

function validateTodoUpdate(req, res, next) {
    const { error } = updateTodoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

function validateId(req, res, next) {
    const { error } = idSchema.validate(req.params.id);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = {
    validateTodoCreation,
    validateTodoUpdate,
    validateId
};