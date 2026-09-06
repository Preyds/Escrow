// terms-guard.js - Dashboard Terms Guard

(function () {
    // 1. Inject Modal HTML into DOM
    function injectTermsModal() {
        if (document.getElementById('termsModal')) return;

        const modalHTML = `
            <div id="termsModal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-gray-800 border border-gray-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
                    <h2 class="text-lg font-bold text-yellow-500">📜 Updated Terms & Dispute Policy</h2>
                    
                    <p class="text-xs text-gray-300 leading-relaxed">
                        Before using Tradescrow, please review and accept our updated policies to ensure a safe peer-to-peer trading environment.
                    </p>

                    <div class="bg-gray-950 p-3 rounded-xl border border-gray-700 flex flex-col gap-2 text-xs">
                        <a href="terms-of-service.html" target="_blank" class="text-yellow-400 hover:underline flex items-center justify-between">
                            <span>📄 Terms of Service</span>
                            <span class="text-gray-500 text-[10px]">Read ↗</span>
                        </a>
                        <hr class="border-gray-800">
                        <a href="dispute-policy.html" target="_blank" class="text-yellow-400 hover:underline flex items-center justify-between">
                            <span>⚖️ Dispute Policy</span>
                            <span class="text-gray-500 text-[10px]">Read ↗</span>
                        </a>
                    </div>

                    <label class="flex items-center gap-3 text-xs text-gray-300 cursor-pointer pt-2">
                        <input type="checkbox" id="termsCheckbox" class="w-4 h-4 accent-yellow-500 rounded border-gray-700">
                        <span>I have read and agree to the Terms of Service and Dispute Policy.</span>
                    </label>

                    <button id="acceptTermsBtn" onclick="submitTermsAcceptance()" disabled class="w-full bg-yellow-500 text-gray-950 font-bold py-3 rounded-xl text-sm opacity-50 cursor-not-allowed transition hover:bg-yellow-600">
                        Continue to Dashboard
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Bind checkbox handler
        const checkbox = document.getElementById('termsCheckbox');
        const acceptBtn = document.getElementById('acceptTermsBtn');

        checkbox.addEventListener('change', (e) => {
            acceptBtn.disabled = !e.target.checked;
            acceptBtn.classList.toggle('opacity-50', !e.target.checked);
            acceptBtn.classList.toggle('cursor-not-allowed', !e.target.checked);
        });
    }

    // 2. Check Database Acceptance Status
    window.checkTermsAcceptance = async function (activeUser) {
        if (!activeUser) return;
        
        // Fast local check
        if (localStorage.getItem(`terms_accepted_${activeUser}`)) return;

        injectTermsModal();

        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('terms_accepted')
                .eq('email', activeUser)
                .single();

            if (data && !data.terms_accepted) {
                document.getElementById('termsModal').classList.remove('hidden');
            } else if (data && data.terms_accepted) {
                localStorage.setItem(`terms_accepted_${activeUser}`, 'true');
            }
        } catch (err) {
            console.error("Terms verification error:", err);
        }
    };

    // 3. Record Acceptance to Supabase
    window.submitTermsAcceptance = async function () {
        const activeUser = localStorage.getItem('tradescrow_user_email') || 
                           localStorage.getItem('userEmail') || 
                           localStorage.getItem('email');

        const btn = document.getElementById('acceptTermsBtn');
        btn.disabled = true;
        btn.textContent = "Updating...";

        try {
            const { error } = await supabaseClient
                .from('profiles')
                .update({ 
                    terms_accepted: true,
                    terms_accepted_at: new Date().toISOString()
                })
                .eq('email', activeUser);

            if (error) throw error;

            localStorage.setItem(`terms_accepted_${activeUser}`, 'true');
            document.getElementById('termsModal').classList.add('hidden');
        } catch (err) {
            alert("Failed to record acceptance: " + err.message);
            btn.disabled = false;
            btn.textContent = "Continue to Dashboard";
        }
    };
})();
      document.addEventListener('DOMContentLoaded', async () => {
  const modal = document.getElementById('terms-modal');
  const termsBox = document.getElementById('terms-box');
  const acceptBtn = document.getElementById('accept-terms-btn');

  // 1. Verify user session state after sign-in/login
  const userAccepted = localStorage.getItem('tradescrow_terms_accepted');

  if (!userAccepted) {
    // Show modal directly after authentication
    modal.classList.remove('hidden');

    // 2. Scroll detection for both mobile touch and desktop scroll events
    const checkScroll = () => {
      // Calculate scroll progress with a 10px threshold
      const isAtBottom = termsBox.scrollTop + termsBox.clientHeight >= termsBox.scrollHeight - 10;
      
      if (isAtBottom) {
        acceptBtn.disabled = false;
        acceptBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    };

    termsBox.addEventListener('scroll', checkScroll);
    termsBox.addEventListener('touchmove', checkScroll); // Smooth detection on mobile web browsers

    // 3. Store user consent and grant access
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('tradescrow_terms_accepted', 'true');
      modal.classList.add('hidden');
    });
  }
});

