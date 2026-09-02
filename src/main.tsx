import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './styles/global.css';
import './styles/living-canvas.css';
import './styles/reference-desk.css';
import './styles/cinema-home.css';
import './styles/brush-reveal.css';
import './styles/art-story.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
