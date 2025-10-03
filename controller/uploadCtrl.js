const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
// const uploadImages = asyncHandler(async (req, res) => {
//   try {
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newpath = await uploader(path);
//       console.log(newpath);
//       urls.push(newpath);
//       fs.unlinkSync(path);
//     }
//     const images = urls.map((file) => {
//       return file;
//     });
//     res.json(images);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = cloudinaryDeleteImg(id, "images");
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];

    console.log("Files received:", req.files);

    for (const file of req.files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log("Uploaded:", newpath);
      urls.push(newpath);

      try {
        fs.unlinkSync(path); // remove local file
      } catch (unlinkErr) {
        console.error("Failed to delete temp file:", unlinkErr);
      }
    }

    res.json(urls);
  } catch (error) {
    console.error("Upload error:", error); // ✅ show actual backend error
    res.status(500).json({ message: error.message });
  }
});


module.exports = {
  uploadImages,
  deleteImages,
};
