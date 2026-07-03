import * as React from 'react';
import { Spinner } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';

export function SpinnerButton() {
  const [loading, setLoading] = React.useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="flex gap-3">
      <Button onClick={simulateLoading} disabled={loading}>
        {loading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Loading...
          </>
        ) : (
          'Click to Load'
        )}
      </Button>
      <Button variant="secondary" onClick={simulateLoading} disabled={loading}>
        {loading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Processing...
          </>
        ) : (
          'Process Data'
        )}
      </Button>
    </div>
  );
}
