export default async (request, context) => {
  const url = new URL(request.url);
  
  // Simple A/B testing logic
  if (url.pathname.startsWith('/jobs')) {
    const cookie = request.headers.get('cookie');
    let variant = 'A';
    
    // Check if user already has a variant assigned
    if (cookie && cookie.includes('ab_variant=')) {
      const match = cookie.match(/ab_variant=([AB])/);
      if (match) {
        variant = match[1];
      }
    } else {
      // Assign variant based on random distribution (50/50)
      variant = Math.random() < 0.5 ? 'A' : 'B';
    }
    
    const response = await context.next();
    
    // Set variant cookie if not already set
    if (!cookie || !cookie.includes('ab_variant=')) {
      response.headers.set('Set-Cookie', `ab_variant=${variant}; Path=/; Max-Age=86400; SameSite=Strict`);
    }
    
    // Add variant to response headers for analytics
    response.headers.set('X-AB-Variant', variant);
    
    return response;
  }
  
  return context.next();
};