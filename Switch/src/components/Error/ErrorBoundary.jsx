import React, { Component } from 'react';
import './ErrorBoundary.css'; 

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error:", error);
    console.error("ErrorInfo:", errorInfo);
  }

  handleReload = () => {window.location.reload();};

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <i className="fas fa-exclamation-triangle error-icon"></i> 
          <div>
            <h2>Algo salió mal</h2>
            <p>Por favor, vuelva a intertarlo más tarde o recarga la página</p>
            <button className="retry-button" onClick={this.handleReload}>Recargar</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;