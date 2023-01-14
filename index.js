import express from 'express'; // express module
import helmet from "helmet"; // helmet module
import { router as dsRouter } from "./routes/router.js";
const app = express();
const port = 50500;
app.use(helmet()); // Helmet secures Express from some well-known web vulnerabilities by setting HTTP headers
app.use(express.static("./view/")); // to serve static files
app.use(express.static("./node_modules/bootstrap/dist/")); // bootstrap static files
app.use((err, request, response, next) => { // Error handler middleware
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    response.status(statusCode).end();
});
app.use("/digitalSignature", dsRouter);
app.get("*", (request, response) => { // 404 handler middleware
    response.status(404).end();
});
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});