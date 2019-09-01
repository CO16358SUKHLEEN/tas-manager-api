const mg = require('mongoose')

const taskSchema = new mg.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
        
     
}, 
completed: {
    type: Boolean,
    default: false
},
owner: {
    type: mg.Schema.Types.ObjectId,
    required: true, 
    ref: 'User'
}
}, {
    timestamps: true
})   

const Tasks = mg.model('Tasks', taskSchema)
module.exports = Tasks
