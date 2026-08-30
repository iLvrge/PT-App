import React from 'react'
import { isChunkLoadError } from '../../../utils/lazyWithRetry'

/**
 * Catches render errors in the subtree below it.
 *
 * The default fallback is unchanged from the original so the existing in-pane
 * usages (AssetDetailsContainer, IllustrationCommentContainer,
 * IllustrationContainer) look exactly as before. Route-level callers pass a
 * richer `fallback`.
 *
 * Two fixes over the previous version:
 *  - state is set in `getDerivedStateFromError`, so the fallback renders on the
 *    error render itself rather than one commit later via `componentDidCatch`.
 *  - the boundary can be reset, so a recoverable error is not permanent.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
    this.reset = this.reset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })

    // Optional reporting hook. Sentry.init is currently commented out in
    // index.js, so nothing is wired by default — pass onError to opt in.
    if (typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, errorInfo)
      } catch (_) {
        /* a failing reporter must not mask the original error */
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { resetKeys } = this.props
    if (!this.state.error || !resetKeys) return

    const prevKeys = prevProps.resetKeys || []
    const changed =
      resetKeys.length !== prevKeys.length ||
      resetKeys.some((key, i) => !Object.is(key, prevKeys[i]))

    if (changed) this.reset()
  }

  reset() {
    this.setState({ error: null, errorInfo: null })
  }

  render() {
    const { error, errorInfo } = this.state
    const { fallback, children } = this.props

    if (!error) return children

    if (typeof fallback === 'function') {
      return fallback({
        error,
        errorInfo,
        reset: this.reset,
        isChunkError: isChunkLoadError(error),
      })
    }
    if (fallback) return fallback

    // Preserved verbatim from the original implementation.
    return (
      <div>
        <h2>This request is temporarily un-servable, please try a different one.</h2>
      </div>
    )
  }
}

export default ErrorBoundary
