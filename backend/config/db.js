const moongoose = require('mongoose')

const connectDB = async () => {
    try{
        const connection = await moongoose.connect(process.env.MONGO_URI)
        console.log('Mongodb is connected')
    }catch(error){
        console.log(`ERROR : ${error.message}`)
        process.exit(1)
    }

}
module.exports = connectDB