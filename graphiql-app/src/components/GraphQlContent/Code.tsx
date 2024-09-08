import React, { useState } from 'react';
import { parse, print } from 'graphql';

const GraphQLFormatter: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [formattedQuery, setFormattedQuery] = useState<string>('');

  const handleFormat = () => {
    try {
      const parsedQuery = parse(query);
      const printedQuery = print(parsedQuery);
      setFormattedQuery(printedQuery);
    } catch (error) {
      console.error('Invalid GraphQL query:', error);
      setFormattedQuery('Invalid GraphQL query.');
    }
  };

  return (
    <div>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your GraphQL query here..."
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleFormat}>Format Query</button>
      <br />
      <textarea
        value={formattedQuery}
        readOnly
        placeholder="Formatted query will appear here..."
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default GraphQLFormatter;
