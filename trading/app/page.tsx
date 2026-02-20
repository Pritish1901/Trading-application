import Link from 'next/link';

export const metadata = {
  title: 'Crypto Trading Platform - AI-Powered Trading',
  description: 'Trade cryptocurrencies with AI-powered insights, real-time analysis, and intelligent risk management.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-neutral-900/80 backdrop-blur border-b border-neutral-700 z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Crypto Trading</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-neutral-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-semibold"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Trade Crypto with
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400"> AI Intelligence</span>
        </h2>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Get real-time market data, AI-powered trade analysis, and intelligent risk assessment. Make smarter trading decisions with our platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
          >
            Start Trading
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-semibold transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 hover:border-indigo-600 transition">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-2">Real-Time Market Data</h4>
              <p className="text-neutral-400">
                Get live cryptocurrency prices, 24h changes, and market trends updated every 30 seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 hover:border-indigo-600 transition">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-semibold mb-2">AI Trade Analysis</h4>
              <p className="text-neutral-400">
                Get intelligent recommendations with confidence scores, risk assessment, and reasoning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 hover:border-indigo-600 transition">
              <div className="text-4xl mb-4">💼</div>
              <h4 className="text-xl font-semibold mb-2">Portfolio Management</h4>
              <p className="text-neutral-400">
                Track your holdings, monitor gains/losses, and manage your crypto portfolio in one place.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 hover:border-indigo-600 transition">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-2">Risk Assessment</h4>
              <p className="text-neutral-400">
                Evaluate trade risks before execution with AI-powered analysis and recommendations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 hover:border-indigo-600 transition">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-xl font-semibold mb-2">Market Sentiment</h4>
              <p className="text-neutral-400">
                Get AI-generated market sentiment analysis and insights about crypto movements.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700 hover:border-indigo-600 transition">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-xl font-semibold mb-2">AI Chatbot</h4>
              <p className="text-neutral-400">
                Chat with our AI assistant for trading questions, market insights, and strategy advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-indigo-600/10 border-y border-neutral-700">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Trading?</h3>
          <p className="text-neutral-300 mb-8">
            Join thousands of traders using AI-powered insights to make smarter trading decisions.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800 border-t border-neutral-700 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-neutral-400">
          <p>&copy; 2024 Crypto Trading Platform. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
}
