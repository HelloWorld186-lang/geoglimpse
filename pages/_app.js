import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-100">Geo Glimpse</h1>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>

      <footer className="bg-gray-800 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Geo Glimpse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MyApp