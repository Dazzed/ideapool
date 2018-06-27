import "babel-polyfill";
import ReactOnRails from 'react-on-rails';

import SignUp from '../bundles/RailsReact/components/SignUp';
import SignIn from '../bundles/RailsReact/components/SignIn';
import Ideas from '../bundles/RailsReact/components/Ideas';

// This is how react_on_rails can see the React components in the browser.
ReactOnRails.register({
    SignUp,
    SignIn,
    Ideas
});
