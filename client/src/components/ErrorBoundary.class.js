import React from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <>
                    <div className="container">
                        <h2>There was an error.</h2>
                        <Link to="/">Back to Search</Link>
                    </div>
                </>
            )
        }

        return this.props.children;
    }
}