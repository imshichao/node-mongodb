/**
 * Created by imshichao on 2017/8/2.
 */
var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie')

var Movie= mongoose.model('Movie',MovieSchema);


module.exports=Movie