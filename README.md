# manu.space v1

A cinematic, highly customized portfolio built entirely with pure HTML, CSS, and vanilla JavaScript. 

Designed for Manu, a Computer Science Engineering student obsessed with elegant coding, deep space aesthetics, and intentional restraint over complexity. The site features organic animations, a "dark room exposure" loader, and fully fluid typography that operates without any external frontend frameworks.

## Live Project
🌐 `manu.space` (coming soon)

## Technologies Used
- HTML5 Semantic Structure
- CSS3 Custom Properties & Animations (Variables, Keyframes, Mix-Blend-Mode)
- Vanilla Javascript (ES6+, DOM Manipulation, Interactive Parallax)

## Features
- **Zero Dependencies**: Entirely bespoke layout and components. No Tailwind, no React, no extraneous libraries.
- **Micro-Animations**: Custom soft-loading delays, typewriting hero text, scroll-based viewport fade-ins manually mapped via Intersection Observer.
- **Cinematic Photography Pipeline**: Subdued monochrome styling utilizing CSS filter chains (contrast, brightness, grayscale, blur) to emulate film stock exposures.
- **Responsive Parallax**: Mathematical interaction mapping to create depth in the Hero image, properly blocked on touch devices to ensure unhindered scrolling.

## Local Deployment
Simply serve the directory through any basic HTTP server. No build step required.
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.
