import React from 'react';

export const ApiContext = React.createContext({
  showSpinner: false,
  setShowSpinner: (value: boolean) => {},
});
