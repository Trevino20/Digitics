
        // GSAP is loaded via CDN link in the head

        let pathData = {}; 
        let canvasContext;
        const animationProps = { pathOffset: 0 }; 

        /**
         * Calculates the coordinates of card centers and the total path length,
         * resizing the canvas dynamically to cover the path.
         */
        function calculatePath() {
            const container = document.getElementById('journey-container');
            const wrapper = document.getElementById('process-wrapper');
            const cardElements = Array.from(document.querySelectorAll('.process-card'));
            const canvas = document.getElementById('connector-canvas');
            
            if (cardElements.length < 2) return null;

            // Use getBoundingClientRect to get accurate positions
            const containerRect = container.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            
            // Set canvas size and position relative to its container
            canvas.width = containerRect.width;
            canvas.height = wrapperRect.height + 20; // +20 for buffer
            // Position canvas to cover the wrapper
            canvas.style.top = `${wrapper.offsetTop}px`; 
            canvas.style.left = `0px`;

            canvasContext = canvas.getContext('2d');
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            // Map card centers (x, y) relative to the top-left of the wrapper/canvas
            const centers = cardElements.map(el => {
                const cardRect = el.getBoundingClientRect();
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const cardCenterX = cardRect.left + cardRect.width / 2;

                return {
                    x: cardCenterX - containerRect.left, // X coordinate relative to canvas
                    y: cardCenterY - wrapperRect.top, // Y coordinate relative to canvas
                    side: el.closest('.process-step-container').getAttribute('data-side')
                };
            });

            // Estimate total length for stroke-dashoffset animation
            let totalPathLength = 0;
            for (let i = 1; i < centers.length; i++) {
                const p0 = centers[i - 1];
                const p1 = centers[i];
                const dist = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
                // Use a factor of 1.5 for desktop to account for curves; 1 for mobile straight lines
                totalPathLength += dist * (window.innerWidth < 1024 ? 1 : 1.5); 
            }
            
            return { centers, totalPathLength };
        }

        /**
         * Draws the dotted path on the canvas, handling both mobile (straight) 
         * and desktop (curved zig-zag) layouts.
         * @param {number} offset - The scroll-driven progress (0 to totalPathLength)
         */
        function drawLine(offset = 0) {
            if (!canvasContext || !pathData.centers) return;

            const { centers, totalPathLength } = pathData;
            
            canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = '#d3d3d3'; 
            canvasContext.setLineDash([8, 8]); 
            
            // This is the core of the drawing animation: stroke-dashoffset
            canvasContext.lineDashOffset = totalPathLength - offset;

            canvasContext.beginPath();
            
            const isMobile = window.innerWidth < 1024;
            // The starting point is the center of the first card
            canvasContext.moveTo(centers[0].x, centers[0].y);

            // Calculate the central X point for the vertical mobile line
            const mobileCenterX = canvasContext.canvas.width / 2; 

            for (let i = 1; i < centers.length; i++) {
                const p0 = centers[i - 1];
                const p1 = centers[i];

                if (isMobile) {
                    // Mobile: Draw to the central vertical line, then down to the next card center
                    
                    // 1. Draw from the previous card center (p0.x, p0.y) to the central line (mobileCenterX, p0.y)
                    canvasContext.lineTo(mobileCenterX, p0.y);

                    // 2. Draw down the central line to the y-position of the next card
                    canvasContext.lineTo(mobileCenterX, p1.y);

                    // 3. Draw from the central line (mobileCenterX, p1.y) to the next card center (p1.x, p1.y)
                    canvasContext.lineTo(p1.x, p1.y);
                    
                    // Move the starting point for the next segment (i+1) to the current card center (p1)
                    canvasContext.moveTo(p1.x, p1.y); 

                } else {
                    // Desktop: Draw a smooth curved line (Bezier curve)
                    const controlOffset = 180; 
                    
                    // Control points create the S-curve between the cards
                    const cp1X = p0.x + (p0.side === 'left' ? controlOffset : -controlOffset);
                    const cp1Y = p0.y;
                    const cp2X = p1.x + (p1.side === 'left' ? controlOffset : -controlOffset);
                    const cp2Y = p1.y;

                    canvasContext.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, p1.x, p1.y);
                }
            }
            
            canvasContext.stroke();
        }


        /**
         * Sets up GSAP ScrollTriggers for both card reveal and path drawing.
         */
        function setupGSAP() {
            gsap.registerPlugin(ScrollTrigger);
            
            // Kill existing triggers to prevent duplicates on resize
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            
            // 1. Card Reveal Animation: Fade in and slide from the side
            gsap.utils.toArray(".process-card").forEach((card) => {
                const isLeft = card.closest('.process-step-container').getAttribute('data-side') === 'left';
                const isMobile = window.innerWidth < 1024;
                
                // Set initial state - adjust x offset for mobile (center alignment)
                gsap.set(card, { 
                    opacity: 0, 
                    y: 60,
                    x: isMobile ? 0 : (isLeft ? -150 : 150),
                    scale: 0.8
                });

                gsap.to(card, {
                    opacity: 1, y: 0, x: 0, scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%", // Start animation when the card enters the view
                        toggleActions: "play none none none",
                    }
                });
            });


            // 2. Dotted Line Drawing Animation: Draw line as user scrolls
            if (pathData.totalPathLength > 0) {
                animationProps.pathOffset = 0; 

                window.lineTrigger = gsap.to(animationProps, {
                    pathOffset: pathData.totalPathLength, 
                    duration: 4, 
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#process-wrapper",
                        start: "top center",
                        end: "bottom center",
                        scrub: true,
                        onUpdate: self => {
                            // Redraw the line on every scroll update
                            drawLine(self.progress * pathData.totalPathLength); 
                        }
                    }
                });
            }
        }


        // --- Initialization and Event Handling ---
        function initJourney() {
            // Recalculate positions first
            pathData = calculatePath(); 
            // Draw the line at 0 progress before setting up triggers
            drawLine(0); 
            // Set up GSAP animations
            setupGSAP();
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            initJourney(); 
            
            // Handle window resize events for full responsiveness
            window.addEventListener('resize', () => {
                // Throttle the resize event slightly
                if (window.resizeTimer) clearTimeout(window.resizeTimer);
                window.resizeTimer = setTimeout(initJourney, 150);
            });
        });
