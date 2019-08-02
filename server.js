const app =require('./app');
const Port = process.env.PORT || 3001;
app.listen(Port ,()=>console.log(`listening on port ${Port}`));