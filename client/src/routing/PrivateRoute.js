import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  loading,
  setState,
  setLoading,
  results,
  onSelectResult,
  selectedPartner,
  setResults,
  onClose,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to="/login" />
        ) : (
          <Component
            {...props}
            setState={setState}
            setLoading={setLoading}
            results={results}
            onSelectResult={onSelectResult}
            selectedPartner={selectedPartner}
            setResults={setResults}
            onClose={onClose}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
