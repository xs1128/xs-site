import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function TestConnection() {
  const supabase = await createClient();

  // Test each table
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .limit(5);

  const { data: series, error: seriesError } = await supabase
    .from("series")
    .select("*")
    .limit(5);

  const { data: pictures, error: picturesError } = await supabase
    .from("pictures")
    .select("*")
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Posts Table</h2>
        {postsError ? (
          <div className="text-red-500">Error: {postsError.message}</div>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(posts, null, 2)}
          </pre>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Series Table</h2>
        {seriesError ? (
          <div className="text-red-500">Error: {seriesError.message}</div>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(series, null, 2)}
          </pre>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Pictures Table</h2>
        {picturesError ? (
          <div className="text-red-500">Error: {picturesError.message}</div>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(pictures, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default function TestSupabasePage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-blue-800">
          <strong>Status:</strong> If you see data below, your Supabase connection is working!
          If you see errors, make sure you:
        </p>
        <ol className="list-decimal list-inside text-blue-800 mt-2 space-y-1">
          <li>Copied <code className="bg-blue-100 px-1 rounded">.env.example</code> to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
          <li>Filled in your Supabase URL and Anon Key</li>
          <li>Created the tables in your Supabase dashboard</li>
          <li>Restarted the development server</li>
        </ol>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <TestConnection />
      </Suspense>
    </div>
  );
}
