var express = require("express");
var Sequelize = require("sequelize");
var dbConfig = require("./db.config");
var cors = require("cors");
var nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

//Connect to the db
const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect:dbConfig.dialect,
    pool:{
        max:dbConfig.pool.max,
        min:dbConfig.pool.min,
        acquire:dbConfig.pool.acquire,
        idle:dbConfig.pool.idle
    }
});

sequelize.authenticate().then( ()=>{
    console.log("Connected to database successfully...");
}).catch(err => {
    console.error("Unable to connect to db, because" + err);
})

//Define the structure of Users table
let userTable = sequelize.define("Users",{
    email:{
        primaryKey:true,
        type:Sequelize.STRING
    },
    name:Sequelize.STRING,
    phoneNo:Sequelize.INTEGER,
    password:Sequelize.STRING
},{
    timestamps:false,
    freezeTableName:true
});
/*
userTable.sync({force:true}).then(()=>{
    console.log("Table created successfully")
}).catch (err => {
    console.error("Error is : "+err);
});
*/
app.get("/",function(req,res){
    console.log("At GET of http://localhost:8002");
    res.send("Hello");
})

//Displays data of all Users
app.get("/getAllUsers",function(req,res){
    userTable.findAll({raw:true}).then(data=>{
        console.log(data);
        res.status(200).send(data);
    }).catch(err=>{
        console.error("There is an error getting data from db: " + err);
        res.status(400).send(err);
    })
})

//Display User based on email
app.get('/getUserByEmail/:email',function(req,res){
    var email=req.params.email;
    console.log("Given email: "+email)
    userTable.findByPk(email,{raw:true}).then(data=>{
        console.log(data);
        res.status(200).send(data)
    }).catch(err=>{
        console.error("There is an error getting data from db: "+err );
        res.status(400).send(err);
    })
})

//Display based on name
// userTable.findAll({where:{name:"nameFor"},raw:true}).then( (data) => {
//     console.log(data);
// }).catch( (err) => {
//     console.error("Error is :" + err);
// });

//Add new user data
app.post('/addUser',function(req,res){
    var email=req.body.email;
    var name =req.body.name;
    var phoneNo=req.body.phoneNo;
    var password=req.body.password;
    var userObj=userTable.build({email:email,name:name,phoneNo:phoneNo,password:password});
    userObj.save().then(data=>{
        var Msg="Record Inserted Successfully";
        console.log(Msg);
        res.status(201).send(data)
    }).catch(err=>{
        console.error("There is an error getting data from db: "+err );
        res.status(400).send(err);
    })

    var mailOptions = {
        from:'testprojectmtx@gmail.com',
        to: `${req.body.email}`,
        subject:`Welcome, ${req.body.name} to ApniDukan`,
        html:`<h3>Dear ${req.body.name}, <br>
            You have been successfully registered on ApniDukan.<br>
            In case you need any support, you can write to support@apnidukan.com.<br><br><br>
            With Regards,<br>
            ApniDukan team</h3>`
    };
    
    transporter.sendMail(mailOptions,function(err,info){
        if(err)
            console.error(err);
        else
            console.log('Email Sent : ' + info.response);
    })

})

//Send email after payment
// app.get('/confirmPayment',function(req,res){
//     var email=req.params.email;
//     console.log("Given email: "+email)
//     userTable.findByPk(email,{raw:true}).then(data=>{
//         console.log(data);
//         res.status(200).send(data)
//     }).catch(err=>{
//         console.error("There is an error getting data from db: "+err );
//         res.status(400).send(err);
//     })
// })

//Delete user data
app.delete('/deleteUserByEmail/:email',function(req,res){
    var email=req.params.email;
    userTable.destroy({where:{email:email}})
    .then(data=>{
        console.log(data)
        var Msg="Record Deleted Successfully";
        res.status(200).send(Msg)
    }).catch(err=>{
            console.error("There is an error getting data from db: "+err );
            res.status(400).send(err);
    })
})
//Define the structure of Products table

let productTable = sequelize.define("Products",{
    productId:{
        primaryKey:true,
        type:Sequelize.INTEGER
    },
    title:Sequelize.STRING,
    description:Sequelize.STRING,
    quantity:Sequelize.INTEGER,
    price:Sequelize.INTEGER,
    category:Sequelize.STRING,
    brand:Sequelize.STRING,
    image:Sequelize.STRING
},{
    timestamps:false,
    freezeTableName:true
});
/*
productTable.sync({force:true}).then(()=>{
    console.log("Table created successfully")
}).catch (err => {
    console.error("Error is : "+err);
});
*/

//Displays data of all Products
app.get("/getAllProducts",function(req,res){
    productTable.findAll({raw:true}).then(data=>{
        console.log(data);
        res.status(200).send(data);
    }).catch(err=>{
        console.error("There is an error getting data from db: " + err);
        res.status(400).send(err);
    })
})

//Add new product data
app.post('/addProduct',function(req,res){
    var productId=req.body.productId;
    var title =req.body.title;
    var description=req.body.description;
    var quantity=req.body.quantity;
    var price=req.body.price;
    var category=req.body.category;
    var brand=req.body.brand;
    var image=req.body.image;
    var productObj=productTable.build({productId:productId,title:title,description:description,quantity:quantity,price:price,category:category,brand:brand,image});
    productObj.save().then(data=>{
        var Msg="Record Inserted Successfully";
        res.status(201).send(data)
    }).catch(err=>{
        console.error("There is an error getting data from db: "+err );
        res.status(400).send(err);
    })
})


// For Email
var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'testprojectmtx@gmail.com',
        pass:'testproject'
    }
});

//Define the structure of Cart table

let cartTable = sequelize.define("Cart",{
    cartId:{
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    email:Sequelize.STRING,
    productId:Sequelize.INTEGER,
    quantity:Sequelize.INTEGER,
},{
    timestamps:false,
    freezeTableName:true
});

// cartTable.sync({force:true}).then(()=>{
//     console.log("Table created successfully")
// }).catch (err => {
//     console.error("Error is : "+err);
// });


//Displays all products in the cart
app.get("/getCartData",function(req,res){
    userTable.findAll({where:{email:email}},{raw:true}).then(data=>{
        console.log(data);
        res.status(200).send(data);
    }).catch(err=>{
        console.error("There is an error getting data from db: " + err);
        res.status(400).send(err);
    })
})

//Add product to cart
// app.post('/addToCart',function(req,res){
//     var email='abc';
//     var productId=req.body.productId;
//     var quantity=req.body.quantity;
//     var cartObj=cartTable.build({email:email,productId:productId,quantity:quantity});
//     cartObj.save().then(data=>{
//         var Msg="Record Inserted Successfully";
//         console.log(Msg);
//         res.status(201).send(data)
//     }).catch(err=>{
//         console.error("There is an error getting data from db: "+err );
//         res.status(400).send(err);
//     })
// })

app.post("/forgetpass",function(req,res){

    userTable.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        console.log("hello");
        if (!user) {
          console.log("user not found");
            return res.status(201).send({
            message: "User Not Found",
          });
        }
      
        else{
            console.log("Hi");
             var otp = Math.floor(100000 + Math.random() * 900000);
            sendMail(user,otp,info=>
                {

                if(!user){ 
                    console.log("Not found");
                          return res.status(201).send({
                            message: "try later, unable to send mail."
                            });
                        } 
                     
                 else{

                 console.log("email sent with otp : "+otp+"\ninfo : "+info.response);
                 return res.status(201).send({
                     message: "OTP sent on this mail id.",
                      flag : true,
                     email: user.email,
                    otp : otp
                   });
                 }
             })
             }
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
            message: "Server error"
            });
          }
       
      });

})

app.put("/updatepass",function(req,res){
    userTable.update({password : req.body.password},
        {where : { email: req.body.email}}).then(user => {
        sendMail2(req.body,info=>{
            res.status(201).send({
                message: "Password updated successfully."
            });
         })
      }).catch(err => {
        res.status(201).send({
          message: "Error updating Password with email=" + email
        });
    });

})

async function sendMail(user,otp,callback)
 {     
     console.log(user.email);
    //  console.log(typeof user) 
      
    // console.log(user.Emailno);
   
  var transporter=nodemailer.createTransport({
    
      service:'gmail',
     
      auth:{
          user:'testprojectmtx@gmail.com',
          pass:'testproject'
      }
  });
  var mailOptions={
      from:"testprojectmtx@gmail.com",
      to:user.email,
      subject:'Password Reset',
      html:`<h1 style="color:coral;">Hello ${user.name},</h1><br>
             <h4 style="color:blue;">You are receiving this email beacuse we recieved
              a password reset request to your account <br> Your One time Password is : <h4>`+otp+
        `<h4 style="color:blue;">Best wishes,</h4>
               <b style="color:blue;">Team ApniDukan</b>`

  };
  let info= await transporter.sendMail(mailOptions);
  callback(info);
}




async function sendMail2(user,callback)
 {    
      
  var transporter=nodemailer.createTransport({
    
      service:'gmail',
     
      auth:{
          user:'testprojectmtx@gmail.com',
          pass:'testproject'
      }
  });
  
  var mailOptions={
      from:"testprojectmtx@gmail.com",
      to:user.email,
      subject:'Password Successfully updated',
      html:`<h2 style="color:blue;">Hi ${user.email},</h2><br>
             <h3 style="color:blue;">Your Password is Successfully Changed.
             You can  login using the new password.</h3>
              <h3 style="color:blue;">Best wishes,</h3>
               <b style="color:blue;">Team ApniDukan</b>`

  };
  let info= await transporter.sendMail(mailOptions);
  callback(info);
  console.log("Email sent successfully after password update");
}

app.listen(8002,function(){
    console.log("Server is listening at http://localhost:8002");
})