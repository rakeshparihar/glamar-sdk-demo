import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type SdkStatus = 'idle' | 'loading' | 'ready' | 'error'

declare global {
  interface Window {
    GlamARSkinAnalysisSDK?: {
      init: (config: Record<string, unknown>) => Promise<unknown>
      open: (options?: Record<string, unknown>) => Promise<unknown>
    }
  }
}

const sdkScriptUrl = import.meta.env.VITE_GLAMAR_SDK_SCRIPT_URL as string | undefined
const apiKey = import.meta.env.VITE_GLAMAR_API_KEY as string | undefined
const analysisTarget = import.meta.env.VITE_GLAMAR_ANALYSIS_TARGET as string | undefined

function App() {
  const [status, setStatus] = useState<SdkStatus>('idle')
  const [error, setError] = useState<string>('')
  const [isLaunching, setIsLaunching] = useState(false)

  const hasConfig = useMemo(() => Boolean(sdkScriptUrl && apiKey), [])

  useEffect(() => {
    if (!hasConfig || !sdkScriptUrl) {
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-glamar-sdk="true"]')
    if (existing) {
      setStatus('ready')
      return
    }

    setStatus('loading')
    const script = document.createElement('script')
    script.src = sdkScriptUrl
    script.async = true
    script.dataset.glamarSdk = 'true'

    script.onload = () => {
      if (!window.GlamARSkinAnalysisSDK) {
        setError('GlamAR script loaded but SDK object is missing. Verify the script URL from the docs.')
        setStatus('error')
        return
      }

      setStatus('ready')
    }

    script.onerror = () => {
      setError('Failed to load GlamAR SDK script. Check VITE_GLAMAR_SDK_SCRIPT_URL.')
      setStatus('error')
    }

    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [hasConfig])

  const launchAnalysis = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!window.GlamARSkinAnalysisSDK) {
      setError('SDK is not ready yet. Wait for the script to finish loading.')
      return
    }

    try {
      setIsLaunching(true)

      await window.GlamARSkinAnalysisSDK.init({
        apiKey,
        target: analysisTarget ?? 'face',
      })

      await window.GlamARSkinAnalysisSDK.open({
        mode: 'selfie',
      })
    } catch (launchError) {
      setError(
        launchError instanceof Error
          ? launchError.message
          : 'The SDK launch failed. Confirm your key and SDK options from the docs.',
      )
    } finally {
      setIsLaunching(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <h1>GlamAR Skin Analysis SDK Demo</h1>
        <p>
          This React demo loads the SDK script dynamically and launches skin analysis from a button.
        </p>

        <ul className="checklist">
          <li>Script URL: {sdkScriptUrl ? 'configured' : 'missing'}</li>
          <li>API key: {apiKey ? 'configured' : 'missing'}</li>
          <li>SDK status: {status}</li>
        </ul>

        <form onSubmit={launchAnalysis}>
          <button disabled={!hasConfig || status !== 'ready' || isLaunching} type="submit">
            {isLaunching ? 'Launching...' : 'Start Skin Analysis'}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        {!hasConfig ? (
          <p className="hint">
            Add <code>VITE_GLAMAR_SDK_SCRIPT_URL</code> and <code>VITE_GLAMAR_API_KEY</code> in <code>.env</code>.
          </p>
        ) : null}
      </section>
    </main>
  )
}

export default App
