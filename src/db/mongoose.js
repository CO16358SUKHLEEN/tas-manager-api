   const mg = require('mongoose')
   
 mg.connect(process.env.MONGODB_URL, {

   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false
   })  

