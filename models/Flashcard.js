var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FlashcardSchema = new Schema({
    frontSide: {
        type: String,
        required: false
    },
    backSide: {
        type: String,
        required: false
    },
    id: {
        type: Schema.Types.ObjectId,
    }
});

var Flashcard = mongoose.model('Flashcard', FlashcardSchema);

module.exports = Flashcard;