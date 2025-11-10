# JourneyCanvas

**A Creative Mood Visualization Platform**

*Developed by Michael Semera*

---

## 🎨 Overview

JourneyCanvas is an innovative digital journaling application that transforms emotions into art. Users express their daily moods through colors and brush strokes on an interactive canvas, creating a visual diary that evolves over time. The application generates beautiful timelines and insights from accumulated mood art, allowing users to see patterns in their emotional journey.

Unlike traditional text-based journals, JourneyCanvas leverages the power of visual expression and color psychology to help users connect with their emotions in a more intuitive and creative way.

---

## ✨ Key Features

### Creative Expression
- **Interactive Canvas**: HTML5 Canvas API for smooth, responsive drawing
- **8 Mood Colors**: Curated palette based on color psychology (Joy, Calm, Peaceful, Love, Energy, Mystery, Melancholy, Hope)
- **Adjustable Brush**: 5-50px brush size with gradient effects
- **Touch Support**: Works seamlessly on tablets and mobile devices
- **Real-time Drawing**: Instant visual feedback with alpha blending

### Data Visualization
- **Emotional Timeline**: Dynamic gradient visualization of mood progression
- **Color Analysis**: Automatic extraction of dominant colors from artwork
- **Journey Animation**: Animated playback of your emotional journey over time
- **Statistical Insights**: Track total moods, days tracked, and color patterns

### User Experience
- **Persistent Storage**: All artwork saved locally across sessions
- **Gallery View**: Browse and manage your mood art collection
- **Image Export**: Download mood art as PNG files
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Beautiful Gradients**: CSS gradients and backdrop blur effects

---

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18**: Modern component-based UI framework
- **React Hooks**: useState, useEffect, useRef for state management
- **HTML5 Canvas API**: Core drawing and rendering engine
- **Lucide React**: Professional icon system
- **Tailwind CSS**: Utility-first styling with custom gradients

### Canvas Features
- **2D Context Rendering**: High-performance drawing operations
- **Linear Gradients**: Smooth color transitions for backgrounds
- **Radial Gradients**: Soft brush effects
- **Image Data Extraction**: DOM color analysis
- **Base64 Encoding**: Image serialization for storage

### Advanced Techniques
- **Color Frequency Analysis**: Dominant color extraction algorithm
- **Timeline Animation**: Frame-based sequential rendering
- **Touch Event Handling**: Multi-device input support
- **Async Storage Operations**: Non-blocking data persistence
- **Canvas State Management**: Efficient re-rendering strategies

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm installed
- Modern web browser with Canvas API support
- 50MB+ available storage space

### Quick Start

1. **Create React Project**
```bash
npx create-react-app journeycanvas
cd journeycanvas
```

2. **Install Dependencies**
```bash
npm install lucide-react
```

3. **Add Tailwind CSS (Optional but Recommended)**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Replace App Component**
- Copy the JourneyCanvas code into `src/App.js`

5. **Start Development Server**
```bash
npm start
```

6. **Access Application**
- Open `http://localhost:3000` in your browser

### Production Build
```bash
npm run build
```
Deploy the `build` folder to any static hosting service (Netlify, Vercel, GitHub Pages).

---

## 💡 How to Use

### Creating Mood Art

1. **Navigate to Create Tab**
   - Click the "Create" button in the navigation bar

2. **Choose Your Mood Color**
   - Select from 8 curated mood colors
   - Each color represents a different emotional state
   - Hover to see mood names (Joy, Calm, Peaceful, etc.)

3. **Adjust Brush Size**
   - Use the slider to set brush thickness (5-50px)
   - Larger brushes for bold emotions
   - Smaller brushes for detailed feelings

4. **Draw Your Emotions**
   - Click/tap and drag on the canvas to draw
   - Mix colors by switching mid-drawing
   - Let your feelings guide your strokes
   - No artistic skill required - it's about expression

5. **Save Your Mood**
   - Click "Save Mood" when finished
   - Artwork is automatically analyzed for dominant colors
   - Entry is timestamped and stored

6. **Clear and Restart**
   - Use "Clear" button to reset canvas
   - Start fresh whenever needed

### Browsing Your Gallery

1. **View All Mood Art**
   - Click "Gallery" tab to see all saved entries
   - Grid layout shows thumbnails with dates

2. **Interact with Entries**
   - Hover over any mood art to reveal actions
   - Download individual pieces as PNG files
   - Delete entries you no longer want

3. **See Color Palettes**
   - Each entry displays its 5 dominant colors
   - Quick visual reference of emotional tones

### Exploring Your Journey

1. **View Timeline**
   - Click "Journey" tab to see evolution
   - Gradient bar shows color progression over time
   - Each segment represents one day's mood

2. **Animate Your Journey**
   - Click "Animate" to watch timeline build day by day
   - Pause/Resume animation as desired
   - Reset to start from beginning

3. **Analyze Patterns**
   - Color Insights section shows most frequent colors
   - Bar charts indicate color occurrence rates
   - Helps identify emotional patterns

4. **Check Statistics**
   - Total moods created
   - Days tracked since first entry
   - Unique colors used
   - Average colors per mood

---

## 🏗️ Project Architecture

### Component Structure

```
JourneyCanvas (Main Component)
├── State Management
│   ├── moods: Array<MoodEntry>
│   ├── currentColor: string
│   ├── brushSize: number
│   ├── isDrawing: boolean
│   ├── view: 'create' | 'gallery' | 'journey'
│   ├── selectedMood: MoodEntry | null
│   ├── isAnimating: boolean
│   └── animationFrame: number
├── Canvas Refs
│   ├── canvasRef: HTMLCanvasElement
│   └── timelineCanvasRef: HTMLCanvasElement
└── Animation Ref
    └── animationRef: Timeout
```

### Data Model

```typescript
interface MoodEntry {
  id: string;                // Timestamp-based unique ID
  timestamp: number;         // Unix timestamp
  date: string;              // ISO date string
  imageData: string;         // Base64 PNG data URL
  colors: string[];          // Array of RGB color strings
  brushSize: number;         // Brush size used
}

interface MoodColor {
  name: string;              // Emotion name
  color: string;             // Hex color code
  gradient: string;          // Tailwind gradient classes
}
```

### Core Functions

**Canvas Operations**
- `initCanvas()`: Initializes canvas with gradient background
- `startDrawing()`: Begins drawing mode on mouse/touch down
- `stopDrawing()`: Ends drawing mode on mouse/touch up
- `draw()`: Renders brush strokes with gradient effects
- `clearCanvas()`: Resets canvas to initial state

**Data Management**
- `saveMood()`: Captures canvas, analyzes colors, stores entry
- `loadMoods()`: Retrieves all mood entries from storage
- `deleteMood()`: Removes specific mood entry
- `downloadMood()`: Exports mood art as downloadable PNG

**Analysis Functions**
- `extractDominantColors()`: Analyzes canvas pixels for top colors
- `getMoodStats()`: Calculates color frequency statistics
- `renderTimeline()`: Draws gradient timeline on canvas
- `animateTimeline()`: Frame-by-frame timeline animation

**Utility Functions**
- `getSentimentIcon()`: Returns appropriate emotion icon
- `getSentimentColor()`: Determines color for sentiment bars

---

## 🎨 Color Psychology

The 8 mood colors were carefully selected based on established color psychology principles:

| Color | Emotion | Psychological Association |
|-------|---------|---------------------------|
| Yellow (#FFD93D) | Joy | Happiness, optimism, energy |
| Green (#6BCB77) | Calm | Balance, harmony, growth |
| Blue (#4D96FF) | Peaceful | Serenity, trust, stability |
| Pink (#FF6B9D) | Love | Affection, compassion, warmth |
| Red (#FF5722) | Energy | Passion, excitement, intensity |
| Purple (#9C27B0) | Mystery | Creativity, spirituality, imagination |
| Gray (#607D8B) | Melancholy | Reflection, neutrality, contemplation |
| Cyan (#00BCD4) | Hope | Clarity, inspiration, renewal |

---

## 📊 Canvas API Implementation

### Drawing Algorithm

The drawing system uses HTML5 Canvas 2D context with several advanced techniques:

**Brush Rendering**
```javascript
// Smooth line drawing
ctx.lineWidth = brushSize;
ctx.lineCap = 'round';
ctx.strokeStyle = currentColor;
ctx.globalAlpha = 0.8;

// Gradient glow effect
const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
gradient.addColorStop(0, currentColor);
gradient.addColorStop(1, currentColor + '00'); // Transparent edge
```

**Color Extraction**
```javascript
// Sample pixels from canvas
const imageData = ctx.getImageData(0, 0, width, height);
const data = imageData.data; // RGBA array

// Skip every 40th pixel for performance
for (let i = 0; i < data.length; i += 40) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  // Count color frequency...
}
```

**Timeline Gradient**
```javascript
// Create seamless multi-color gradient
const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
colors.forEach((color, i) => {
  gradient.addColorStop(i / colors.length, color);
});
ctx.fillStyle = gradient;
```

---

## 🔐 Data Storage & Privacy

### Storage Architecture
- **Client-Side Only**: All data stored in browser's storage API
- **No Server**: No backend, no external database
- **User Control**: Complete ownership of data
- **Persistent**: Survives browser restarts
- **Isolated**: Data not shared between browsers

### Data Format
```javascript
// Storage key pattern
'mood:1699564800000' -> JSON string

// Stored data structure
{
  "id": "1699564800000",
  "timestamp": 1699564800000,
  "date": "2024-11-10T00:00:00.000Z",
  "imageData": "data:image/png;base64,iVBORw0KG...",
  "colors": ["rgb(255,107,157)", "rgb(77,150,255)"],
  "brushSize": 15
}
```

---

## 🎯 Design Philosophy

### Visual Identity
- **Gradient-First**: Extensive use of color gradients for visual appeal
- **Soft Aesthetics**: Rounded corners, soft shadows, gentle transitions
- **Playful Yet Professional**: Approachable design without sacrificing polish
- **Color-Driven**: Colors as primary communication method

### User Experience Principles
1. **Zero Learning Curve**: Intuitive, no instructions needed
2. **Immediate Feedback**: Real-time visual responses
3. **Forgiving Interface**: Easy to clear and restart
4. **Encouraging Creativity**: No judgment, all expression valid
5. **Progressive Disclosure**: Features revealed naturally

### Accessibility Considerations
- **High Contrast**: All text meets WCAG AA standards
- **Large Touch Targets**: Buttons sized for easy interaction
- **Keyboard Support**: Canvas accessible via keyboard
- **Screen Reader Labels**: Semantic HTML throughout
- **Color Independence**: Not relying solely on color for information

---

## 🔄 Future Enhancements

### Planned Features
- **Mood Prompts**: Daily questions to inspire creativity
- **Export Timeline**: Download journey visualization as video
- **Sharing**: Generate shareable links to mood art
- **Templates**: Pre-made patterns and backgrounds
- **Music Integration**: Background music while drawing
- **Mood Calendar**: Calendar view with daily mood indicators
- **Pattern Recognition**: ML-based pattern detection
- **Multi-Layer Drawing**: Separate layers for complex art
- **Undo/Redo**: Canvas history management
- **Collaborative Canvas**: Shared mood boards

### Technical Improvements
- **WebGL Rendering**: Hardware-accelerated drawing
- **Pressure Sensitivity**: Stylus support for tablets
- **Cloud Backup**: Optional cloud storage
- **Offline Mode**: Full PWA support
- **Performance Optimization**: Virtual scrolling for large galleries
- **Advanced Analytics**: More detailed emotional insights

---

## 🐛 Troubleshooting

### Common Issues

**Canvas not drawing**
- Check if Canvas API is supported (all modern browsers)
- Verify JavaScript is enabled
- Clear browser cache and reload
- Check console for errors

**Colors look different**
- Canvas rendering may vary slightly by browser
- Color extraction uses RGB, not hex
- Monitor calibration affects appearance

**Moods not saving**
- Verify storage permissions
- Check available storage space (requires ~5MB per mood)
- Try clearing old moods if storage full
- Check browser console for storage errors

**Timeline not rendering**
- Ensure at least one mood is saved
- Refresh page to reinitialize canvas
- Check that browser supports Canvas API

**Performance issues**
- Reduce brush size for faster rendering
- Clear unused moods from gallery
- Close other browser tabs
- Update to latest browser version

---

## 📱 Browser Compatibility

### Fully Supported
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Mobile Support
- iOS Safari 14+ ✅
- Chrome Android 90+ ✅
- Samsung Internet 14+ ✅

### Required APIs
- Canvas 2D Context API
- Touch Events API
- File API (for downloads)
- Storage API

---

## ⚡ Performance Optimization

### Implemented Optimizations
- **Canvas Pooling**: Reuse canvas contexts
- **Color Sampling**: Skip pixels for faster analysis (every 40th)
- **Debounced Storage**: Batch write operations
- **Lazy Loading**: Load moods on demand
- **Efficient Sorting**: In-memory array manipulation
- **RAF for Animations**: RequestAnimationFrame where applicable

### Best Practices
- Clear canvas before major operations
- Use integer coordinates for pixel operations
- Minimize state updates during drawing
- Cache computed values
- Batch DOM updates

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create mood with each color
- [ ] Test brush size range (min and max)
- [ ] Verify save functionality
- [ ] Check gallery display
- [ ] Test delete operation
- [ ] Verify download works
- [ ] Animate timeline
- [ ] Check responsive design on mobile
- [ ] Test touch drawing on tablet
- [ ] Verify storage persistence

### Edge Cases
- Drawing with 0 brush size
- Saving empty canvas
- Maximum storage capacity
- Very rapid drawing
- Multiple tabs open
- Browser refresh during drawing

---

## 📚 Learning Resources

### Canvas API
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Canvas Deep Dive](https://joshondesign.com/p/books/canvasdeepdive/toc.html)

### Color Theory
- [Color Psychology in Design](https://www.colorpsychology.org/)
- [Interaction of Color by Josef Albers](https://www.interaction-of-color.com/)

### React Patterns
- [React Hooks Documentation](https://react.dev/reference/react)
- [useRef for Canvas](https://react.dev/learn/manipulating-the-dom-with-refs)

---

## 🤝 Contributing

This is a portfolio project by Michael Semera. While not open for contributions, feedback and suggestions are welcome!

---

## 📄 License

This project is created for portfolio purposes. All rights reserved by Michael Semera.

---

## 👨‍💻 About the Developer

**Michael Semera**
- Portfolio Project: JourneyCanvas
- Focus: Creative applications with Canvas API
- Specialization: Interactive data visualization and emotional design

---

## 🙏 Acknowledgments

- **HTML5 Canvas API**: Foundation for drawing capabilities
- **Lucide Icons**: Beautiful, consistent iconography
- **React Team**: Excellent documentation and ecosystem
- **Tailwind CSS**: Rapid styling with utility classes
- **Color Psychology Research**: Scientific basis for mood palette

---

## 📞 Support

For questions about this project, please contact Michael Semera.

- 💼 LinkedIn: [Michael Semera](https://www.linkedin.com/in/michael-semera-586737295/)
- 🐙 GitHub: [@MichaelKS123](https://github.com/MichaelKS123)
- 📧 Email: michaelsemera15@gmail.com

---

**Express Yourself. Visualize Your Journey. 🎨**

*Built with ❤️ and creativity by Michael Semera*

*Last Updated: November 2025*