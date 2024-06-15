import { asynHandler } from "../utils/asynHandler.js";
// for throwing error we are importing ApiError
import { ApiError } from "../utils/ApiError.js";
// for validating user we need User.model.js
import { User } from "../models/user.model.js";

import { uploadCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynHandler(async (req, res) => {
  // get user details from frontend
  const { fullName, email, username, password } = req.body;
  // console.log("my email is :", email);

  // validating if there is anything which is empty

  // but through this approch we have to check every feild using multiple if statements
  // if (fullName === "") {
  //   throw new ApiError(400 , "full name is required");
  // }

  // So we will use this aprroch
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Some field is misssing*");
  }

  // Check if user already exist : username OR email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // if User already exist
  if (existedUser) {
    throw new ApiError(409, "User already Exist with same email or username");
  }

  // Now check weather user has given Avatar and coverImage ?
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // if user has not uploaded Avatar file then
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // now we have to upload the avatar and coverImage to cloudinary
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!avatar) {
    // check if avatar is uploaded on cloudinay
    throw new ApiError(400, "Avatar file is not uploaded on cloud");
  }

  // Now create a user object and a entry of user in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  // check if user is created - by finding his Id in database
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export { registerUser };
