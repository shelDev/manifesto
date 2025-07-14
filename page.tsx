import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Voice Journal</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Record your thoughts, emotions, notes, reminders and memories through voice journaling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Recent Entries</h2>
            <div className="bg-background-dark rounded-lg p-6 text-center">
              <p className="text-text-secondary mb-4">No journal entries yet</p>
              <a href="/record" className="btn btn-primary">Start Journaling</a>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Journal Prompts</h2>
            <div className="space-y-4">
              <div className="bg-background-dark rounded-lg p-4">
                <p className="text-text-primary">What's something that made you smile today?</p>
              </div>
              <div className="bg-background-dark rounded-lg p-4">
                <p className="text-text-primary">Describe a challenge you're currently facing and how you plan to overcome it.</p>
              </div>
              <div className="bg-background-dark rounded-lg p-4">
                <p className="text-text-primary">What are you grateful for right now?</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Voice Recording</h3>
            <p className="text-text-secondary mb-4">Easily capture your thoughts with voice recording and automatic transcription</p>
            <a href="/record" className="btn btn-outline">Record Now</a>
          </div>

          <div className="card text-center p-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Entries</h3>
            <p className="text-text-secondary mb-4">Review and search through your past journal entries</p>
            <a href="/browse" className="btn btn-outline">View Entries</a>
          </div>

          <div className="card text-center p-6">
            <div className="w-16 h-16 bg-accent1 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-text-secondary mb-4">Get AI-powered insights into your moods, topics, and patterns</p>
            <a href="/insights" className="btn btn-outline">View Insights</a>
          </div>
        </div>
      </div>
    </main>
  );
}
