import ImageKit from "imagekit";

// Lazy initialization of ImageKit client
let imagekit: ImageKit | null = null;

function getImageKitClient(): ImageKit {
  if (!imagekit) {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error("ImageKit configuration is missing. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT environment variables.");
    }

    imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }
  return imagekit;
}

/**
 * Upload a file to ImageKit
 * @param buffer File buffer
 * @param filename Original filename
 * @param _mimeType MIME type of the file (kept for API consistency but not used)
 * @returns ImageKit file ID and URL
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  _mimeType: string
): Promise<{ fileId: string; url: string }> {
  try {
    const client = getImageKitClient();
    // Convert buffer to base64 for ImageKit upload
    const base64 = buffer.toString("base64");
    
    const result = await client.upload({
      file: base64,
      fileName: filename,
      useUniqueFileName: true, // ImageKit generates unique filename
      folder: "/platvo-files", // Optional: organize files in folders
    });

    return {
      fileId: result.fileId,
      url: result.url,
    };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw new Error("Failed to upload file to ImageKit");
  }
}

/**
 * Get file URL from ImageKit file ID
 * @param fileId ImageKit file ID
 * @returns File URL
 */
export async function getFileUrl(fileId: string): Promise<string> {
  try {
    const client = getImageKitClient();
    const fileDetails = await client.getFileDetails(fileId);
    return fileDetails.url;
  } catch (error) {
    console.error("ImageKit get file error:", error);
    throw new Error("Failed to get file URL from ImageKit");
  }
}

/**
 * Delete a file from ImageKit
 * @param fileId ImageKit file ID
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const client = getImageKitClient();
    await client.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit delete error:", error);
    throw new Error("Failed to delete file from ImageKit");
  }
}
