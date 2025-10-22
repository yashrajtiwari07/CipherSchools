import React from 'react';
import ProjectList from '../components/Project/ProjectList';
import './Pages.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <ProjectList />
      </main>
    </div>
  );
};

export default Dashboard;
