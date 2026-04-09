# DesignMatch - PSD Toolkit

A powerful web-based tool for PSD file processing, code generation, and slicing. Built with Vue 3, Node.js, and TypeScript.

## Features

### 🎨 PSD Processing
- **PSD File Parsing**: Extract layer information, dimensions, and metadata from PSD files
- **Layer Analysis**: Get detailed information about each layer, including position, size, visibility, and more
- **Large File Support**: Handle PSD files up to 500MB

### 📝 Code Generation
- **Styled Components**: Generate React components with styled-components
- **Tailwind CSS**: Generate HTML with Tailwind CSS classes
- **Component Structure**: Automatic component naming and organization

### ✂️ Slicing Tool
- **Automatic Slicing**: Generate slices from PSD layers
- **Multiple Formats**: Support for PNG, JPG, and WebP formats
- **Quality Control**: Adjustable quality settings for optimized output

### 🔍 Design Comparison
- **Pixel-perfect Comparison**: Compare PSD designs with live web pages
- **Mobile Device Support**: Test designs on different device sizes
- **Difference Highlighting**: Visualize differences between design and implementation

## Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/designmatch.git
   cd designmatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   - Frontend: http://localhost:5173/
   - Backend: http://localhost:3001/

## Usage

### 1. Upload a PSD File
- Click on the "Drop your design here" area
- Select a PSD file from your computer
- Wait for the file to upload

### 2. Generate Code
- Expand the "Code Generator" section
- Select your preferred framework (Styled Components or Tailwind CSS)
- Click "Generate Code"
- Copy the generated code

### 3. Generate Slices
- Expand the "Slicing Tool" section
- Select the output format (PNG, JPG, or WebP)
- Adjust the quality settings
- Click "Generate Slices"
- Download the generated slices

### 4. Compare Designs
- Enter a URL to compare with your design
- Select device type and screen size
- Adjust sensitivity settings
- Click "Start Comparison"
- View the comparison results

## API Endpoints

### PSD Processing
- `POST /api/generate/parse` - Parse a PSD file and return layer information
- `POST /api/generate/code` - Generate code from a PSD file

### Slicing
- `POST /api/slice/generate` - Generate slices from a PSD file
- `POST /api/slice/batch` - Batch generate slices from multiple PSD files
- `POST /api/slice/cleanup` - Clean up temporary slice files
- `GET /api/slice/info` - Get information about a slice

### File Upload
- `POST /api/upload` - Upload a file

### Design Comparison
- `POST /api/capture` - Capture a screenshot of a URL
- `POST /api/compare` - Compare two images

## Technology Stack

### Frontend
- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Lucide Vue Next (icons)

### Backend
- Node.js
- Express
- TypeScript
- Multer (file uploads)
- Sharp (image processing)

### PSD Processing
- psd (PSD file parsing)
- ag-psd (alternative PSD parsing)
- pixelmatch (image comparison)

## Project Structure

```
├── api/                 # Backend API
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── app.ts           # Express app
│   └── server.ts        # Server entry point
├── src/                 # Frontend
│   ├── components/      # Vue components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   └── main.ts          # Frontend entry point
├── public/              # Static files
│   ├── temp/            # Temporary files
│   └── slices/          # Generated slices
└── package.json         # Project configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [psd.js](https://github.com/meltingice/psd.js) - PSD file parsing library
- [Sharp](https://github.com/lovell/sharp) - High-performance image processing
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Support

If you have any questions or issues, please open an issue on GitHub.

---

Made with ❤️ by the DesignMatch team