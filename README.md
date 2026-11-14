# 🌸 Happy Birthday Sreoshi Roy ✨
### A Dreamy, Mobile-First Animated Birthday Surprise Website
**Recipient:** Sreoshi Roy  
**Birthday:** 15 November  
**Theme:** Dreamy Midnight Plum (`#1b1030`) to Rose-Gold Gradient  
**Typography:** *Great Vibes* (Headings & Cursive Accents) + *Poppins* (Modern Text)

---

## 🌟 Highlights & Key Features

### 1. Scene 1: Dark Intro & Glowing 3D Gift Box
- **Atmosphere:** Deep midnight plum background with subtle twinkling stars and floating rose-gold/lilac glow orbs.
- **3D Glowing Gift Box:** Handcrafted with metallic rose-gold ribbons, silky bow, pulsing glow aura, and orbiting sparkles.
- **Interactive "Tap to Open Surprise 🎁":**
  - First-tap initializes the audio engine seamlessly in compliance with mobile browser autoplay policies.
  - Triggers an unboxing animation with gift box lid pop, golden burst, and transition to the countdown.

### 2. Scene 2: 3-2-1 Countdown & Grand Reveal
- **Cinematic Countdown:** Numbers `3`, `2`, `1` scale and pulse onto the screen with harmonic bell chimes.
- **Celebratory Explosion:**
  - Multi-burst confetti cannons featuring rose gold, champagne, plum, and shimmering stars.
  - Floating balloons drifting upward across the screen.
- **Typewriter Effect:**
  - Metallic rose-gold heading: *"Happy Birthday, Sreoshi Roy!"*
  - Typewritten message celebrating her 15th of November birthday.
  - Smooth scroll prompt leading to the next scene.

### 3. Scene 3: Floating Polaroid Photo Gallery
- **Real Photos Integrated**: 7 beautiful real photos of Sreoshi Roy from `Downloads\birthday gift` converted from iPhone HEIC into high-resolution web JPEGs (`assets/images/photo1.jpg` to `photo7.jpg`).
- **Authentic Polaroid Aesthetics:** White glossy frames, washi tape accents, and handwritten script captions.
- **Interactive 3D Motion:** Gentle hover & touch tilt physics (cards tilt towards touch/pointer).
- **Interactive Lightbox:** Tap any polaroid to see it enlarged in high-res with a personalized memory note.
- **Personalize Photos:** Visitors can upload additional real photos directly through the browser. Uploaded photos instantly replace the polaroids and persist in `localStorage`! Includes a "Reset" button to restore default photos anytime.

### 4. Scene 4: Clickable Wish Bubbles
- **Shimmering Glass Bubbles:** 6 iridescent floating bubbles that gently bob up and down with organic physics.
- **Interactive Pop Mechanics:**
  - Tapping a bubble triggers a pop sound, sparkle particles, and marks the bubble as collected.
  - Opens a glassmorphism modal with heartfelt birthday wishes:
    1. 💖 **Boundless Joy**
    2. 🌟 **Dreams Come True**
    3. 🕊️ **Inner Peace & Grace**
    4. 🌸 **Everlasting Glow**
    5. 🚀 **Limitless Success**
    6. 🍫 **Sweet Blessings**
- **Wish Tracker:** Tracks "X / 6 Wishes Collected" with a celebratory confetti burst once all are unlocked.

### 5. Scene 5: Make-a-Wish Candle, Grand Fireworks & Closing Note
- **Interactive Birthday Cake:** Frosted rose-gold cake with a candle and realistic flickering flame with amber halo.
- **Blow Mechanisms:**
  - **Button:** "Blow Out the Candle 🎂"
  - **Flame Tap:** Tap the flame directly to extinguish.
  - **Microphone:** Optional "Blow Into Phone Mic" feature that detects the sound of a blow!
- **Extinguishing Sequence:** Flame goes out with curling smoke wisps + soft whoosh sound.
- **Grand Fireworks Display:** Full-screen multi-color fireworks burst across the midnight sky (golden willows, rose-gold sparkles, chrysanthemum bursts) with boom sound effects.
- **Heartfelt Letter:** Glassmorphic card unfurls with a closing birthday letter celebrating Sreoshi Roy.
- **Guestbook / Wishes Wall:** Friends and family can type and post sweet birthday messages that save directly in the browser!
- **Action Buttons:** "Replay The Magic ↺" and "Share Birthday Love 💖" (copies link or opens native mobile share sheet).

---

## 🎵 Music & Soundtrack Experience

The website features an enhanced music player with real romantic soundtracks and procedural fallback:

1. **Preloaded Soundtracks Included**:
   - 🎶 **Tender & Hopeful Longing** (`assets/audio/birthday.mp3`) — Lush, emotional piano & orchestral acoustic arrangement that plays automatically when unboxing.
   - 🌸 **আমার সোনার ময়না পাখি** (`assets/audio/amar_moyna.mp3`) — Traditional soulful acoustic melody.
   - 🔔 **Enchanted Music Box Celesta** — Built-in procedural Web Audio API chime lullaby.
2. **Interactive Music Controls in Top Bar**:
   - **Play/Pause Button**: Shows animated equalizing sound waves while playing.
   - **Track Selector Menu**: Tap to switch between soundtracks in real time with toast feedback.
   - **Custom Song Uploader**: Tap "Upload Custom Song..." to load and play any song directly from your phone or laptop!
3. **Sound Effects (SFX)**:
   - Box unwrap sparkle chime, countdown bells, bubble pops, breath whoosh, and fireworks booms.

---

## 📱 Mobile-First & Smooth Performance

- **Fluid Typography:** Uses CSS `clamp()` for perfect rendering on any screen size from iPhone SE (375px) to tablets and large desktops.
- **Safe Area Insets:** Accounts for phone notches and bottom navigation bars.
- **60fps Hardware Acceleration:** Canvas-based particles, confetti, and fireworks avoid DOM clutter and keep phone GPUs cool.
- **Touch-Friendly:** All interactive touch targets are at least 48px high with instant tactile response.

---

## 🚀 How to Run

### Method 1: Direct File Open
Simply double-click `index.html` in any modern web browser (Chrome, Safari, Edge, Firefox).

### Method 2: Local Web Server (Recommended for mobile testing)
Run a lightweight local server:
```bash
# Using Python:
python -m http.server 8080

# Or using Node.js / npx:
npx serve .
```
Open `http://localhost:8080` (or your local IP address `http://192.168.x.x:8080` on your mobile phone connected to the same Wi-Fi) to experience the full mobile surprise!
