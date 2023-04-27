/* eslint-disable react/destructuring-assignment */
import { Component } from 'react'
import type { ReactNode } from 'react'
import { InternalError } from '@/ui/page/internalError/internalError'

interface ErrorBoundaryProps {
  children?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public render(): ReactNode {
    return this.state.hasError ? <InternalError /> : this.props.children
  }
}
