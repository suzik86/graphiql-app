import React, { useState } from 'react';
import { parse, print } from 'graphql';

const GraphQLBeautifier: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');

  const handleBeautify = () => {
    try {
  
      const ast = parse(code);
      
      const formatted = print(ast);
      setFormattedCode(formatted);
    } catch (error) {
      console.error('Error formatting code:', error);
      setFormattedCode('Error formatting code');
    }
  };

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter GraphQL code here..."
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleBeautify}>Beautify</button>
      <br />
      <textarea
        value={formattedCode}
        readOnly
        placeholder="Formatted GraphQL code will appear here..."
        rows={10}
        cols={50}
      />
    </div>
  );
};

export default GraphQLBeautifier;
