/**
 * Created by imshichao on 2017/8/2.
 */
var express = require("express");
var path=require('path')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _underscore =require("underscore");
var port = process.env.PORT || 3000
var app =express();

mongoose.connect('mongodb://localhost:27017/film')


// 模板渲染时可以访问locals中的变量
app.locals.moment = require('moment'); // 载入moment模块，格式化日期


app.set('views','./views/pages');
app.set("view engine",'jade');
 // app.use(express.bodyParser())  //express 中没有这个了，已经成单独的框架，所以需要require
app.use(bodyParser.urlencoded({extended: true}))//将表单数据 编码解析
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')))
app.listen(port);

console.log("film start"+ port)

//index page
app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
       if(err){
           console.log(err);
       }
        res.render('index',{
            title:'film 首页',
            movies:movies
        })
    })

})

//detail page
app.get('/movie/:id',function(req,res){

    var id = req.params.id;

    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'film  '+movie.title,
            movie:movie
        })
    })
})

//admin page
app.get('/admin/movie',function(req,res){
    res.render('admin', {
        title: 'film 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            flash: '',
            summary: '',
            language: '',
            poster:''
        }
    });
})


//admin post movie
app.post('/admin/movie/new',function(req,res){
    var id=req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie
    if(id !=='undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err);
            }
            _movie= _underscore.extend(movie,movieObj);

            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                //重定向到 详情页
                res.redirect('/movie/'+movie._id)
            })
        })
    }else{
        _movie =new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            language:movieObj.language,
            country:movieObj.country,
            summary:movieObj.summary,
            flash:movieObj.flash,
            poster:movieObj.poster,
            year:movieObj.year
        })

        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            //重定向到 详情页
            res.redirect('/movie/'+movie._id)
        })
    }
})

// admin  update movie
app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err);
            }
           res.render('admin',{
               title:'film 后台更新页',
               movie:movie
           })
        })
    }
})


//list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err);
        }
        res.render('list',{
            title:'film 列表页',
            movies:movies
        })
    })
})


//list delete
app.delete('/admin/list',function(req,res){
    var id =req.query.id
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err);
            }else{
                res.json({success:1})
            }
        })
    }
})
