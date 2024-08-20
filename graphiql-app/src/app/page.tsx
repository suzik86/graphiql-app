// src/app/page.tsx
'use client';
import React from 'react';
import styles from './page.module.css'; // Импорт стилей для страницы
import Header from './components/Header/Header';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <h1>Welcome Back, [Username]!</h1>
        </section>
        <nav>
          <a href="#rest-client">REST Client</a>
          <a href="#graphql-client">GraphiQL Client</a>
          <a href="#history">History</a>
        </nav>
        <section id="rest-client" style={{ height: '100vh', background: '#f0f0f0' }}>
          <h2>REST Client Section</h2>
          <p>Content for REST Client...</p>
        </section>
        <section id="graphql-client" style={{ height: '100vh', background: '#e0e0e0' }}>
          <h2>GraphiQL Client Section</h2>
          <p>Content for GraphiQL Client...</p>
        </section>
        <section id="history" style={{ height: '100vh', background: '#d0d0d0' }}>
          <h2>History Section</h2>
          <p>Content for History...</p>
        </section>
      </main>
      <footer>
        <a href="https://github.com">GitHub Link</a>
        <span>{new Date().getFullYear()}</span>
        <div>[Course Logo]</div>
      </footer>
    </div>
  );
};

export default Home;
