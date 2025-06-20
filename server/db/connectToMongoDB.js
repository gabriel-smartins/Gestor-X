import mongoose from "mongoose";
 
const connectToMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URI);
		console.log("Conectado ao BD MongoDB");
	} catch (error) {
		console.log("Erro ao conectar com o MongoDB", error.message);
	}
};

export default connectToMongoDB;
