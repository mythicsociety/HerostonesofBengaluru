
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    return this.state.hasError ? <h2>Something went wrong</h2> : this.props.children;
  }
}
// No export statement; ErrorBoundary is now global for in-browser Babel
