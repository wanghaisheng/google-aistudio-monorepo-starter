/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HotRoute {
  path: string;
  visits: number;
}

/**
 * AnalyticsService simulates querying Cloudflare Zone Analytics.
 */
export class AnalyticsService {
  /**
   * Fetches the most visited routes.
   * In a real scenario, this would call the Cloudflare GraphQL Analytics API.
   */
  async getHotRoutes(limit: number = 100): Promise<HotRoute[]> {
    // Mocking analytics data
    // In a real app, this would be: 
    // fetch('https://api.cloudflare.com/client/v4/zones/{zone_id}/analytics/dashboard/...')
    
    return [
      { path: '/', visits: 5000 },
      { path: '/products/1', visits: 3500 },
      { path: '/products/2', visits: 2800 },
      { path: '/about', visits: 1200 },
    ].slice(0, limit);
  }
}
