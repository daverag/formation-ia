import { Component } from 'react';
import { Card } from './Card.jsx';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="center-screen">
          <Card className="narrow-card">
            <h1>Une erreur est arrivée</h1>
            <p>Rechargez la page. Si le problème continue, demandez de l’aide à votre coach.</p>
          </Card>
        </main>
      );
    }

    return this.props.children;
  }
}
