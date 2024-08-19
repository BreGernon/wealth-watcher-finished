import { render, screen } from '@testing-library/react'; // Import rendering and screen utilities from Testing Library
import App from './App'; // Import the App component to test

test('renders learn react link', () => {
  render(<App />); // Render the App component
  
  // Query the screen for a text element that matches the regex pattern
  const linkElement = screen.getByText(/learn react/i);
  
  // Assert that the element is present in the document
  expect(linkElement).toBeInTheDocument();
});
