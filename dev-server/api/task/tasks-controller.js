import User from '../../model/user-model';
import Task from '../../model/task-model';
import moment from 'moment';
const StringUtil = require('../utilities/string-util')

export function index(req, res) {
 // FIND ALL TASKS in database
 Task.find({}, (error, tasks) => {
    if (error) {
        return res.status(500).json();
    }
    return res.status(200).json({ tasks: tasks });
}).populate('author', 'username', 'user');
// Populate will find the author that created the task and add it to the task (username only)
}

export function create(req, res) {
    const id = auth.getUserId(req);
    User.findOne({ _id: id }, (error, user) => {
        if (error && !user) {
            return res.status(500).json();
        }
        // actually creating an object that will go into the database
        const task = new Task(req.body.task);
        task.author = user._id;
        task.dueDate = moment(task.dueDate);

        // this is how to save something to the database with mongoose
        task.save(error => {
            if (error) {
                return res.status(500).json();
            }
            return res.status(201).json();
        });
    });
}

export function update(req, res) {
    return res.status(204).json();
}

export function remove(req, res) {
    return res.status(204).json();
}

export function show(req, res) {
    return res.status(200).json();
}