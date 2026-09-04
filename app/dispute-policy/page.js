export default function DisputePolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Dispute Resolution & Evidence Policy</h1>
      
      <section className="mb-6 space-y-4">
        <h2 className="text-xl font-semibold">1. Mandatory Evidence Requirements</h2>
        <p>
          To maintain fairness and eliminate fraudulent claims, all disputes raised on Tradescrow 
          must be substantiated with objective, unedited digital evidence.
        </p>
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="font-semibold text-amber-900">Important Requirement:</p>
          <p className="text-amber-800">
            <strong>Video evidence is mandatory</strong> for all asset, service, and digital transfer disputes. 
            Submissions containing only screenshots may be dismissed if verification requires execution flow.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-6">2. Video Guidelines</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Screen recordings must be continuous and unedited (no cuts, pauses, or blurs).</li>
          <li>The recording must clearly capture the user account login flow, profile verification identifiers, and the specific transaction issue.</li>
          <li>Media must be uploaded directly through the private Trade Room dispute interface to our restricted storage system.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">3. Dispute Adjudication</h2>
        <p>
          Our compliance team reviews submitted evidence alongside automated audit logs. Once a decision 
          is rendered, funds are either disbursed to the seller or returned 100% to the buyer’s original payment channel.
        </p>
      </section>
    </main>
  );
    }
            
