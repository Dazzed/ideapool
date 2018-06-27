import "babel-polyfill";
import ReactOnRails from 'react-on-rails';

import SignUp from '../bundles/RailsReact/components/SignUp';
// This is how react_on_rails can see the React components in the browser.
ReactOnRails.register({
    SignUp
});
