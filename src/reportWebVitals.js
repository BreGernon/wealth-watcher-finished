const reportWebVitals = onPerfEntry => {
  // Check if onPerfEntry is provided and is a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import the 'web-vitals' library
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Call each web vitals function with the onPerfEntry callback
      getCLS(onPerfEntry); // Cumulative Layout Shift (CLS) measures layout shifts during page load
      getFID(onPerfEntry); // First Input Delay (FID) measures the time from user interaction to browser response
      getFCP(onPerfEntry); // First Contentful Paint (FCP) measures the time when the first piece of content is painted
      getLCP(onPerfEntry); // Largest Contentful Paint (LCP) measures the time when the largest content element is painted
      getTTFB(onPerfEntry); // Time to First Byte (TTFB) measures the time taken to receive the first byte of the response
    });
  }
};

export default reportWebVitals;
