const app = require("./app.js");

app.listen(8080, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("litening on 8080!");
  }
});
