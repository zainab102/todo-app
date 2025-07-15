import React from 'react';

export function Tabs({ todos, selectedTab, setSelectedTab }) {
  const tabs = ['All', 'Open', 'Completed', 'Deleted'];

  // Helper to count tasks per tab
  const getCount = (tab) => {
    switch (tab) {
      case 'All':
        return todos.length;
      case 'Open':
        return todos.filter(todo => !todo.complete && !todo.deleted).length;
      case 'Completed':
        return todos.filter(todo => todo.complete && !todo.deleted).length;
      case 'Deleted':
        return todos.filter(todo => todo.deleted).length;
      default:
        return 0;
    }
  };

  return (
    <nav
      className="tab-container"
      aria-label="Task filter tabs"
      role="tablist"
      style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}
    >
      {tabs.map((tab) => {
        const count = getCount(tab);
        const isSelected = tab === selectedTab;

        return (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`tab-button ${isSelected ? 'tab-selected' : ''}`}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            aria-controls={`panel-${tab.toLowerCase()}`}
            id={`tab-${tab.toLowerCase()}`}
            style={{
              padding: '8px 16px',
              backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
              color: isSelected ? 'white' : '#1e293b',
              border: 'none',
              borderRadius: '6px',
              fontWeight: isSelected ? '600' : '400',
              cursor: 'pointer',
            }}
          >
            {tab} <span style={{ fontWeight: 'normal' }}>({count})</span>
          </button>
        );
      })}
    </nav>
  );
}
