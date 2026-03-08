# ImageKit File Storage Setup

## Installation

Install the ImageKit SDK:

```bash
npm install imagekit
```

## Environment Variables

Add these to your `.env.local` file:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

## ImageKit Setup

1. Go to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Sign up or log in
3. Create a new account or use existing
4. Go to Settings → API Keys
5. Copy Public Key and Private Key
6. Copy URL Endpoint (format: `https://ik.imagekit.io/your_imagekit_id`)
7. Add to `.env.local`

## Database Migration

After updating the Prisma schema with the File table, run:

```bash
npx prisma migrate dev --name add_file_table
```

Or for production:

```bash
npx prisma migrate deploy
```

## File Flow

1. User selects file → Uploads to `/api/files/upload`
2. File stored in ImageKit → Metadata saved in Neon DB
3. FileId and URL returned to frontend
4. User sends message → fileIds sent to chat API
5. Chat API fetches files from DB (with security check)
6. Files fetched from ImageKit URLs and converted for AI model
7. AI processes files and responds

## Security

- Files are checked for userId ownership before access
- Cross-user file access is prevented
- File types and sizes are validated (10MB max)

## Supported File Types

- Images: JPEG, PNG, GIF, WebP, SVG
- Documents: PDF
- Text: TXT, Markdown
- Word: DOC, DOCX
