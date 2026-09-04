export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Account & Wallet Freezing Rights</h2>
          <p>
            Tradescrow reserves the right to immediately freeze active transactions, suspend wallet payouts, 
            and restrict platform access if a deal is flagged for dispute, unusual activity, or policy violations. 
            Frozen assets remain locked in escrow until formal administrative review is concluded.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Strict Anti-Fraud & Prohibited Conduct</h2>
          <p>
            Fraudulent activities—including but not limited to chargeback abuse, fake delivery proof, identity impersonation, 
            and trade manipulation—are strictly prohibited. Accounts engaging in prohibited conduct will be permanently 
            banned and blacklisted using device and cryptographic identity markers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Law Enforcement & Regulatory Cooperation</h2>
          <p>
            In compliance with applicable data privacy regulations (including NDPA guidelines), Tradescrow maintains detailed audit logs 
            of transactions, communications, device fingerprints, and verified identities. In the event of criminal investigations or formal legal inquiries, 
            these records will be disclosed to authorized law enforcement and regulatory authorities.
          </p>
        </div>
      </section>
    </main>
  );
    }
    
