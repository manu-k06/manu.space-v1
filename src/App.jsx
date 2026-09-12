import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Journey } from './pages/Journey';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';

/**
 * Main Application Component.
 * 
 * Demonstrates React Router v6:
 * - Nested routing with Layout
 * - Route path matching
 * - Fallback redirection for unknown paths
 */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="journey" element={<Journey />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
