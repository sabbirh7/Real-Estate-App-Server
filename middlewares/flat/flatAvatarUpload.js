const uploader = require("../../utilities/singleUploader");

function flatAvatarUpload(req, res, next) {
  const upload = uploader(
    "flatAvatars",
    ["images/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg, .jpeg, or .png files are allowed!"
  );

  //call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}
module.exports = flatAvatarUpload;
