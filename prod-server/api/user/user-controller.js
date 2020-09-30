export function index(req, res) {
  // var temp = {message: ['Hello World!']}
  return res.status(200).json({
    message: "Hello World"
  }); // return JSON.stringify(temp);
}