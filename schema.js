const mongoose = require('mongoose');
mailto:mongoose.connect('mongodb+srv://onkar:onkar@cluster0.ct0tw.mongodb.net/zipcodevalidator?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const conn = mongoose.Collection;
const planSchema = mongoose.Schema({
    shopName: String,
    activationDate: String,
    currentPlan: String,
    thisMonthTaken: String,
    totalViewsReceived: String,
    totalViewsused: String,
    planFullDetail: Object,
    planStatus: String
});

const planModel = mongoose.model('planStatus', planSchema);

module.exports = planModel;
