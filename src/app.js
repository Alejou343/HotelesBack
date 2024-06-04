import express from 'express';
import cors from "cors"
import routes from "./routes/routes.js";
import sequelize from './database/sequelize.js'

const app = express();
const puerto=process.env.PORT ;

sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });


console.log(puerto)
app.use(cors())
app.use(express.json())
app.use('/',routes)
app.listen(puerto, () => {
  console.log(`Server is running on :${puerto}`);
});
