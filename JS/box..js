            // Get the elements we need to manipulate
            const switchElement = document.getElementById('fundingSwitch');
            const textElement = document.querySelector('#fundingToggleContainer .toggle-text');

            // Function to handle the ON/OFF logic
            function toggleSwitch() {
                // Check if the 'active' class is currently present (which means it's ON)
                const isActive = switchElement.classList.contains('active');

                if (isActive) {
                    // If it's ON, turn it OFF
                    switchElement.classList.remove('active');
                    textElement.innerHTML = 'Turn on<br>Growth';
                } else {
                    // If it's OFF, turn it ON
                    switchElement.classList.add('active');
                    textElement.innerHTML = 'Turn off<br>Growth';
                }
            }
        