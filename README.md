# Responsive Carousel Component

A fully-featured, accessible carousel built with vanilla HTML, CSS, and JavaScript. No external dependencies required.

## What This Is

This carousel component demonstrates how to build a production-ready, responsive product carousel that works across all devices and screen sizes. It includes smart navigation, accessibility features, and smooth animations.

## Live Demo

Open `index.html` in your browser to see the navigation page with three different carousel configurations:

- **Multiple Products** (6 items) - Full carousel demonstration
- **Two Products** (2 items) - Simplified version
- **Single Product** (1 item) - Minimal version

## Key Features

### 🎯 **Smart Responsive Design**

- **Desktop (≥1200px)**: Shows 3 cards, navigates 1 at a time
- **Tablet (800-1199px)**: Shows 2 cards, navigates 1 at a time
- **Mobile (<800px)**: Shows 1 card, navigates 1 at a time

### 🚀 **Performance & User Experience**

- 3-second loading animation with smooth transitions
- 60fps animations using CSS transforms
- Touch/swipe gestures for mobile devices
- Keyboard navigation support (arrow keys)
- Debounced resize handling for optimal performance

### ♿ **Accessibility First**

- Full ARIA support for screen readers
- Live region announcements for navigation changes
- Proper focus management and keyboard navigation
- Semantic HTML structure
- Screen reader-only content where needed

### 🧠 **Smart Navigation**

- Navigation controls automatically hide when not needed
- Dynamic pagination with proper singular/plural handling
- Intelligent button state management (disabled at start/end)
- Visual indicators for off-screen content

## How It Works

### Core Architecture

The carousel is built with three main components:

1. **HTML Structure** (`*.html`)

   - Semantic markup with proper ARIA attributes
   - Flexible list-based layout for cards
   - Navigation controls and pagination

2. **CSS Styling** (`css/styles.css`)

   - CSS Grid and Flexbox for responsive layouts
   - CSS transforms for smooth animations
   - Mobile-first responsive design approach

3. **JavaScript Logic** (`js/main.js`)
   - Vanilla JavaScript with no dependencies
   - Modular functions for easy maintenance
   - Event-driven architecture

### Key Technical Decisions

#### **Responsive Breakpoints**

We use three carefully chosen breakpoints:

- `480px` - Mobile/small screens
- `800px` - Tablet/medium screens
- `1200px` - Desktop/large screens

#### **Navigation Logic**

```javascript
// Always move one card at a time for predictable UX
const getNavigationStep = () => return 1;

// Show different numbers of cards based on screen size
const getSlidesPerView = () => {
  if (screenWidth < 800) return 1;      // Mobile
  else if (screenWidth < 1200) return 2; // Tablet
  else return 3;                        // Desktop
}
```

#### **Smart Control Management**

Navigation controls automatically hide when they're not needed:

- Single product: Always hidden (nothing to navigate)
- Two products on desktop: Hidden (both visible)
- Two products on mobile: Shown (need to navigate between them)

#### **Performance Optimizations**

- CSS transforms instead of changing layout properties
- Debounced resize events (250ms delay)
- Hardware acceleration with `transform3d`
- Efficient DOM queries with cached selectors

## File Structure

```
├── index.html              # Navigation page (entry point)
├── multiple-products.html  # 6-item carousel demo
├── two-products.html       # 2-item carousel demo
├── single-product.html     # 1-item carousel demo
├── css/
│   └── styles.css          # All carousel styling
├── js/
│   └── main.js             # Carousel functionality
├── PRD.md                  # Product requirements document
└── README.md               # This file
```

## Development Considerations

### **Accessibility**

- Always test with screen readers
- Ensure proper focus management
- Use semantic HTML elements
- Provide alternative text for visual elements

### **Performance**

- Minimize layout thrashing during animations
- Use CSS transforms for movement
- Debounce resize events
- Cache DOM selectors

### **Browser Support**

- Modern browsers (ES6+ features used)
- CSS Grid and Flexbox support required
- Touch events for mobile gestures

### **Maintainability**

- Modular JavaScript functions
- Clear naming conventions
- Comprehensive comments
- Separation of concerns (HTML/CSS/JS)

## Customization

### **Adding More Cards**

Simply add more `<li class="c-carousel__slide">` elements to the track.

### **Changing Breakpoints**

Update the breakpoint values in both:

- `getSlidesPerView()` function in `js/main.js`
- Media queries in `css/styles.css`

### **Styling Cards**

Modify the `.product-card` styles in `css/styles.css`. The current version uses simple grey placeholder cards.

### **Animation Timing**

Adjust transition durations in CSS:

```css
.c-carousel__track {
  transition: transform 0.3s ease; /* Change duration here */
}
```

## Testing

Built-in testing functions available in browser console:

- `testCarousel()` - Shows current carousel state
- `testFocus(cardIndex)` - Tests focus management

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.
