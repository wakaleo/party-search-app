import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import PartySearch from './PartySearch';
import { describe, expect } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('PartySearch Component', () => {
  it('should display the search input', () => {
    render(<PartySearch />);
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
    expect(inputElement).toBeInTheDocument();
  });

  it('should update the input value based on user input', () => {
    const parties = [
      { partyId: '12345678', partyName: 'Sarah-Jane Smith' },
    ];
  
    mock.onGet('/party/search?q=Sarah').reply(200, parties);
    
    render(<PartySearch />);
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
    expect(inputElement.value).toBe('');
  
    fireEvent.change(inputElement, { target: { value: 'Sarah' } });
    expect(inputElement.value).toBe('Sarah');
  });

  it('should fetches matching parties from the party search API', async () => {
    const parties = [
      { partyId: '12345678', partyName: 'Sarah-Jane Smith' },
    ];
  
    mock.onGet('/party/search?q=Sarah').reply(200, parties);
  
    render(<PartySearch />);
  
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
  
    fireEvent.change(inputElement, { target: { value: 'Sarah' } });

    const searchResults = await screen.findAllByRole('listitem');
    const partyNames = searchResults.map((result) => result.textContent);

    expect(partyNames).toEqual(['Sarah-Jane Smith']);
  });
  

  it('should fetches multiple matching parties from the party search API', async () => {
    const parties = [
      { partyId: '10000001', partyName: 'Sarah-Jane Smith' },
      { partyId: '10000002', partyName: 'Sarah Connor' }
    ];
  
    mock.onGet('/party/search?q=Sarah').reply(200, parties);
  
    render(<PartySearch />);
  
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
  
    fireEvent.change(inputElement, { target: { value: 'Sarah' } });
  
    const searchResults = await screen.findAllByRole('listitem');

    const partyNames = searchResults.map((result) => result.textContent);

    expect(partyNames).toEqual(['Sarah-Jane Smith', 'Sarah Connor']);
  });

  it('should display no parties when search term does not match', async () => {
    mock.onGet('/party/search?q=Nonexistent').reply(200, []);
  
    render(<PartySearch />);
    let partyItems = [];
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
    act(() => {
      fireEvent.change(inputElement, { target: { value: 'Nonexistent' } });
      partyItems = screen.queryAllByRole('listitem');
    });
    expect(partyItems.length).toBe(0);
  });

  it('should display no parties when search term is empty', async () => {
    mock.onGet('/party/search?q=').reply(200, []);
  
    render(<PartySearch />);
  
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
    fireEvent.change(inputElement, { target: { value: '' } });
  
    const partyItems = await screen.queryAllByRole('listitem');
    expect(partyItems.length).toBe(0);
  });

  it('should inform the user if the search API failed or is unavailable', async () => {
    // Mock the API to return a failure (e.g., 500 error)
    mock.onGet('/party/search?q=Sarah').reply(500);  // Simulate API failure

    // Render the PartySearch component
    render(<PartySearch />);

    // Find the input field and simulate entering a search query
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
    fireEvent.change(inputElement, { target: { value: 'Sarah' } });

    // Wait for the component to handle the API call and error state
    await waitFor(() => {
      // Check that the error message is displayed to the user
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('An error occurred while fetching the results. Please try again later.');
    });

    // Assert that no results are shown (i.e., no list items)
    const searchResults = screen.queryAllByRole('listitem');
    expect(searchResults).toHaveLength(0);
  });

  it('should not call the API if the query is empty', async () => {
    // Spy on the axios.get method to check if it is called
    const axiosSpy = vi.spyOn(axios, 'get');

    // Render the PartySearch component
    render(<PartySearch />);

    // Find the input field and simulate entering an empty search query
    const inputElement = screen.getByPlaceholderText(/Search by name or ID/i);
    fireEvent.change(inputElement, { target: { value: ' ' } });  // Simulate empty input

    // Assert that the API was not called
    expect(axiosSpy).not.toHaveBeenCalled();

    // Clean up the spy
    axiosSpy.mockRestore();
  });

});
