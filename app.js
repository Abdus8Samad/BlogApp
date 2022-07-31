//Starter require things
const express=require('express'),
admin = require('firebase-admin'),
serviceAccount = require('./blogapp-2b63e-firebase-adminsdk-jt9ac-56af42c5ff.json'),
app=express(),
bodyParser=require('body-parser'),
request=require('request'),
methodOverride=require('method-override');

//Admin Initialize App
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://blogapp-2b63e.firebaseio.com"
})
const db = admin.firestore();
// db.collection('blogs').add({
//     title:'Test Blog 1',
//     image:'https://images.unsplash.com/flagged/photo-1586017247030-23208be54963?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     body:'it\'s a very nice set-up to learn gulp up a lot of stuff!!!',
//     created:new Date().toDateString()
// })
//App set and use
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Model For Blogs
// const blogSchema=new mongoose.Schema({
//     title:String,
//     image:String,
//     body:String,
//     created:{type:Date,default:Date.now}
// })
// var Blog=mongoose.model("blog",blogSchema);
// var testblog={
    //     title:'Test Blog 1',
    //     image:'https://images.unsplash.com/flagged/photo-1586017247030-23208be54963?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
//     body:'it\'s a very nice set-up to learn gulp up a lot of stuff!!!'
// }


//--------------Routes------------ 
//1. Index Route
app.get('/',(req,res) =>{
    res.redirect('/blogs');
});
app.get('/blogs',(req,res) =>{
    db.collection('blogs').orderBy("d","desc").get().then(snapshot =>{
        res.render('index',{blogs:snapshot});
    }).catch(err =>{
        console.log('\nError === '+err);
    })
});

//2. New Route
app.get('/blogs/new',(req,res) =>{
    res.render("newpost");
});

//3. Post route
app.post('/blogs',(req,res) =>{
    var newobj = req.body.blog;
    var dt = new Date();
    newobj.created = dt.toDateString();
    newobj.d = dt;
    newobj.time = dt.toLocaleString('en-US', { hour: 'numeric',minute:'numeric',hour12: true });
    db.collection('blogs').add(newobj).then(() =>{
        res.redirect('/blogs');
    });
})

//4. Show Route
app.get('/blogs/:id',(req,res) =>{
    db.collection('blogs').doc(req.params.id).get().then(snapshot =>{
        res.render('details',{blog:snapshot});
    }).catch(err =>{
        console.log('\nError === '+err);
    })
});

//5. Edit Route
app.get('/blogs/:id/edit',(req,res) =>{
    db.collection('blogs').doc(req.params.id).get().then(snapshot =>{
        res.render('edit',{blog:snapshot});
    }).catch(err =>{
        console.log('\nError === '+err);
    })
});

//6. Update Route
app.put('/blogs/:id',(req,res) =>{
    db.collection('blogs').doc(req.params.id).update(req.body.blog);
    res.redirect(`/blogs/${req.params.id}`);
})

//7. Delete Route
app.delete('/blogs/:id',(req,res) =>{
    db.collection('blogs').doc(req.params.id).delete().then(() =>{
        res.redirect('/blogs');
    }).catch(err =>{
        console.log('\nError === '+err);
    })
})

// Server start
// app.listen(3000);
app.listen(3000, process.env.PORT,process.env.IP, (e) => console.log(e));
