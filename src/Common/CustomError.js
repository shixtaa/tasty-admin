export default function CustomError (error){
  let data = error.response.data;
  this.code = data.code;
  this.message = data.message;
  this.details = data.details;
}