const fs = require('fs');

// Removed canvas dependency. Using pure string replacement for SVGs.

const images = [
    { name: 'sully-ruiz.jpg', color: '#E0E0E0', text: 'Agent Portrait' },
    { name: 'services-buy.jpg', color: '#D4C4B7', text: 'Services: Buying' },
    { name: 'services-sell.jpg', color: '#BEB09E', text: 'Services: Selling' },
    { name: 'austin-aerial.jpg', color: '#F4F1EC', text: 'Austin Aerial BG' },
    { name: 'testimonial-bg.jpg', color: '#F0F0F0', text: 'Testimonial BG' },
    { name: 'buyers-guide-mockup.png', color: '#FFFFFF', text: 'Guide Mockup' }, // Keeping png
];

const createSVG = (text, color) => `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="#333">${text}</text>
</svg>
`;

// Note: Usage of .jpg for SVG content works in some browsers if served right, but mostly likely not as a file.
// Ideally I should convert them. But since I can't easily without tools...
// I will create them as .svg files and update my plan to use .svg extensions in the code OR
// I can just rely on the fact that I'll instruct the user to replace them.
// But the user wants code updates.
// I will create them as .svg files in public/images/ and use .svg in the code for now, 
// OR rename them to .jpg but they will be SVGs inside (browsers might reject this).

// Better plan: Create a minimal 1x1 pixel JPEG or PNG if possible? 
// No, SVGs are safest for "no dependency" generation.
// I will create them as .svg files.

images.forEach(img => {
    const content = createSVG(img.text, img.color);
    const path = `public/images/${img.name.replace('.jpg', '.svg').replace('.png', '.svg')}`;
    fs.writeFileSync(path, content);
    console.log(`Created ${path}`);
});
