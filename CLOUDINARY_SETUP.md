# Cloudinary Setup Instructions

## 1. Create Cloudinary Account
1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloud Name
1. After signing in, go to your Dashboard
2. Copy your **Cloud name** (it looks like: `abc123def`)
3. This will be your `CLOUDINARY_CLOUD_NAME`

## 3. Create Upload Preset
1. Go to Settings → Upload in the Cloudinary dashboard
2. Click "Add upload preset"
3. Give it a name (e.g., `course_banners`)
4. Configure settings:
   - Signing mode: **Unsigned**
   - Allowed formats: `jpg, jpeg, png, webp`
   - Maximum file size: `3000000` (3MB)
   - Folder: `course_banners`
5. Click Save
6. Copy the preset name - this will be your `CLOUDINARY_UPLOAD_PRESET`

## 4. Set Environment Variables
Create a `.env.local` file in your project root and add:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

## 5. Restart Development Server
After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
```

## 6. Test Upload
The upload widget should now work properly. You can test it by:
1. Going to the course creation form
2. Clicking the upload widget
3. Selecting an image file
4. Confirming the upload

## Troubleshooting

### "Cloudinary environment variables are not set"
- Make sure your `.env.local` file is in the project root
- Check that variable names match exactly
- Restart your development server

### "Upload failed" errors
- Verify your upload preset is set to **Unsigned**
- Check that the preset name matches exactly
- Ensure file size is under 3MB
- Make sure file format is supported (jpg, jpeg, png, webp)

### Still having issues?
1. Check browser console for specific error messages
2. Verify Cloudinary account is active
3. Check that upload preset is properly configured
