const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    topic: {type: String, required: [true, 'topic is required']}, 
    title: {type: String, required: [true, 'title is required']},
    host: {type: Schema.Types.ObjectId, ref:'User'},
    description: {type: String, required: [true, 'description is required'], 
    minLength: [10, 'the content should have at least 10 characters']},
    location: {type: String, required: [true, 'location is required']}, 
    date: {type: String, required: [true, 'date is required']},
    start: {type: String, required: [true, 'Start time is required']},
    end: {type: String, required: [true, 'End time is required']},
    imageURL: {type: String, required: [true, 'image URL is required']},
},
{timestamps: true}
);
//collection name is connections in the database
module.exports = mongoose.model('Connection', connectionSchema);

/*exports.getTopics = () => {
    topics = [];
    for(i=0; i < connections.length; i++){
        if(!topics.includes(connections[i].topic)){
        topics.push(connections[i].topic);
        }
    }
    return topics;     ----- This was moved into connection index.ejs, reformmated so it goes through all connections  */
