import anime from 'animejs';

const acronyms = [
  "Doing Outstanding Music for Good",
  "Dare to Overcome with Music and Grace",
  "Drive Original Melodies for Growth",
  "Drop Over Mediocrity, Go beyond",
  "Dedicated to Opening Minds with Groove",
  "Defining Our Mission through Genres",
  "Deep Organic Music Gives",
  "Drive Opportunity through Music and Giving",
  "Drop Of Music, Galaxy of meaning",
  "Do Only Meaningful Grooves",
  "Dream Of Music Globalized",
  "Different Outlooks, Mutual Goal",
  "Design Our Melody for Goodness",
  "Dare Others with Music Generosity",
  "Do Our Magic Globally",
  "Deliver On Music’s Gift",
  "Dreamers Opening Minds through Groove",
  "Drop Old Models, Grow new",
  "Defend Originality, Make Good",
  "Dedicated Organizers of Music and Goodwill"
];

const subtitles = [
    "Where Every Note Has a Name.",
    "Crafting Your Unique Sound.",
    "Music Tailored to Your Story.",
    "The Soundtrack to Your Life.",
    "Original Melodies, Meaningful Moments."
];

const targetLetters = ['D', 'O', 'M', 'G'];
const slotsSection = document.getElementById('slots-section');
const dynamicSubtitle = document.getElementById('dynamic-subtitle');
const rowCount = 4; // Number of slot rows
const rows = [];
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ?!#$&';
const reelLength = 20; // Number of characters in each reel + target letter

function getRandomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

// Generate Reels for one slot
function generateReel(targetLetter) {
    const reel = document.createElement('div');
    reel.className = 'slot-reel';
    // Add random chars
    for (let i = 0; i < reelLength; i++) {
        const span = document.createElement('span');
        span.textContent = getRandomChar();
        reel.appendChild(span);
    }
    // Add the target letter at the end
    const targetSpan = document.createElement('span');
    targetSpan.textContent = targetLetter;
    reel.appendChild(targetSpan);

    // Set initial position to show a random char
    const randomOffset = Math.floor(Math.random() * reelLength);
    const slotHeight = reel.querySelector('span').offsetHeight || 100; // Estimate or get actual height
    reel.style.transform = `translateY(-${randomOffset * slotHeight}px)`;

    return reel;
}

// Initialize Slots
for (let i = 0; i < rowCount; i++) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'slot-row-wrapper';

  const rowDiv = document.createElement('div');
  rowDiv.className = 'slot-row';

  const acronymText = document.createElement('div');
  acronymText.className = 'acronym';
  acronymText.id = `acronym-${i}`;

  const slotElements = [];

  for (let j = 0; j < targetLetters.length; j++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    const reel = generateReel(targetLetters[j]);
    slot.appendChild(reel);
    rowDiv.appendChild(slot);
    slotElements.push({ slot, reel });
  }

  wrapperDiv.appendChild(rowDiv);
  wrapperDiv.appendChild(acronymText);
  slotsSection.appendChild(wrapperDiv);
  rows.push({ slots: slotElements, acronymElement: acronymText });
}

// Get actual slot height after rendering (important for accurate translation)
let slotHeight = 100; // Default fallback
if (rows.length > 0 && rows[0].slots.length > 0) {
    const firstReelSpan = rows[0].slots[0].reel.querySelector('span');
    if (firstReelSpan) {
         // Ensure styles are applied before getting offsetHeight
        requestAnimationFrame(() => {
             slotHeight = firstReelSpan.offsetHeight;
             // console.log("Detected slot height:", slotHeight);
             // Optionally re-initialize start positions if needed
        });
    }
}

function spinRow(rowIndex) {
    const row = rows[rowIndex];
    const { slots, acronymElement } = row;

    // Hide previous acronym
    acronymElement.classList.remove('visible');
    acronymElement.textContent = ''; // Clear old text

    slots.forEach(({ reel }, slotIndex) => {
        reel.classList.add('spin'); // Add class for fast spinning animation

        const totalReelHeight = reel.children.length * slotHeight;
        const targetPosition = (reel.children.length - 1) * slotHeight; // Position of the target letter (last one)
        const spinCycles = 3; // How many full rotations
        const randomStartOffset = Math.floor(Math.random() * reelLength) * slotHeight;

        // Use anime.js for controlled animation
        anime({
            targets: reel,
            translateY: [
                // Start from a random offset to make spins look different
                `-${randomStartOffset}px`,
                // Spin down multiple times
                `-${totalReelHeight * spinCycles + targetPosition}px`
            ],
            duration: 2000 + slotIndex * 200 + rowIndex * 300, // Staggered duration
            easing: 'cubicBezier(0.33, 1, 0.68, 1)', // Ease out easing
            complete: () => {
                // Ensure it lands exactly on the target letter
                reel.style.transform = `translateY(-${targetPosition}px)`;
                reel.classList.remove('spin'); // Remove spin class

                // Check if this is the last slot in the row to finish animating
                if (slotIndex === slots.length - 1) {
                    const randomAcronym = acronyms[Math.floor(Math.random() * acronyms.length)];
                    acronymElement.textContent = randomAcronym;
                    acronymElement.classList.add('visible'); // Fade in acronym

                    // Schedule the next spin for this row
                    setTimeout(() => spinRow(rowIndex), 3000 + Math.random() * 2000); // Wait 3-5 seconds before next spin
                }
            }
        });
    });
}

// Start spinning each row with a slight delay
rows.forEach((_, index) => {
    setTimeout(() => spinRow(index), index * 500); // Stagger the start of each row
});


// Update dynamic subtitle
let subtitleIndex = 0;
function updateSubtitle() {
    dynamicSubtitle.style.opacity = 0;
    setTimeout(() => {
        subtitleIndex = (subtitleIndex + 1) % subtitles.length;
        dynamicSubtitle.textContent = subtitles[subtitleIndex];
        dynamicSubtitle.style.opacity = 1;
    }, 500); // Fade-out duration
}

setInterval(updateSubtitle, 5000); // Change subtitle every 5 seconds
dynamicSubtitle.style.transition = 'opacity 0.5s ease-in-out';

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

