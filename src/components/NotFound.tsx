import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="p-2 space-y-2">
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-2 py-1 text-sm font-black text-white uppercase rounded bg-emerald-500"
        >
          Go back
        </button>
        <Link
          to="/"
          className="px-2 py-1 text-sm font-black text-white uppercase rounded bg-cyan-600"
        >
          Start Over
        </Link>
      </p>
    </div>
  );
}
