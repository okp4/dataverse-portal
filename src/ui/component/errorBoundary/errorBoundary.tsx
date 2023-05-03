/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
import { Component, useState, useEffect } from 'react'
import type { SetStateAction, Dispatch, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { InternalError } from '@/ui/page/internalError/internalError'

type ErrorBoundaryInnerProps = {
  children: JSX.Element
  hasError: boolean
  setHasError: Dispatch<SetStateAction<boolean>>
}
type ErrorBoundaryProps = {
  children: JSX.Element
}
type ErrorBoundaryInnerState = {
  hasError: boolean
}
class ErrorBoundaryInner extends Component<ErrorBoundaryInnerProps, ErrorBoundaryInnerState> {
  constructor(props: ErrorBoundaryInnerProps) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(): ErrorBoundaryInnerState {
    return { hasError: true }
  }
  componentDidUpdate(prevProps: ErrorBoundaryInnerProps): void {
    if (!this.props.hasError && prevProps.hasError) {
      this.setState({ hasError: false })
    }
  }
  componentDidCatch(): void {
    this.props.setHasError(true)
  }

  render(): ReactNode {
    return this.state.hasError ? <InternalError /> : this.props.children
  }
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps): JSX.Element => {
  const [hasError, setHasError] = useState(false)
  const location = useLocation()
  useEffect(() => {
    hasError && setHasError(false)
  }, [location.key])
  return (
    <ErrorBoundaryInner hasError={hasError} setHasError={setHasError}>
      {children}
    </ErrorBoundaryInner>
  )
}
