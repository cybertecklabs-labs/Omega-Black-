import { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>OMEGA BLACK – AI Bug Bounty</title>
        <meta name="description" content="Autonomous AI Bug Bounty Platform" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">🖤 OMEGA BLACK</h1>
          <p className="text-xl text-gray-300 mb-8">Sovereign AI Security Fabric</p>
          <div className="bg-gray-800 p-8 rounded-lg max-w-2xl">
            <p className="mb-4">This is a <span className="text-blue-400">static demo</span> of the OMEGA BLACK frontend.</p>
            <p className="text-sm text-gray-400">Full interactive version requires backend deployment.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded text-center">📊 Dashboard</div>
              <div className="bg-gray-700 p-4 rounded text-center">🤖 AI Analysis</div>
              <div className="bg-gray-700 p-4 rounded text-center">🔍 Recon</div>
              <div className="bg-gray-700 p-4 rounded text-center">📈 Reports</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
