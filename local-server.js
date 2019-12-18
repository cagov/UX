const express = require('express')
const app = express()
const port = 1338

app.use('/', express.static('docs/', {}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
