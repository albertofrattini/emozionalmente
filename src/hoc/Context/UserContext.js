import React from 'react';

// The createContext method takes in an optional defaultValue argument, 
// which is provided to Context.Consumer if a matching Context.Provider 
// component could not be found in the tree

const userContext = React.createContext(
    {
        user: {}
    }
);

export {
    userContext
};