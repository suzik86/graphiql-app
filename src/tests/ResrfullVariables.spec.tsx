import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariableEditor from '../components/RestClient/VariablesEditor';


describe('VariableEditor Component', () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
      });
      
      afterAll(() => {
        jest.restoreAllMocks();
      });
  const mockVariables = [
    { key: 'name', value: 'John', included: true },
    { key: 'age', value: '30', included: true },
  ];
  
  const mockSetVariables = jest.fn();
  const mockOnUpdateBody = jest.fn();
  
  test('renders variables correctly', () => {
    render(
      <VariableEditor
        variables={mockVariables}
        setVariables={mockSetVariables}
        body="Some body content"
        onUpdateBody={mockOnUpdateBody}
      />
    );
    
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });
  
  test('adds a new variable and updates body', () => {
    render(
      <VariableEditor
        variables={mockVariables}
        setVariables={mockSetVariables}
        body="Some body content"
        onUpdateBody={mockOnUpdateBody}
      />
    );
    
    const newVariableKeyInput = screen.getByPlaceholderText('variable Key');
    const newVariableValueInput = screen.getByPlaceholderText('variable Value');
    const addButton = screen.getByText('Add variable');
    
    fireEvent.change(newVariableKeyInput, { target: { value: 'location' } });
    fireEvent.change(newVariableValueInput, { target: { value: 'NY' } });
    fireEvent.click(addButton);
    
    expect(mockSetVariables).toHaveBeenCalledWith([
      ...mockVariables,
      { key: 'location', value: 'NY', included: true },
    ]);
    expect(mockOnUpdateBody).toHaveBeenCalled();
  });

  test('deletes a variable', () => {
    render(
      <VariableEditor
        variables={mockVariables}
        setVariables={mockSetVariables}
        body="Some body content"
        onUpdateBody={mockOnUpdateBody}
      />
    );
    
    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);
    
    expect(mockSetVariables).toHaveBeenCalledWith([mockVariables[1]]);
  });
});
