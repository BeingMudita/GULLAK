import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try{
        const response = await axiosInstance.post("/upload-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }catch(err){
        console.error("Error uploading image:", err);
        throw err; // Rethrow the error for further handling if needed
    }

}

export default uploadImage;