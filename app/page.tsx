export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          Welcome to the Hotel Management System
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Your all-in-one solution for managing hotel operations and enhancing guest experiences.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/auth/login"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </a>
          <a href="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}