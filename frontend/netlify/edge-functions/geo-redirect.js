export default async (request, context) => {
  const url = new URL(request.url);
  const country = context.geo?.country?.code;
  
  // Redirect certain countries to localized versions
  const redirects = {
    'GB': '/uk',
    'CA': '/ca',
    'AU': '/au',
    'DE': '/de',
    'FR': '/fr',
    'IN': '/in'
  };
  
  if (redirects[country] && url.pathname === '/') {
    return Response.redirect(url.origin + redirects[country], 302);
  }
  
  // Add geo information to headers for analytics
  const response = await context.next();
  response.headers.set('X-Country', country || 'unknown');
  response.headers.set('X-City', context.geo?.city || 'unknown');
  
  return response;
};