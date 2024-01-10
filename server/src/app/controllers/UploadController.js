const cloudinary = require("cloudinary").v2;

class UploadController {
  //[POST]: /upload/file
  async uploadFile(req, res) {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });
      res.json(cldRes);
    } catch (error) {
      console.log(error);
      res.send({
        message: error.message,
      });
    }
  }
}

module.exports = new UploadController();
