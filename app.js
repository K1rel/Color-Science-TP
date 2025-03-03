import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import ColorSpaceConverter from './src/components/ColorSpaceConverter';
const App = () => {
    return (_jsxs("div", { children: [_jsx("h1", { children: "Color Space Converter" }), _jsx(ColorSpaceConverter, {})] }));
};
const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(_jsx(App, {}));
}
