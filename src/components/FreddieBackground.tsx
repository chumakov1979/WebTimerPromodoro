import React from 'react';

interface FreddieBackgroundProps {
  isPlaying?: boolean;
  className?: string;
  opacity?: number;
}

export const FreddieBackground: React.FC<FreddieBackgroundProps> = ({
  isPlaying = false,
  className = '',
  opacity,
}) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}
      style={opacity !== undefined ? { opacity: opacity / 100 } : undefined}
    >
      <svg
        viewBox="0 0 500 850"
        className="w-full h-full max-h-[85vh] object-contain drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wembley Yellow Jacket Gradient */}
          <linearGradient id="posterYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffdc2e" />
            <stop offset="45%" stopColor="#ffd000" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Skin Tone Gradient */}
          <linearGradient id="skinTone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Pants Shading */}
          <linearGradient id="pantsShading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f4f4f5" />
            <stop offset="100%" stopColor="#e4e4e7" />
          </linearGradient>
        </defs>

        {/* ========================================================
            FREDDIE MERCURY FIGURE - EXACT REPRODUCTION FROM USER IMAGE
           ======================================================== */}
        <g id="freddie-figure">
          {/* --- RAISED RIGHT ARM & CLENCHED FIST --- */}
          {/* Fist */}
          <path
            d="M 195 90 
               C 192 82, 196 72, 204 70
               C 212 68, 222 72, 224 82
               C 226 90, 220 98, 212 102
               C 205 105, 198 100, 195 90 Z"
            fill="#fbbf24"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Fingers of the fist */}
          <path d="M 200 78 C 205 76, 212 76, 216 80" stroke="#111111" strokeWidth="2.5" />
          <path d="M 198 84 C 204 82, 214 82, 218 86" stroke="#111111" strokeWidth="2.5" />
          <path d="M 198 90 C 204 88, 212 88, 216 92" stroke="#111111" strokeWidth="2.5" />
          {/* Thumb */}
          <path d="M 208 98 C 214 96, 218 90, 216 84" stroke="#111111" strokeWidth="2.5" />

          {/* White wristband */}
          <rect x="195" y="102" width="22" height="10" rx="3" fill="#ffffff" stroke="#111111" strokeWidth="3" />

          {/* Yellow Jacket Right Sleeve (Vertical raised) */}
          <path
            d="M 197 112 
               L 190 205 
               L 220 220 
               L 218 112 Z"
            fill="url(#posterYellow)"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Sleeve folds & highlights */}
          <path d="M 193 150 C 200 155, 208 152, 214 148" stroke="#111111" strokeWidth="2.5" />
          <path d="M 192 180 C 198 185, 208 182, 216 178" stroke="#111111" strokeWidth="2.5" />
          <path d="M 218 112 L 220 220" stroke="#dc2626" strokeWidth="3.5" />

          {/* --- HEAD, HAIR & MUSTACHE --- */}
          {/* Neck */}
          <path d="M 245 220 L 245 255 L 265 255 L 265 220 Z" fill="#fbbf24" stroke="#111111" strokeWidth="3" />
          
          {/* Face */}
          <path
            d="M 240 190 
               C 238 175, 245 160, 260 160
               C 275 160, 282 175, 280 190
               C 278 208, 268 222, 255 222
               C 246 222, 241 205, 240 190 Z"
            fill="#fbbf24"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Hair (Classic slicked back black hair) */}
          <path
            d="M 240 178 
               C 238 160, 248 145, 262 145
               C 276 145, 285 158, 282 175
               C 278 170, 268 165, 260 166
               C 250 167, 244 172, 240 178 Z"
            fill="#111111"
          />
          {/* Eyebrows */}
          <path d="M 248 180 Q 254 178 258 181" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 264 180 Q 270 178 274 181" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="253" cy="184" r="2" fill="#111111" />
          <circle cx="268" cy="184" r="2" fill="#111111" />
          {/* Nose */}
          <path d="M 260 183 L 258 194 L 263 194" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
          {/* Iconic Thick Black Mustache */}
          <path
            d="M 248 198 
               C 254 196, 262 196, 272 198
               C 270 205, 262 206, 260 204
               C 258 206, 250 205, 248 198 Z"
            fill="#111111"
          />
          {/* Mouth */}
          <path d="M 252 208 Q 260 211 268 208" stroke="#111111" strokeWidth="2" strokeLinecap="round" />

          {/* --- TORSO & FAMOUS WEMBLEY MILITARY JACKET --- */}
          {/* White Tank Top / Chest V-neck */}
          <path
            d="M 240 250 
               L 260 290 
               L 280 250 
               L 290 340 
               L 230 340 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Chest definition */}
          <path d="M 252 265 Q 260 272 268 265" stroke="#fbbf24" strokeWidth="2.5" />

          {/* Yellow Jacket Main Body */}
          {/* Left side of jacket (facing viewer's right) */}
          <path
            d="M 280 235 
               C 310 245, 335 270, 340 310
               L 320 380 
               L 280 375 
               L 285 240 Z"
            fill="url(#posterYellow)"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Right side of jacket (facing viewer's left) */}
          <path
            d="M 225 235 
               C 205 250, 195 285, 190 330
               L 210 375 
               L 240 375 
               L 235 240 Z"
            fill="url(#posterYellow)"
            stroke="#111111"
            strokeWidth="3.5"
          />

          {/* Red & White Jacket Trim / Piping */}
          <path d="M 228 238 L 242 375" stroke="#dc2626" strokeWidth="3.5" />
          <path d="M 285 238 L 278 375" stroke="#dc2626" strokeWidth="3.5" />
          <path d="M 335 270 L 320 380" stroke="#dc2626" strokeWidth="3.5" />

          {/* Iconic Horizontal Military Buckle Straps on Jacket */}
          <g stroke="#111111" strokeWidth="2.5">
            {/* Strap 1 */}
            <line x1="282" y1="262" x2="315" y2="268" />
            <rect x="296" y="261" width="6" height="6" fill="#ffffff" stroke="#111111" strokeWidth="2" />
            {/* Strap 2 */}
            <line x1="282" y1="282" x2="320" y2="290" />
            <rect x="298" y="281" width="6" height="6" fill="#ffffff" stroke="#111111" strokeWidth="2" />
            {/* Strap 3 */}
            <line x1="280" y1="302" x2="320" y2="310" />
            <rect x="298" y="301" width="6" height="6" fill="#ffffff" stroke="#111111" strokeWidth="2" />
            {/* Strap 4 */}
            <line x1="280" y1="322" x2="318" y2="330" />
            <rect x="296" y="321" width="6" height="6" fill="#ffffff" stroke="#111111" strokeWidth="2" />
            {/* Strap 5 */}
            <line x1="278" y1="342" x2="315" y2="350" />
            <rect x="294" y="341" width="6" height="6" fill="#ffffff" stroke="#111111" strokeWidth="2" />
            {/* Strap 6 */}
            <line x1="278" y1="362" x2="310" y2="368" />
            <rect x="292" y="361" width="6" height="6" fill="#ffffff" stroke="#111111" strokeWidth="2" />
          </g>

          {/* --- LEFT ARM HOLDING MIC STAND --- */}
          {/* Left upper arm & forearm */}
          <path
            d="M 330 275 
               C 345 300, 360 335, 368 375
               L 350 380 
               C 342 340, 330 310, 318 290 Z"
            fill="url(#posterYellow)"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Forearm & Hand */}
          <path
            d="M 368 375 
               L 362 430 
               C 362 445, 378 445, 378 430 
               L 378 380 Z"
            fill="#fbbf24"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Hand gripping microphone */}
          <circle cx="368" cy="435" r="9" fill="#fbbf24" stroke="#111111" strokeWidth="3" />

          {/* Cut-off Microphone and Stick */}
          <line x1="368" y1="415" x2="368" y2="580" stroke="#111111" strokeWidth="4.5" strokeLinecap="round" />
          {/* Mic head at top */}
          <rect x="363" y="405" width="10" height="15" rx="3" fill="#111111" />
          <line x1="368" y1="405" x2="368" y2="395" stroke="#111111" strokeWidth="3" />

          {/* --- WHITE BELT & BUCKLE --- */}
          <path
            d="M 220 375 L 305 375 L 300 398 L 222 398 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Belt Buckle */}
          <rect x="252" y="375" width="18" height="23" rx="2" fill="#ffffff" stroke="#111111" strokeWidth="3" />
          <rect x="257" y="380" width="8" height="13" fill="#e4e4e7" stroke="#111111" strokeWidth="2" />

          {/* --- WHITE TROUSERS WITH FAMOUS STRIPES --- */}
          {/* Right Leg (Striding forward/left) */}
          <path
            d="M 230 398 
               C 220 440, 195 500, 160 560
               L 135 625 
               L 175 628 
               C 205 570, 235 500, 255 425 Z"
            fill="url(#pantsShading)"
            stroke="#111111"
            strokeWidth="3.5"
          />

          {/* Left Leg (Striding back/right) */}
          <path
            d="M 285 398 
               C 305 440, 335 500, 365 560
               L 395 625 
               L 360 628 
               C 335 570, 305 500, 265 425 Z"
            fill="url(#pantsShading)"
            stroke="#111111"
            strokeWidth="3.5"
          />

          {/* Red & Gold Stripes on Legs (Matching the uploaded image exactly) */}
          {/* Right Leg Stripe */}
          <path d="M 225 400 L 140 622" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
          <path d="M 228 400 L 143 622" stroke="#ffd000" strokeWidth="3" strokeLinecap="round" />

          {/* Left Leg Stripe */}
          <path d="M 290 400 L 390 622" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
          <path d="M 288 400 L 388 622" stroke="#ffd000" strokeWidth="3" strokeLinecap="round" />

          {/* Trouser folds & creases */}
          <path d="M 215 480 Q 225 485 235 480" stroke="#d4d4d8" strokeWidth="2.5" />
          <path d="M 180 550 Q 190 555 200 550" stroke="#d4d4d8" strokeWidth="2.5" />
          <path d="M 310 480 Q 320 485 330 480" stroke="#d4d4d8" strokeWidth="2.5" />
          <path d="M 345 550 Q 355 555 365 550" stroke="#d4d4d8" strokeWidth="2.5" />

          {/* --- ADIDAS SNEAKERS --- */}
          {/* Right Foot */}
          <path
            d="M 130 625 
               C 120 628, 110 632, 112 642
               L 165 642 
               C 170 635, 168 626, 160 625 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Sole */}
          <path d="M 112 642 L 165 642" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
          {/* Black stripes */}
          <line x1="140" y1="627" x2="135" y2="640" stroke="#111111" strokeWidth="2" />
          <line x1="146" y1="627" x2="141" y2="640" stroke="#111111" strokeWidth="2" />
          <line x1="152" y1="627" x2="147" y2="640" stroke="#111111" strokeWidth="2" />

          {/* Left Foot */}
          <path
            d="M 362 625 
               C 355 626, 352 635, 355 642
               L 410 642 
               C 412 632, 402 628, 392 625 Z"
            fill="#ffffff"
            stroke="#111111"
            strokeWidth="3.5"
          />
          {/* Sole */}
          <path d="M 355 642 L 410 642" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
          {/* Black stripes */}
          <line x1="375" y1="627" x2="380" y2="640" stroke="#111111" strokeWidth="2" />
          <line x1="381" y1="627" x2="386" y2="640" stroke="#111111" strokeWidth="2" />
          <line x1="387" y1="627" x2="392" y2="640" stroke="#111111" strokeWidth="2" />
        </g>

        {/* ========================================================
            SOLID BLACK HORIZONTAL PLATFORM BAR
           ======================================================== */}
        <rect x="55" y="642" width="390" height="15" rx="2" fill="#111111" />

        {/* Mic stand continuing downward through the black bar */}
        <line x1="368" y1="580" x2="368" y2="675" stroke="#111111" strokeWidth="4.5" strokeLinecap="round" />

        {/* ========================================================
            BOLD CONDENSED GRAPHIC POSTER TYPOGRAPHY
            MATCHING USER'S IMAGE 100% UNCHANGED
           ======================================================== */}
        {/* "THE" */}
        <text
          x="250"
          y="615"
          textAnchor="middle"
          fill="#111111"
          className="font-bebas font-black"
          style={{ fontSize: '38px', letterSpacing: '0.04em' }}
        >
          THE
        </text>

        {/* "SHOW" */}
        <text
          x="250"
          y="642"
          textAnchor="middle"
          fill="#111111"
          className="font-bebas font-black"
          style={{ fontSize: '74px', letterSpacing: '0.02em' }}
        >
          SHOW
        </text>

        {/* "MUST" - Giant underneath the bar */}
        <text
          x="250"
          y="760"
          textAnchor="middle"
          fill="#111111"
          className="font-bebas font-black"
          style={{ fontSize: '135px', letterSpacing: '-0.01em', fontWeight: 900 }}
        >
          MUST
        </text>

        {/* "GO ON" */}
        <text
          x="250"
          y="815"
          textAnchor="middle"
          fill="#111111"
          className="font-bebas font-black"
          style={{ fontSize: '56px', letterSpacing: '0.08em', fontWeight: 900 }}
        >
          GO ON
        </text>
      </svg>
    </div>
  );
};
