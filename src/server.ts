import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredimage", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { image_url } = req.query;

      if (typeof image_url !== "string") {
        throw new Error("Invalid URL.");
      }

      if (!isValidUrl(image_url)) {
        throw new Error("Invalid URL.");
      }

      let fileLocation = await filterImageFromURL(image_url);

      res.sendFile(fileLocation, async () => await deleteLocalFiles([fileLocation]));
    } catch (err) {
      next(err);
    }
  });

  app.use((err: Error, req: express.Request, res: express.Response) => {
    if (err.message === "Invalid URL.") {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
