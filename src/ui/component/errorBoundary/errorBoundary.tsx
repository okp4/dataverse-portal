import React, { Component } from 'react'
import type { ReactNode } from 'react'
import { RenderingError } from '@/ui/page/error/renderingError/renderingError'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render(): ReactNode {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasError) {
      return <RenderingError />
    }

    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children
  }
}

export default ErrorBoundary
