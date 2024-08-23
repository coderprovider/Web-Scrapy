import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Layout from './layout/layout';
import ProjectPage from './pages/project';
import ClientPage from './pages/client';
import CrawlPage from './pages/crawl';

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Dashboard />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/client" element={<ClientPage />} />
          <Route path="/crawl" element={<CrawlPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
