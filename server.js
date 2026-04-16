const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const dotenv = require('dotenv')
dotenv.config();

const app = express();
const port = 3000
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/',(req,res)=>{
     res.send('hello world');
})


//orders for payment
app.post('/orders',async(req,res)=>{

     const {amount,currency} = req.body

     const razorpay = new Razorpay({
          key_id:process.env.api ,
          key_secret:process.env.secret_key,
     });
     const options = {
          amount:amount,
          currency:currency,
          receipt:"Receipt",
          paymennt_capture:1
     }

     try {
          const response = await razorpay.orders.create(options);
          res.json({
               order_id:response.id,
               currency:response.currency,
               amount:response.amount
          })

     } catch (err) {
           res.status(400).send('Not able to create order. Please try again!');
    }
});

app.get("/payment/:paymentId",async(req,res)=>{
     const {paymentId} = req.params;
     
     const razorpay = new Razorpay({
          key_id: "rzp_test_Sd2X4XmKUwgDWs",
          key_secret: "TWuW3m5E8VCVoPVOFGkRyArQ"
     })
     try {
          const payment = await razorpay.payments.fetch(paymentId);
          if(!payment){
               return res.status(500).json("error at razorpay loading")
          }
          res.json({
               status:payment.status,
               method:payment.method,
               amount:payment.amount,
               currency:payment.currency
          })

     } catch (error) {
          console.log(error)
     }
})

app.listen(port,()=>{
     console.log(`app is running in ${port} server`)
})
