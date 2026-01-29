        /**
         * FMG--toggleAnswer
         * Toggles the visibility and content height of the FAQ answer smoothly.
         * @param {HTMLElement} button The button element that was clicked.
         */
        function FMG_toggleAnswer(button) {
            // Get the parent item container
            const item = button.closest('.FMG--FaqItem');

            // Find the answer content and chevron icon within this item
            const answer = item.querySelector('.FMG--AnswerContent');
            const chevron = item.querySelector('.FMG--Chevron');

            // Check if the current item is already active
            const is_active = answer.classList.contains('active');

            // --- FMG--Close All Answers Logic ---
            // Find all other active answers and close them first
            document.querySelectorAll('.FMG--AnswerContent.active').forEach(activeAnswer => {
                if (activeAnswer !== answer) {
                    activeAnswer.classList.remove('active');
                    // Also update the chevron for the closed items
                    activeAnswer.closest('.FMG--FaqItem').querySelector('.FMG--Chevron').classList.remove('active');
                }
            });

            // --- FMG--Toggle Current Answer Logic ---
            if (!is_active) {
                // If it was closed, open it (add 'active' class)
                answer.classList.add('active');
                chevron.classList.add('active');
            } else {
                // If it was open, close it (remove 'active' class)
                answer.classList.remove('active');
                chevron.classList.remove('active');
            }
        }
  